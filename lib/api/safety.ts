const PRIVATE_RESPONSE_KEYS = new Set([
  "password",
  "passwordConfirm",
  "passwordChangedAt",
  "passwordResetCode",
  "passwordResetExpires",
  "passwordResetVerified",
  "resetPasswordToken",
]);

export function sanitizeApiPayload(value: unknown, apiBaseUrl?: string): unknown {
  if (Array.isArray(value)) return value.map((item) => sanitizeApiPayload(item, apiBaseUrl));
  if (!value || typeof value !== "object") {
    if (apiBaseUrl && typeof value === "string" && /^http:\/\/localhost:8000(?=\/|$)/i.test(value)) {
      return value.replace(/^http:\/\/localhost:8000/i, apiBaseUrl.replace(/\/+$/, ""));
    }
    return value;
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
    if (!PRIVATE_RESPONSE_KEYS.has(key)) sanitized[key] = sanitizeApiPayload(item, apiBaseUrl);
  }
  return sanitized;
}

export function normalizeApiErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") return fallback;
  const record = payload as Record<string, unknown>;
  if (typeof record.message === "string" && record.message.trim()) return record.message.trim();
  if (typeof record.error === "string" && record.error.trim()) return record.error.trim();
  return fallback;
}
