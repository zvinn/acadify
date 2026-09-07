"use client";

import { Link, usePathname } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard, DollarSign, Wallet, GraduationCap, Users2, ShoppingCart,
  BellRing, WalletCards, type LucideIcon,
} from "lucide-react";

type AdminNavItem = {
  href: string;
  key?: string;
  label?: string;
  icon: LucideIcon;
  color: string;
};

const ADMIN_NAV: AdminNavItem[] = [
  { href: "/admin/dashboard", key: "overview", icon: LayoutDashboard, color: "#5CC0D6" },
  { href: "/admin/orders",    key: "orders",   icon: ShoppingCart,    color: "#EC4899" },
  { href: "/admin/pricing",   key: "pricing",  icon: DollarSign,     color: "#22C55E" },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: WalletCards, color: "#10B981" },
  { href: "/admin/wallet",    key: "wallet",   icon: Wallet,          color: "#F59E0B" },
  { href: "/admin/students",  key: "students", icon: GraduationCap,  color: "#8B5CF6" },
  { href: "/admin/instructors", key: "instructors", icon: Users2,    color: "#F97316" },
  { href: "/admin/notifications", key: "notifications", label: "Notifications", icon: BellRing, color: "#06B6D4" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const t = useTranslations("admin.nav");

  // Build locale-prefixed check
  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside
      className="hidden lg:flex flex-col shrink-0 border-e"
      style={{
        width: 256,
        background: "#162535",
        borderColor: "rgba(255,255,255,0.06)",
      }}
    >
      {/* Brand label */}
      <div className="px-6 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black text-white"
            style={{ background: "#5CC0D6" }}
          >
            A
          </div>
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
            Admin Panel
          </span>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {ADMIN_NAV.map(({ href, key, label, icon: Icon, color }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
              style={
                active
                  ? { background: "rgba(255,255,255,0.10)", color: "#fff" }
                  : { color: "rgba(255,255,255,0.50)" }
              }
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all"
                style={{
                  background: active ? `${color}22` : "rgba(255,255,255,0.05)",
                  color: active ? color : "rgba(255,255,255,0.35)",
                }}
              >
                <Icon size={16} />
              </div>
              <span className={active ? "text-white font-semibold" : ""}>
                {label ?? (key ? t(key) : "")}
              </span>
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

      {/* Footer */}
      <div className="px-6 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <p className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.20)" }}>
          Acadify Admin v1.0
        </p>
      </div>
    </aside>
  );
}
