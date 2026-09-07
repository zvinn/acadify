import { getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("routeState");
  return (
    <main className="grid min-h-[70vh] place-items-center px-6 py-20 text-center">
      <div className="max-w-lg">
        <p className="text-7xl font-black text-brand-primary/25">404</p>
        <h1 className="mt-3 text-3xl font-black text-brand-secondary sm:text-4xl">{t("notFoundTitle")}</h1>
        <p className="mt-4 leading-7 text-text-muted">{t("notFoundDescription")}</p>
        <Link href="/" className="mt-7 inline-flex min-h-11 items-center rounded-xl bg-brand-primary px-6 py-3 font-bold text-white transition hover:bg-brand-primary/90">
          {t("backHome")}
        </Link>
      </div>
    </main>
  );
}
