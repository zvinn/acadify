import type { Metadata } from "next";
import { LifeBuoy, Mail } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import { Link } from "@/src/i18n/navigation";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <div className="flex min-h-screen flex-col bg-[#F6F7F8]">
      <Navbar role="guest" />
      <main className="flex-1 pt-[81px]">
        <section className="bg-brand-secondary px-6 py-16 text-center text-white sm:py-20">
          <div className="mx-auto max-w-3xl">
            <LifeBuoy className="mx-auto mb-5 text-brand-primary" size={40} aria-hidden="true" />
            <h1 className="text-4xl font-black sm:text-5xl">{t("title")}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/75 sm:text-lg">{t("subtitle")}</p>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-4xl gap-6 px-6 py-12 md:grid-cols-2 md:py-16">
          <article className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
              <Mail size={24} aria-hidden="true" />
            </div>
            <h2 className="text-xl font-black text-brand-secondary">{t("emailUs")}</h2>
            <p className="mt-2 text-sm leading-7 text-text-muted">{t("emailSupportDescription")}</p>
            <a
              href="mailto:support@acadify.app"
              className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-brand-secondary px-5 py-3 font-bold text-white transition hover:bg-brand-secondary/90"
              dir="ltr"
            >
              support@acadify.app
            </a>
          </article>

          <article className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
              <LifeBuoy size={24} aria-hidden="true" />
            </div>
            <h2 className="text-xl font-black text-brand-secondary">{t("helpCenterTitle")}</h2>
            <p className="mt-2 text-sm leading-7 text-text-muted">{t("helpCenterDescription")}</p>
            <Link href="/help" className="mt-5 inline-flex min-h-11 items-center rounded-xl border border-brand-primary px-5 py-3 font-bold text-brand-primary transition hover:bg-brand-primary/5">
              {t("openHelpCenter")}
            </Link>
          </article>

          <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900 md:col-span-2" role="note">
            {t("formUnavailable")}
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}