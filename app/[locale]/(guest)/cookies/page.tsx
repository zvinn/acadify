"use client";

import { Cookie } from "lucide-react";

import { Link } from "@/src/i18n/navigation";

const sections = [
  {
    heading: "What are Cookies?",
    body: "Cookies are small text files stored on your device when you visit our site. They help us remember your preferences and improve your experience.",
  },
  {
    heading: "Essential Cookies",
    body: "These cookies are necessary for the website to function properly. They include session and login cookies and cannot be disabled.",
  },
  {
    heading: "Performance & Analytics Cookies",
    body: "We use these cookies to understand how you use the site and to improve performance. Data is aggregated and is not used to identify you personally.",
  },
  {
    heading: "Preference Cookies",
    body: "These cookies store interface preferences so you do not need to configure them again on every visit.",
  },
  {
    heading: "Controlling Cookies",
    body: "You can control cookies through your browser settings. However, disabling some cookies may affect the functionality of certain site features.",
  },
];

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#F6F7F8]">
      <div className="relative overflow-hidden bg-[#162535] px-6 py-16">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
        <div className="container relative z-10 mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500">
            <Cookie size={26} aria-hidden="true" />
          </div>
          <h1 className="mb-3 text-3xl font-black text-white md:text-4xl">Cookies Policy</h1>
          <p className="text-sm text-white/60">How we use cookies to improve your experience</p>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-6 py-12">
        <Link href="/" className="mb-8 inline-flex min-h-11 items-center gap-1 rounded-lg px-2 text-sm text-[#162535]/60 transition hover:bg-white hover:text-[#162535]">
          ΓåÉ Back to Home
        </Link>
        <div className="flex flex-col gap-8 rounded-3xl border border-[#162535]/5 bg-white p-8 shadow-sm">
          {sections.map((section, index) => (
            <section key={section.heading} className="border-b border-[#162535]/5 pb-6 last:border-b-0 last:pb-0">
              <h2 className="mb-3 text-base font-black text-[#162535]">{index + 1}. {section.heading}</h2>
              <p className="text-sm leading-relaxed text-[#667085]">{section.body}</p>
            </section>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-slate-400">Last updated: July 2025 | Acadify</p>
      </div>
    </div>
  );
}