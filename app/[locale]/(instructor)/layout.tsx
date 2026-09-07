import Navbar from "../../components/Navbar";
import InstructorSidebar from "../../components/InstructorSidebar";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function InstructorLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-gray-50" dir="ltr">
      <Navbar role="instructor" />
      <div className="flex min-h-screen pt-[81px]">
        <InstructorSidebar />
        <main className="min-w-0 flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
