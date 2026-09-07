import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const DEFAULT_BASE_URL = "https://smart-explanation-plaform-production-1bd6.up.railway.app";
const ZERO_ID = "000000000000000000000000";

function option(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

const collectionPath = option("--collection", process.env.POSTMAN_COLLECTION);
const environmentPath = option("--environment", process.env.POSTMAN_ENVIRONMENT);
const environment = environmentPath
  ? JSON.parse(await readFile(environmentPath, "utf8"))
  : undefined;
const environmentBaseUrl = environment?.values?.find(
  (entry) => entry.key === "baseUrl" && entry.enabled !== false,
)?.value;
const baseUrl = option(
  "--base-url",
  environmentBaseUrl ?? process.env.API_BASE_URL ?? DEFAULT_BASE_URL,
).replace(/\/+$/, "");
const outputPath = option("--output", path.join("qa-reports", "api-mutation-probes.json"));

if (!collectionPath) throw new Error("Pass --collection <path> or set POSTMAN_COLLECTION.");

const collection = JSON.parse(await readFile(collectionPath, "utf8"));

function flatten(items, folders = [], result = []) {
  for (const item of items ?? []) {
    if (item.request) result.push({ folders, name: item.name, request: item.request });
    else if (item.item) flatten(item.item, [...folders, item.name], result);
  }
  return result;
}

const requests = flatten(collection.item);
const mutationRequests = requests.filter(({ request }) => request.method !== "GET");

function labelOf(entry) {
  return [...entry.folders, entry.name].join(" / ");
}

function rawUrl(request) {
  if (typeof request.url === "string") return request.url;
  if (request.url?.raw) return request.url.raw;
  return `/${(request.url?.path ?? []).join("/")}`;
}

function endpointPath(request) {
  const raw = rawUrl(request).replace(/^\{\{baseUrl\}\}/, "");
  if (/^https?:\/\//i.test(raw)) return raw;
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
  for (const key of keys) if (typeof value[key] === "string" && value[key]) return value[key];
  for (const child of Object.values(value)) {
    const found = findString(child, keys, depth + 1);
    if (found) return found;
  }
  return undefined;
}

function messageOf(value) {
  return findString(value, ["message", "error", "msg"]) ?? "";
}

async function fetchJson(url, init = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 90_000);
  const startedAt = Date.now();
  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    const contentType = response.headers.get("content-type") ?? "";
    const payload = contentType.includes("application/json") ? await response.json() : await response.text();
    return { status: response.status, durationMs: Date.now() - startedAt, payload };
  } finally {
    clearTimeout(timer);
  }
}

