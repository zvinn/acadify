export function dataOf(payload: unknown): unknown {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return payload;
  }
  return (payload as Record<string, unknown>).data ?? payload;
}

export function arrayOf<T>(payload: unknown, keys: string[] = []): T[] {
  const data = dataOf(payload);
  if (Array.isArray(data)) return data as T[];
  if (!data || typeof data !== "object") return [];

  const record = data as Record<string, unknown>;
  for (const key of [...keys, "docs", "items", "results"]) {
    if (Array.isArray(record[key])) return record[key] as T[];
  }
  return [];
}

export function objectOf<T>(payload: unknown, keys: string[] = []): T {
  const data = dataOf(payload);
  if (!data || typeof data !== "object" || Array.isArray(data)) return {} as T;

  const record = data as Record<string, unknown>;
  for (const key of keys) {
    const value = record[key];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return value as T;
    }
  }
  return data as T;
}

export function idOf(value: unknown): string {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";
  const record = value as Record<string, unknown>;
  const id = record._id ?? record.id;
  return typeof id === "string" ? id : "";
}

export function recordOf(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function textOf(value: unknown, fallback = ""): string {
  if (typeof value === "string" && value.trim()) return value;
  if (typeof value === "number") return String(value);
  return fallback;
}
