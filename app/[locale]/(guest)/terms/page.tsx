"use client";

import { FileText } from "lucide-react";

import { Link } from "@/src/i18n/navigation";

const sections = [
  {
    heading: "Acceptance of Terms",
    body: "By using Acadify, you agree to be bound by these terms and conditions. If you disagree with any part of them, please do not use the platform.",
  },
  {
    heading: "Account & Responsibility",
    body: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use.",
  },
  {
    heading: "Intellectual Property",
    body: "All content on the platform, including videos, explanations, and study materials, is protected by intellectual property rights. It may not be copied or distributed without prior permission.",
  },
  {
    heading: "Payment & Wallet",
    body: "Payments are processed through secure payment gateways. Wallet balance is non-refundable in cash except in exceptional cases under our policy. Any payment dispute must be reported within 7 days.",
  },
  {
    heading: "Acceptable Conduct",
    body: "Using the platform for illegal purposes, posting offensive or misleading content, attempting to breach platform systems, or violating other users' privacy is strictly prohibited.",
  },
  {
    heading: "Account Termination",
    body: "We reserve the right to suspend or terminate your account for violations of these terms. You will be notified before any action except in cases of serious violations.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F6F7F8]">
      <div className="relative overflow-hidden bg-[#162535] px-6 py-16">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
        <div className="container relative z-10 mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-500">
            <FileText size={26} aria-hidden="true" />
          </div>
          <h1 className="mb-3 text-3xl font-black text-white md:text-4xl">Terms & Conditions</h1>
          <p className="text-sm text-white/60">Please read these terms carefully before using the platform</p>
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