"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import {
  Bell,
  BookOpen,
  ClipboardList,
  DollarSign,
  FlaskConical,
  GraduationCap,
  LayoutDashboard,
  Menu,
  ShoppingCart,
  UploadCloud,
  User,
  Users2,
  Wallet,
  WalletCards,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/src/i18n/navigation";

export type Role = "guest" | "student" | "instructor" | "admin";

type NavLink = { label: string; href: string; icon?: ReactNode };
type NavConfig = Record<Role, {
  links: NavLink[];
  notificationsHref?: string;
  profileHref?: string;
  homeHref: string;
}>;

function LoggedInActions({
  notificationsHref,
  profileHref,
  notificationsLabel,
  profileLabel,
}: {
  notificationsHref: string;
  profileHref: string;
  notificationsLabel: string;
  profileLabel: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Link
        href={notificationsHref}
        aria-label={notificationsLabel}
        className="rounded-full bg-brand-secondary p-2.5 text-white shadow-sm transition-colors hover:bg-brand-secondary/90"
      >
        <Bell size={20} aria-hidden="true" />
      </Link>
      <Link
        href={profileHref}
        className="flex items-center gap-2 rounded-full bg-brand-secondary px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-brand-secondary/90"
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100">
          <User size={16} className="text-orange-500" aria-hidden="true" />
        </span>
        <span className="text-sm">{profileLabel}</span>
      </Link>
    </div>
  );
}

export default function Navbar({ role = "guest" }: { role?: Role }) {
  const t = useTranslations("navbar");
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const navConfig: NavConfig = {
    guest: {
      homeHref: "/",
      links: [
        { label: t("guest_students"), href: "/students" },
        { label: t("guest_instructors"), href: "/instructors" },
        { label: t("guest_howItWorks"), href: "/how-it-works" },
        { label: t("guest_contact"), href: "/contact" },
      ],
    },
    student: {
      homeHref: "/dashboard",
      notificationsHref: "/notifications",
      profileHref: "/profile",
      links: [
        { label: t("student_upload"), href: "/upload", icon: <UploadCloud size={17} /> },
        { label: t("student_courses"), href: "/courses", icon: <BookOpen size={17} /> },
        { label: t("student_assignments"), href: "/assignments", icon: <ClipboardList size={17} /> },
        { label: t("student_orders"), href: "/orders", icon: <ShoppingCart size={17} /> },
        { label: t("student_wallet"), href: "/wallet", icon: <Wallet size={17} /> },
        { label: t("student_subscriptions"), href: "/subscriptions", icon: <WalletCards size={17} /> },
        { label: t("student_trials"), href: "/trials", icon: <FlaskConical size={17} /> },
        { label: t("student_contact"), href: "/contact" },
      ],
    },
    instructor: {
      homeHref: "/instructor/tasks",
      notificationsHref: "/instructor/notifications",
      profileHref: "/instructor/profile",
      links: [
        { label: t("instructor_tasks"), href: "/instructor/tasks" },
        { label: t("instructor_projects"), href: "/instructor/projects" },
        { label: t("instructor_offers"), href: "/instructor/offers" },
        { label: t("instructor_contact"), href: "/contact" },
      ],
    },
    admin: {
      homeHref: "/admin/dashboard",
      notificationsHref: "/admin/notifications",
      profileHref: "/admin/dashboard",
      links: [
        { label: t("admin_overview"), href: "/admin/dashboard", icon: <LayoutDashboard size={17} /> },
        { label: t("admin_orders"), href: "/admin/orders", icon: <ShoppingCart size={17} /> },
        { label: t("admin_pricing"), href: "/admin/pricing", icon: <DollarSign size={17} /> },
        { label: t("admin_subscriptions"), href: "/admin/subscriptions", icon: <WalletCards size={17} /> },
        { label: t("admin_wallet"), href: "/admin/wallet", icon: <Wallet size={17} /> },
        { label: t("admin_students"), href: "/admin/students", icon: <GraduationCap size={17} /> },
        { label: t("admin_instructors"), href: "/admin/instructors", icon: <Users2 size={17} /> },
      ],
    },
  };

  const current = navConfig[role];
  const isAuthenticated = role !== "guest";
  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav
        aria-label={t("common_primaryNavigation")}
        className={`fixed inset-x-0 top-0 z-50 h-[81px] border-b transition-all ${
          isScrolled || menuOpen ? "border-gray-100 bg-white/95 shadow-sm backdrop-blur-md" : "border-gray-50 bg-white"
        }`}
        dir="ltr"
      >
        <div className="container mx-auto flex h-full items-center justify-between gap-4 px-4 sm:px-6">
          <Link href={current.homeHref} className="flex shrink-0 items-center" aria-label={t("common_home")}>
            <Image src="/acadify_logo.png" alt="Acadify" width={110} height={42} className="h-10 w-auto object-contain" priority />
          </Link>

          <div className="hidden flex-1 items-center justify-center gap-6 lg:flex xl:gap-8">
            {current.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`flex items-center gap-1.5 whitespace-nowrap text-sm font-medium transition-colors ${
                  isActive(link.href) ? "text-brand-primary" : "text-text-main hover:text-brand-primary"
                }`}
              >
                {link.icon && <span className="shrink-0 opacity-80" aria-hidden="true">{link.icon}</span>}
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden shrink-0 items-center gap-3 lg:flex">
            {isAuthenticated && current.notificationsHref && current.profileHref ? (
              <LoggedInActions
                notificationsHref={current.notificationsHref}
                profileHref={current.profileHref}
                notificationsLabel={t("common_notifications")}
                profileLabel={t("common_myProfile")}
              />
            ) : (
              <Link href="/get-started" className="rounded-btn bg-brand-primary px-6 py-2.5 font-bold text-white shadow-md transition hover:bg-brand-primary/90">
                {t("guest_getStarted")}
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            {isAuthenticated && current.notificationsHref && current.profileHref && (
              <>
                <Link href={current.notificationsHref} aria-label={t("common_notifications")} className="rounded-full bg-brand-secondary p-2 text-white">
                  <Bell size={18} aria-hidden="true" />
                </Link>
                <Link href={current.profileHref} aria-label={t("common_myProfile")} className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                  <User size={18} aria-hidden="true" />
                </Link>
              </>
            )}
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="rounded-xl p-2 hover:bg-gray-100"
              aria-label={menuOpen ? t("common_closeMenu") : t("common_openMenu")}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <button type="button" aria-label={t("common_closeMenu")} className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" onClick={closeMenu} />
      )}
      <div
        id="mobile-navigation"
        className={`fixed inset-x-0 top-[81px] z-40 border-b border-gray-100 bg-white shadow-xl transition lg:hidden ${
          menuOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-3 opacity-0"
        }`}
        dir="ltr"
      >
        <div className="container mx-auto flex flex-col gap-1 px-4 py-4">
          {current.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium ${
                isActive(link.href) ? "bg-blue-50 text-brand-primary" : "text-text-main hover:bg-gray-50"
              }`}
            >
              {link.icon && <span aria-hidden="true">{link.icon}</span>}
              {link.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <Link href="/get-started" onClick={closeMenu} className="mt-3 flex justify-center rounded-btn bg-brand-primary px-6 py-3 font-bold text-white">
              {t("guest_getStarted")}
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
