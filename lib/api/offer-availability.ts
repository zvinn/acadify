type ApiLikeError = {
  message?: unknown;
  status?: unknown;
};

export function isNoOffersAvailableError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const { message, status } = error as ApiLikeError;
  if (status !== 400 && status !== 404) return false;
  if (typeof message !== "string") return false;

  const normalizedMessage = message.trim().toLowerCase();
  return /(?:can'?t|cannot|could\s+not)\s+find\s+(?:an?\s+)?offers?\b|\bno\s+offers?\b/.test(
    normalizedMessage,
  );
}
