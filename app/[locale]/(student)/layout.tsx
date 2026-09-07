import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import StudentSidebar from "../../components/StudentSidebar";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function StudentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div dir="ltr" className="min-h-screen" style={{ background: "#F6F7F8" }}>
      <Navbar role="student" />
      <div className="flex pt-[81px] min-h-screen">
        <StudentSidebar />
        <main className="flex-1 min-w-0 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
