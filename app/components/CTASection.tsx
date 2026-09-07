"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";

export default function CTASection() {
  const t = useTranslations("home.cta");
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="relative overflow-hidden rounded-[48px] bg-[#0E1726] p-12 text-center shadow-2xl md:p-24">
          <div className="absolute end-0 top-0 h-[400px] w-[400px] -translate-y-1/2 translate-x-1/2 rounded-full bg-brand-primary/20 blur-[120px]" aria-hidden="true" />
          <div className="brand-pattern absolute inset-0 text-white opacity-[0.03]" aria-hidden="true" />
          <div className="relative z-10 mx-auto max-w-4xl">
            <h2 className="mb-8 text-4xl font-black leading-tight text-white md:text-5xl lg:text-6xl">{t("title")}</h2>
            <p className="mx-auto mb-12 max-w-2xl text-lg font-medium leading-relaxed text-zinc-300 md:text-xl">{t("description")}</p>
            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
              <Link href="/get-started" className="w-full rounded-btn bg-brand-primary px-12 py-5 text-xl font-bold text-white shadow-xl transition hover:bg-brand-primary/90 sm:w-auto">{t("button")}</Link>
              <Link href="/contact" className="w-full rounded-btn border border-white/20 bg-white/5 px-12 py-5 text-xl font-bold text-white transition hover:bg-white/10 sm:w-auto">{t("advisor")}</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
