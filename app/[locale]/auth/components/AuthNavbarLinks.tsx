"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/src/i18n/navigation";

export function AuthNavbarLinks() {
  const pathname = usePathname();
  const t = useTranslations("authLayout");
  const links = [
    { href: "/auth/student/register", label: t("studentRegister") },
    { href: "/auth/student/login", label: t("studentLogin") },
    { href: "/auth/instructor/register", label: t("instructorRegister") },
    { href: "/auth/instructor/login", label: t("instructorLogin") },
  ];

  return (
    <div className="hidden flex-1 items-center justify-center gap-6 text-sm font-medium text-gray-500 md:flex lg:gap-8">
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`relative py-2 transition-colors ${active ? "font-semibold text-brand-primary" : "hover:text-gray-900"}`}
          >
            {link.label}
            {active && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-t-sm bg-brand-primary" aria-hidden="true" />}
          </Link>
        );
      })}
    </div>
  );
}
