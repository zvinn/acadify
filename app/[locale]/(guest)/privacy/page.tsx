"use client";

import { Shield } from "lucide-react";

import { Link } from "@/src/i18n/navigation";

const sections = [
  {
    heading: "What data do we collect?",
    body: "We collect data you provide directly, such as your name, email, and registration details, as well as automatic usage data such as pages visited and session duration.",
  },
  {
    heading: "How do we use your data?",
    body: "We use your data to operate the service, improve your experience, and send updates and notifications related to your orders, lectures, and wallet.",
  },
  {
    heading: "Do we share your data?",
    body: "We do not sell or rent your data to any third party. We may share it with necessary service providers, such as payment processors, under strict confidentiality agreements.",
  },
  {
    heading: "Data Protection",
    body: "We use SSL encryption and modern security protocols to protect your data. We also enforce strict access policies among our staff.",
  },
  {
    heading: "Your Rights",
    body: "You have the right to access, modify, or request deletion of your data at any time. Contact us at support@acadify.app.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F6F7F8]">
      <div className="relative overflow-hidden bg-[#162535] px-6 py-16">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
        <div className="container relative z-10 mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-300/15 text-sky-300">
            <Shield size={26} aria-hidden="true" />
          </div>
          <h1 className="mb-3 text-3xl font-black text-white md:text-4xl">Privacy Policy</h1>
          <p className="text-sm text-white/60">How we collect, use, and protect your data</p>
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
        <p className="mt-8 text-center text-xs text-slate-400">Last updated: July 2025 | JAR Academy</p>
      </div>
    </div>
  );
}