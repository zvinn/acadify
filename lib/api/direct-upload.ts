export async function uploadToPresignedUrl(
  url: string,
  file: File,
  contentType = file.type || "application/octet-stream",
) {
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: file,
  });

  if (!response.ok) {
    throw new Error(`Upload failed with status ${response.status}.`);
  }
}
