import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.SITE_URL ?? "https://acadify.app";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/auth/", "/admin/", "/instructor/", "/dashboard", "/upload/", "/orders/", "/courses/", "/assignments/", "/profile/", "/wallet/", "/subscriptions/", "/trials/", "/chat/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}