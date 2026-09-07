"use client";

import { useTranslations } from "next-intl";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("routeState");

  return (
    <main className="grid min-h-[70vh] place-items-center px-6 py-20 text-center">
      <div className="max-w-lg">
        <p className="text-sm font-bold uppercase tracking-widest text-brand-primary">{t("errorEyebrow")}</p>
        <h1 className="mt-3 text-3xl font-black text-brand-secondary sm:text-4xl">{t("errorTitle")}</h1>
        <p className="mt-4 leading-7 text-text-muted">{t("errorDescription")}</p>
        <button type="button" onClick={reset} className="mt-7 min-h-11 rounded-xl bg-brand-primary px-6 py-3 font-bold text-white transition hover:bg-brand-primary/90">
          {t("tryAgain")}
        </button>
      </div>
    </main>
  );
}
