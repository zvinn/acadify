import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  const locale = requestedLocale === "en" ? requestedLocale : routing.defaultLocale;

  return {
    locale,
    messages: (await import("../../messages/en.json")).default,
  };
});
