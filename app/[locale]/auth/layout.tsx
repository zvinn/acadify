import type { Metadata } from "next";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import Footer from "@/app/components/Footer";
import { Link } from "@/src/i18n/navigation";
import { AuthNavbarLinks } from "./components/AuthNavbarLinks";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("authLayout");

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <nav aria-label={t("navigationLabel")} className="flex min-h-20 w-full items-center justify-between border-b border-gray-100 px-4 sm:px-8">
        <Link href="/" aria-label={t("homeLabel")} className="shrink-0">
          <Image src="/acadify_logo.png" alt="Acadify" width={140} height={45} className="h-auto w-[120px] object-contain sm:w-[140px]" priority />
        </Link>
        <AuthNavbarLinks />
        <div className="hidden w-[120px] md:block" aria-hidden="true" />
      </nav>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-8">
        <div className="mb-6">
          <Link href="/" className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            {t("back")}
          </Link>
        </div>
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
      <Footer />
    </div>
  );
}