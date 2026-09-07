import type { Metadata } from "next";
import { Cairo, Montserrat } from "next/font/google";

import "./globals.css";

const cairo = Cairo({
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  weight: ["400", "500", "700", "900"],
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Acadify",
  description: "Study Smarter. Understand Faster.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${cairo.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-screen font-sans">
        <a
          href="#main-content"
          className="fixed start-4 top-2 z-[100] -translate-y-20 rounded-lg bg-brand-secondary px-4 py-2 font-bold text-white focus:translate-y-0"
        >
          Skip to main content
        </a>
        <div id="main-content" className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
