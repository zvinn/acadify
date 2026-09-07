import type { Metadata } from "next";
import { GraduationCap, UserSquare2 } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import { Link } from "@/src/i18n/navigation";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "getStarted" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function GetStartedPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("getStarted");
  const roles = [
    {
      key: "student",
      icon: GraduationCap,
      login: "/auth/student/login",
      register: "/auth/student/register",
    },
    {
      key: "instructor",
      icon: UserSquare2,
      login: "/auth/instructor/login",
      register: "/auth/instructor/register",
    },
  ] as const;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar role="guest" />
      <main className="mx-auto w-full max-w-4xl flex-1 px-5 pb-20 pt-32 sm:px-6">
        <h1 className="text-center text-4xl font-black tracking-tight text-brand-secondary sm:text-5xl">{t("title")}</h1>
        <p className="mx-auto mb-12 mt-4 max-w-xl text-center text-lg text-text-muted">{t("subtitle")}</p>

        <div className="grid gap-7 md:grid-cols-2">
          {roles.map(({ key, icon: Icon, login, register }) => (
            <article key={key} className="flex flex-col items-center rounded-3xl border border-slate-100 bg-white p-7 text-center shadow-sm sm:p-10">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-sky-50 text-brand-primary">
                <Icon size={36} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-black text-brand-secondary">{t(`${key}Title`)}</h2>
              <p className="mb-8 mt-4 max-w-sm flex-1 text-sm leading-7 text-text-muted">{t(`${key}Description`)}</p>
              <div className="grid w-full gap-3">
                <Link href={login} className="flex min-h-12 items-center justify-center rounded-xl bg-brand-primary px-5 py-3 font-bold text-white transition hover:bg-brand-primary/90">
                  {t(`${key}Login`)}
                </Link>
                <Link href={register} className="flex min-h-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 font-bold text-brand-secondary transition hover:bg-slate-100">
                  {t(`${key}Register`)}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
