import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const DEFAULT_BASE_URL =
  "https://smart-explanation-plaform-production-1bd6.up.railway.app";

function option(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

const collectionPath = option("--collection", process.env.POSTMAN_COLLECTION);
const environmentPath = option(
  "--environment",
  process.env.POSTMAN_ENVIRONMENT,
);
const environment = environmentPath
  ? JSON.parse(await readFile(environmentPath, "utf8"))
  : undefined;

function environmentValue(key) {
  return environment?.values?.find(
    (entry) => entry.key === key && entry.enabled !== false,
  )?.value;
}

const baseUrl = option(
  "--base-url",
  environmentValue("baseUrl") ?? process.env.API_BASE_URL ?? DEFAULT_BASE_URL,
).replace(/\/+$/, "");
const outputPath = option(
  "--output",
  path.join("qa-reports", "api-test-results.json"),
);
const concurrency = Math.max(1, Number(option("--concurrency", "3")) || 3);

if (!collectionPath) {
  throw new Error(
    "Pass --collection <path> or set POSTMAN_COLLECTION. Credentials are read at runtime and are never written to the report.",
  );
}

const collection = JSON.parse(await readFile(collectionPath, "utf8"));

function flatten(items, folders = [], result = []) {
  for (const item of items ?? []) {
    if (item.request) {
      result.push({ folders, name: item.name, request: item.request });
    } else if (item.item) {
      flatten(item.item, [...folders, item.name], result);
    }
  }
  return result;
}

const requests = flatten(collection.item);

function rawUrl(request) {
  if (typeof request.url === "string") return request.url;
  if (request.url?.raw) return request.url.raw;
  return `/${(request.url?.path ?? []).join("/")}`;
}

function endpointPath(request) {
  const raw = rawUrl(request).replace(/^\{\{baseUrl\}\}/, "");
  if (/^https?:\/\//i.test(raw)) {
    try {
      const url = new URL(raw);
      return url.origin === baseUrl ? `${url.pathname}${url.search}` : raw;
    } catch {
      return raw;
    }
  }
  return raw.startsWith("/") ? raw : `/${raw}`;
}

function parseRawBody(request) {
  if (request.body?.mode !== "raw" || !request.body.raw?.trim()) return undefined;
  try {
    return JSON.parse(request.body.raw);
  } catch {
    const email = request.body.raw.match(/"email"\s*:\s*"([^"]+)"/i)?.[1];
    const password = request.body.raw.match(/"password"\s*:\s*"([^"]+)"/i)?.[1];
    return email && password ? { email, password } : undefined;
  }
}

function findString(value, keys, depth = 0) {
  if (!value || typeof value !== "object" || depth > 8) return undefined;
  for (const key of keys) {
    if (typeof value[key] === "string" && value[key]) return value[key];
  }
  for (const child of Object.values(value)) {
    const found = findString(child, keys, depth + 1);
    if (found) return found;
  }
  return undefined;
}

function responseMessage(value, fallback) {
  return findString(value, ["message", "error", "msg"], 0) ?? fallback;
}

async function fetchJson(url, init = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 90_000);
  const startedAt = Date.now();
  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    const contentType = response.headers.get("content-type") ?? "";
    const payload = contentType.includes("application/json")
      ? await response.json()
      : await response.text();
    return {
      status: response.status,
      durationMs: Date.now() - startedAt,
      payload,
    };
  } finally {
    clearTimeout(timer);
  }
}

