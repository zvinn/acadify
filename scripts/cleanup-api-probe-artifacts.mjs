import { readFile } from "node:fs/promises";
import process from "node:process";

const DEFAULT_BASE_URL = "https://smart-explanation-plaform-production-1bd6.up.railway.app";

function option(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

const collectionPath = option("--collection", process.env.POSTMAN_COLLECTION);
const reportPath = option("--report", "qa-reports/api-mutation-probes.json");
const baseUrl = option("--base-url", process.env.API_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
const apply = process.argv.includes("--apply");

if (!collectionPath) throw new Error("Pass --collection <path> or set POSTMAN_COLLECTION.");

const [collection, report] = await Promise.all([
  readFile(collectionPath, "utf8").then(JSON.parse),
  readFile(reportPath, "utf8").then(JSON.parse),
]);

function flatten(items, result = []) {
  for (const item of items ?? []) {
    if (item.request) result.push(item);
    else if (item.item) flatten(item.item, result);
  }
  return result;
}

function rawUrl(request) {
  if (typeof request.url === "string") return request.url;
  return request.url?.raw ?? `/${(request.url?.path ?? []).join("/")}`;
}

function parseCredentials(raw) {
  if (!raw) return undefined;
  try {
    const value = JSON.parse(raw);
    return value.email && value.password ? { email: value.email, password: value.password } : undefined;
  } catch {
    const email = raw.match(/"email"\s*:\s*"([^"]+)"/i)?.[1];
    const password = raw.match(/"password"\s*:\s*"([^"]+)"/i)?.[1];
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

const adminLogin = flatten(collection.item).find((item) =>
  /admin/i.test(item.name) &&
  item.request.method === "POST" &&
  /\/api\/v1\/auth\/instructors\/login\/?$/.test(rawUrl(item.request)),
);
const credentials = parseCredentials(adminLogin?.request.body?.raw);
if (!credentials) throw new Error("Admin credentials were not found in the collection.");

const loginResponse = await fetch(`${baseUrl}/api/v1/auth/instructors/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(credentials),
});
const loginPayload = await loginResponse.json();
const token = findString(loginPayload, ["token", "accessToken", "access_token", "jwt"]);
if (!loginResponse.ok || !token) throw new Error("Admin login failed while checking probe artifacts.");

const chatsResponse = await fetch(`${baseUrl}/api/v1/chats`, {
  headers: { Authorization: `Bearer ${token}` },
});
const chatsPayload = await chatsResponse.json();
if (!chatsResponse.ok) throw new Error("Could not read chats while checking probe artifacts.");

function chatArray(value) {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return [];
  for (const key of ["chats", "docs", "items", "results", "data"]) {
    const found = chatArray(value[key]);
    if (found.length) return found;
  }
  return [];
}

const generatedAt = new Date(report.generatedAt).getTime();
const windowStart = generatedAt - 5 * 60_000;
const windowEnd = generatedAt + 60_000;
const candidates = chatArray(chatsPayload).filter((chat) => {
  const createdAt = new Date(chat.createdAt ?? "").getTime();
  const participants = chat.participants;
  const hasParticipants = Array.isArray(participants)
    ? participants.length > 0
    : Boolean(participants && typeof participants === "object" && Object.keys(participants).length > 0);
  return createdAt >= windowStart && createdAt <= windowEnd && !hasParticipants && !chat.referenceId;
});

const summaries = candidates.map((chat) => ({
  id: chat._id ?? chat.id,
  createdAt: chat.createdAt,
  hasReference: Boolean(chat.referenceId),
}));
console.log(`Probe artifact candidates: ${summaries.length}`);
if (summaries.length) console.log(JSON.stringify(summaries, null, 2));

if (apply) {
  let deleted = 0;
  for (const candidate of candidates) {
    const id = candidate._id ?? candidate.id;
    if (!id) continue;
    const response = await fetch(`${baseUrl}/api/v1/chats/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) deleted += 1;
  }
  console.log(`Deleted probe artifacts: ${deleted}`);
} else {
  console.log("Dry run only. Pass --apply to delete only the listed empty chats.");
}