async function loginSessions() {
  const sessions = {};
  const attempts = [];
  const candidates = requests.filter(({ request }) =>
    request.method === "POST" &&
    /\/api\/v1\/auth\/(students|instructors)\/login\/?$/.test(endpointPath(request)) &&
    parseRawBody(request),
  );

  for (const entry of candidates) {
    const requestPath = endpointPath(entry.request);
    const label = labelOf(entry);
    try {
      const response = await fetchJson(`${baseUrl}${requestPath}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parseRawBody(entry.request)),
      });
      const token = findString(response.payload, ["token", "accessToken", "access_token", "jwt"]);
      const responseRole = findString(response.payload, ["role", "userType"])?.toLowerCase();
      const role = /admin/i.test(entry.name)
        ? "admin"
        : ["admin", "student", "instructor"].includes(responseRole)
          ? responseRole
          : requestPath.includes("/students/") ? "student" : "instructor";
      if (token && response.status >= 200 && response.status < 300) sessions[role] = token;
      attempts.push({ label, role, status: response.status, durationMs: response.durationMs, tokenReceived: Boolean(token), message: messageOf(response.payload) });
    } catch (error) {
      attempts.push({ label, role: "unknown", status: 0, tokenReceived: false, message: error instanceof Error ? error.message : String(error) });
    }
  }
  return { sessions, attempts };
}

function roleFor(entry, pathname) {
  const label = labelOf(entry).toLowerCase();
  if (pathname.includes("/auth/")) return "public";
  if (label.includes("logged intructors") || label.includes("logged instructors")) return "instructor";
  if (label.includes("logged students")) return "student";
  if (/\/subscriptions(?:\/|$)/.test(pathname)) return "student";
  if (/\/requests\/(?:createDirectRequest)?$/.test(pathname) || /\/requests\/.+\/cancel$/.test(pathname)) return "student";
  if (/\/offers\/.+\/(?:accept|acceptDirect)$/.test(pathname)) return "student";
  if (/\/orders(?:\/live)?$/.test(pathname)) return "student";
  if (/\/offers(?:\/|$)/.test(pathname) || /\/orders\/(?:upload|submit|cancel|createUploadUrl)/.test(pathname)) return "instructor";
  if (/\/assignments\//.test(pathname)) return label.includes("approve request") ? "student" : "instructor";
  if (/\/lives(?:\/|$)/.test(pathname) || pathname === "/api/v1/wallets/withdraw") return "instructor";
  if (/\/notifications\/me\//.test(pathname)) return "student";
  return "admin";
}

function probePath(pathname) {
  return pathname
    .replace(/:[A-Za-z][A-Za-z0-9_]*/g, ZERO_ID)
    .replace(/\b[0-9a-f]{24}\b/gi, ZERO_ID);
}

function unsafeReason(pathname, method) {
  if (/\/updateMe$|\/updateMyPassword$|\/deleteMe$/.test(pathname)) return "would_change_or_delete_real_logged_in_account";
  if (/\/notifications\/me\/mark-all-read$/.test(pathname)) return "would_change_real_notification_state";
  if (method === "POST" && pathname === "/api/v1/chats") return "backend_accepts_empty_chat_payload";
  return "";
}

function classify(status, method, pathname) {
  if (status === 0) return "network_error";
  if (status >= 500) return "backend_error";
  if (status === 401 || status === 403) return "authorization_failed";
  if (status === 405) return "method_not_allowed";
  if (status >= 400) return "passed_validation_probe";
  if ((method === "DELETE" || method === "PATCH" || method === "PUT") && pathname.includes(ZERO_ID)) return "passed_idempotent_probe";
  return "unexpected_mutation_success";
}

const { sessions, attempts: loginAttempts } = await loginSessions();
const loginByLabel = new Map(loginAttempts.map((attempt) => [attempt.label, attempt]));
const results = [];

for (const entry of mutationRequests) {
  const label = labelOf(entry);
  const originalPath = endpointPath(entry.request);
  const method = entry.request.method;

  if (/^https?:\/\//i.test(originalPath) || originalPath.startsWith("/upload/") || originalPath === "/video/v1/uploads") {
    results.push({ label, method, path: originalPath, classification: "collection_blocked", reason: "external_upload_provider_not_replayed" });
    continue;
  }
  if (originalPath === "/") {
    results.push({ label, method, path: originalPath, classification: "collection_blocked", reason: "missing_path" });
    continue;
  }

  const pathname = probePath(originalPath);
  const safetyBlock = unsafeReason(pathname, method);
  if (safetyBlock) {
    results.push({ label, method, path: originalPath, resolvedPath: pathname, classification: "production_safety_blocked", reason: safetyBlock });
    continue;
  }

  if (/\/auth\/(?:students|instructors)\/login\/?$/.test(pathname)) {
    const attempt = loginByLabel.get(label);
    results.push({ label, method, path: originalPath, status: attempt?.status ?? 0, durationMs: attempt?.durationMs, classification: attempt?.tokenReceived ? "passed" : "credentials_failed", message: attempt?.message });
    continue;
  }

  const role = roleFor(entry, pathname);
  const token = role === "public" ? undefined : sessions[role];
  if (role !== "public" && !token) {
    results.push({ label, method, path: originalPath, resolvedPath: pathname, role, classification: "credentials_blocked", reason: `missing_${role}_session` });
    continue;
  }

  const headers = new Headers();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  let body;
  if (method !== "DELETE") {
    if (entry.request.body?.mode === "formdata") body = new FormData();
    else {
      headers.set("Content-Type", "application/json");
      body = JSON.stringify({});
    }
  }

  try {
    const response = await fetchJson(`${baseUrl}${pathname}`, { method, headers, body });
    results.push({
      label,
      method,
      path: originalPath,
      resolvedPath: pathname,
      role,
      status: response.status,
      durationMs: response.durationMs,
      classification: classify(response.status, method, pathname),
      message: response.status >= 400 ? messageOf(response.payload) : undefined,
    });
  } catch (error) {
    results.push({ label, method, path: originalPath, resolvedPath: pathname, role, status: 0, classification: "network_error", message: error instanceof Error ? error.message : String(error) });
  }
}

const counts = results.reduce((summary, result) => {
  summary[result.classification] = (summary[result.classification] ?? 0) + 1;
  return summary;
}, {});

const report = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  collectionName: collection.info?.name,
  environmentName: environment?.name,
  collectionEndpointCount: requests.length,
  mutationEndpointCount: mutationRequests.length,
  scope: "Non-destructive live mutation pass. Valid collection logins are exercised; other write routes receive empty payloads or impossible resource IDs. Real account state, external uploads, and malformed collection paths are not mutated.",
  sessionsAvailable: Object.keys(sessions),
  loginAttempts,
  counts,
  results,
};

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

console.log(`Collection endpoints: ${requests.length}`);
console.log(`Mutation endpoints probed: ${mutationRequests.length}`);
console.log(`Sessions available: ${Object.keys(sessions).join(", ") || "none"}`);
console.log(`Result counts: ${JSON.stringify(counts)}`);
console.log(`Report: ${outputPath}`);
