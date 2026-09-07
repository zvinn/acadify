"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { Link } from "@/src/i18n/navigation";

export default function Footer() {
  const t = useTranslations("footer");
  const links = [
    { href: "/privacy", label: t("privacy") },
    { href: "/terms", label: t("terms") },
    { href: "/cookies", label: t("cookies") },
    { href: "/help", label: t("help") },
  ];

  return (
    <footer className="mt-auto border-t border-zinc-100 bg-white py-10">
      <div className="container mx-auto flex flex-col items-center justify-between gap-8 px-6 md:flex-row">
        <Link href="/" className="shrink-0" aria-label="Acadify">
          <Image src="/acadify_logo.png" alt="Acadify" width={180} height={76} className="h-auto w-[160px] object-contain" />
        </Link>
        <nav aria-label={t("navigationLabel")} className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-text-muted transition-colors hover:text-brand-primary">
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-center text-sm font-medium text-text-muted">{t("copyright")}</p>
      </div>
    </footer>
  );
}