async function loginSessions() {
  const sessions = {};
  const attempts = [];
  const candidates = requests.filter(
    ({ request }) =>
      request.method === "POST" &&
      /\/api\/v1\/auth\/(students|instructors)\/login\/?$/.test(
        endpointPath(request),
      ) &&
      parseRawBody(request),
  );

  for (const candidate of candidates) {
    const requestPath = endpointPath(candidate.request);
    const label = [...candidate.folders, candidate.name].join(" / ");
    try {
      const result = await fetchJson(`${baseUrl}${requestPath}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parseRawBody(candidate.request)),
      });
      const token = findString(result.payload, ["token", "accessToken", "access_token", "jwt"]);
      const responseRole = findString(result.payload, ["role", "userType"])?.toLowerCase();
      const role = /admin/i.test(candidate.name)
        ? "admin"
        : responseRole === "admin" || responseRole === "student" || responseRole === "instructor"
          ? responseRole
          : requestPath.includes("/students/")
            ? "student"
            : "instructor";
      if (token && result.status >= 200 && result.status < 300) sessions[role] = token;
      attempts.push({
        label,
        role,
        status: result.status,
        durationMs: result.durationMs,
        tokenReceived: Boolean(token),
        message: responseMessage(result.payload, ""),
      });
    } catch (error) {
      attempts.push({
        label,
        role: "unknown",
        status: 0,
        durationMs: 0,
        tokenReceived: false,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }
  return { sessions, attempts };
}

function tokenRole(pathname, folders) {
  const folderText = folders.join("/").toLowerCase();
  if (/\/students\/getme|\/students\/update|\/students\/deleteme/.test(pathname)) return "student";
  if (/\/instructors\/getme|\/instructors\/update|\/instructors\/deleteme/.test(pathname)) return "instructor";
  if (/\/requests\/me/.test(pathname)) return "student";
  if (/\/offers\/me/.test(pathname)) return "instructor";
  if (/\/offers\/request\//.test(pathname)) return "student";
  if (/\/orders\/me|\/orders\/getmyvideos/i.test(pathname)) return "student";
  if (/\/offers\/createUploadUrl/i.test(pathname)) return "instructor";
  if (/\/orders\/createUploadUrl/i.test(pathname)) return "instructor";
  if (/\/assignments\/.+\/getSolution/i.test(pathname)) return "student";
  if (/\/wallets\/me/.test(pathname)) return "student";
  if (/\/chats\/user/.test(pathname)) return "student";
  if (/\/notifications\/me/.test(pathname)) return "student";
  if (folderText.includes("logged intructor")) return "instructor";
  if (folderText.includes("logged student")) return "student";
  if (folderText.includes("live")) return "instructor";
  return "admin";
}

function collectIds(value, output = []) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectIds(item, output));
  } else if (value && typeof value === "object") {
    if (typeof value._id === "string") output.push(value._id);
    else if (typeof value.id === "string") output.push(value.id);
    Object.values(value).forEach((item) => collectIds(item, output));
  }
  return [...new Set(output)];
}

const resourcePaths = {
  instructor: "/api/v1/instructors",
  student: "/api/v1/students",
  country: "/api/v1/countries",
  field: "/api/v1/fields",
  major: "/api/v1/majors",
  transaction: "/api/v1/transactions",
  request: "/api/v1/requests/",
  offer: "/api/v1/offers/",
  order: "/api/v1/orders",
  plan: "/api/v1/subscriptionPlan",
  subscription: "/api/v1/subscriptions/",
  price: "/api/v1/hourlyPrices",
  chat: "/api/v1/chats",
  notification: "/api/v1/notifications",
  withdrawal: "/api/v1/wallets/withdrawalRequests",
};

async function discoverIds(adminToken) {
  const ids = {};
  if (!adminToken) return ids;
  for (const [resource, pathname] of Object.entries(resourcePaths)) {
    try {
      const result = await fetchJson(`${baseUrl}${pathname}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (result.status >= 200 && result.status < 300) {
        ids[resource] = collectIds(result.payload)[0];
      }
    } catch {
      // The endpoint result itself is recorded in the main pass.
    }
  }
  return ids;
}

function resourceForPlaceholder(name, pathname) {
  const normalized = name.toLowerCase();
  if (normalized.includes("transaction")) return "withdrawal";
  if (normalized.includes("trans")) return "transaction";
  if (normalized.includes("request")) return "request";
  if (normalized.includes("offer")) return "offer";
  if (normalized.includes("order")) return "order";
  if (normalized.includes("field")) return "field";
  if (normalized.includes("major")) return "major";
  if (normalized.includes("country")) return "country";
  if (normalized.includes("plan")) return "plan";
  if (normalized.includes("subscription")) return "subscription";
  if (normalized.includes("price")) return "price";
  if (normalized.includes("chat")) return "chat";
  if (normalized.includes("session")) return "session";
  if (normalized.includes("live")) return "live";
  if (normalized === "id") {
    if (pathname.includes("notifications")) return "notification";
    if (pathname.includes("lives/live")) return "live";
  }
  return normalized;
}

function resolvePath(pathname, ids) {
  if (pathname === "/" || pathname === "") return { error: "missing_path" };
  if (/^https?:\/\//i.test(pathname)) return { error: "external_upload_url" };

  let resolved = pathname.replace(/:([A-Za-z][A-Za-z0-9]*)/g, (match, name) => {
    const resource = resourceForPlaceholder(name, pathname);
    return ids[resource] ?? match;
  });
  const hardcodedResource = pathname.includes("/instructors/")
    ? "instructor"
    : pathname.includes("/students/")
      ? "student"
      : pathname.includes("/countries/")
        ? "country"
        : pathname.includes("/hourlyPrices/country/")
          ? "country"
          : pathname.includes("/hourlyPrices/")
            ? "price"
            : pathname.includes("/subscriptionPlan/")
              ? "plan"
              : pathname.includes("/subscriptions/")
                ? "subscription"
                : pathname.includes("/notifications/")
                  ? "notification"
                  : pathname.includes("/assignments/")
                    ? "assignment"
                    : pathname.includes("/requests/")
                      ? "request"
                      : pathname.includes("/offers/")
                        ? "offer"
                        : pathname.includes("/orders/")
                          ? "order"
                          : undefined;
  if (hardcodedResource && ids[hardcodedResource]) {
    resolved = resolved.replace(/[a-f0-9]{24}/gi, ids[hardcodedResource]);
  }
  if (/:[A-Za-z]/.test(resolved)) return { error: "missing_test_resource" };
  return { pathname: resolved };
}

function classify(status) {
  if (status >= 200 && status < 300) return "passed";
  if (status === 401 || status === 403) return "authorization_failed";
  if (status === 404) return "not_found_or_stale_id";
  if (status >= 500) return "backend_error";
  if (status > 0) return "request_rejected";
  return "network_error";
}

async function mapLimit(items, limit, worker) {
  const results = new Array(items.length);
  let nextIndex = 0;
  async function run() {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      results[index] = await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

const { sessions, attempts: loginAttempts } = await loginSessions();
const environmentToken = environmentValue("token");
let environmentSessionRole;
if (environmentToken) {
  try {
    const payload = JSON.parse(
      Buffer.from(environmentToken.split(".")[1], "base64url").toString("utf8"),
    );
    const role = findString(payload, ["role", "userType"])?.toLowerCase();
    if (["admin", "student", "instructor"].includes(role) && !sessions[role]) {
      sessions[role] = environmentToken;
      environmentSessionRole = role;
    }
  } catch {
    // An invalid or opaque environment token is ignored without exposing it.
  }
}
const ids = await discoverIds(sessions.admin);
const safeRequests = requests.filter(({ request }) => request.method === "GET");

const results = await mapLimit(safeRequests, concurrency, async (entry) => {
  const originalPath = endpointPath(entry.request);
  const resolved = resolvePath(originalPath, ids);
  const label = [...entry.folders, entry.name].join(" / ");
  if (resolved.error) {
    return {
      label,
      method: "GET",
      path: originalPath,
      classification: "collection_blocked",
      reason: resolved.error,
    };
  }

  const role = tokenRole(resolved.pathname, entry.folders);
  const token = sessions[role];
  if (!token) {
    return {
      label,
      method: "GET",
      path: originalPath,
      resolvedPath: resolved.pathname,
      role,
      classification: "credentials_blocked",
      reason: `No valid ${role} session is available.`,
    };
  }

  try {
    const response = await fetchJson(`${baseUrl}${resolved.pathname}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return {
      label,
      method: "GET",
      path: originalPath,
      resolvedPath: resolved.pathname,
      role,
      status: response.status,
      durationMs: response.durationMs,
      classification: classify(response.status),
      message:
        response.status >= 200 && response.status < 300
          ? undefined
          : responseMessage(response.payload, ""),
    };
  } catch (error) {
    return {
      label,
      method: "GET",
      path: originalPath,
      resolvedPath: resolved.pathname,
      role,
      status: 0,
      classification: "network_error",
      message: error instanceof Error ? error.message : String(error),
    };
  }
});

const counts = results.reduce((summary, result) => {
  summary[result.classification] = (summary[result.classification] ?? 0) + 1;
  return summary;
}, {});

const report = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  collectionName: collection.info?.name,
  environmentName: environment?.name,
  environmentSessionRole,
  collectionEndpointCount: requests.length,
  scope: "Safe live pass: login plus every GET request in the collection. Mutations are not replayed against production data.",
  sessionsAvailable: Object.keys(sessions),
  loginAttempts,
  discoveredResourceKinds: Object.keys(ids),
  safeRequestCount: safeRequests.length,
  counts,
  results,
};

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

console.log(`Collection endpoints: ${requests.length}`);
console.log(`Safe GET requests tested: ${safeRequests.length}`);
console.log(`Sessions available: ${Object.keys(sessions).join(", ") || "none"}`);
console.log(`Result counts: ${JSON.stringify(counts)}`);
console.log(`Report: ${outputPath}`);
