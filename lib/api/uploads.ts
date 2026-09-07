import "server-only";

import { ApiError, apiRequest } from "@/lib/api/client";

function muxAuthorization() {
  const id = process.env.MUX_TOKEN_ID;
  const secret = process.env.MUX_TOKEN_SECRET;
  if (!id || !secret) {
    throw new ApiError(
      "Mux upload credentials are not configured on the server.",
      500,
      null,
    );
  }
  return `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`;
}

export function createVideoUpload(body: Record<string, unknown> = {}) {
  return apiRequest<unknown>("/video/v1/uploads", {
    method: "POST",
    auth: false,
    headers: { Authorization: muxAuthorization() },
    body,
  });
}
