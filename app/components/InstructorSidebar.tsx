"use client";

import { Link, usePathname } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  ClipboardList, Briefcase, FileSignature, Wallet, User, Bell
} from "lucide-react";

const INSTRUCTOR_NAV = [
  { href: "/instructor/tasks", key: "availableTasks", icon: ClipboardList, color: "#F97316" },
  { href: "/instructor/projects", key: "myProjects", icon: Briefcase, color: "#8B5CF6" },
  { href: "/instructor/offers", key: "offers", icon: FileSignature, color: "#EC4899" },
  { href: "/instructor/profile/withdraw", key: "wallet", icon: Wallet, color: "#14B8A6" },
  { href: "/instructor/notifications", key: "notifications", icon: Bell, color: "#F59E0B" },
  { href: "/instructor/profile", key: "myProfile", icon: User, color: "#6366F1" },
];

export default function InstructorSidebar() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside
      className="hidden lg:flex flex-col shrink-0 border-e border-zinc-200 bg-white shadow-sm"
      style={{ width: 256 }}
    >
      <div className="px-6 py-5 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black text-white"
            style={{ background: "#5CC0D6" }}
          >
            I
          </div>
          <span className="text-xs font-bold tracking-widest uppercase text-zinc-500">
            Instructor Portal
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {INSTRUCTOR_NAV.map(({ href, key, icon: Icon, color }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                active ? "bg-brand-primary/5 text-brand-primary" : "text-zinc-500 hover:bg-zinc-50"
              }`}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all"
                style={{
                  background: active ? `${color}15` : "#F4F4F5",
                  color: active ? color : "#71717A",
                }}
              >
                <Icon size={16} />
              </div>
              <span className={active ? "font-bold" : ""}>{t(key)}</span>
              {active && (
                <div
                  className="ms-auto w-1.5 h-1.5 rounded-full"
                  style={{ background: color }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
