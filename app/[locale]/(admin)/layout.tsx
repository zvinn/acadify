import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import AdminSidebar from "../../components/AdminSidebar";
import Navbar from "../../components/Navbar";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div dir="ltr" className="min-h-screen" style={{ background: "#F8F9FA" }}>
      <Navbar role="admin" />
      <div className="flex pt-[81px] min-h-screen">
        {/* Sidebar */}
        <AdminSidebar />
        {/* Main Content */}
        <main className="flex-1 min-w-0 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
