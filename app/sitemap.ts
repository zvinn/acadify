import type { MetadataRoute } from "next";

const publicRoutes = ["", "/students", "/instructors", "/how-it-works", "/contact", "/get-started", "/help", "/privacy", "/terms", "/cookies"];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.SITE_URL ?? "https://acadify.app";
  const now = new Date();
  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route || "/"}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" as const : "monthly" as const,
    priority: route === "" ? 1 : 0.7,
  }));
}