"use client";

import { ChevronDown, HelpCircle, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Link } from "@/src/i18n/navigation";

const faq = [
  { q: "How do I create an account?", a: "Open Get Started, choose Student or Instructor, then complete the registration form. Some country and major lookups may be unavailable until the backend allows public registration lookups." },
  { q: "Which files can I upload?", a: "Use the formats and size limit shown next to the relevant upload control. The available limits depend on the request type and current backend contract." },
  { q: "When will an instructor respond?", a: "Timing depends on available instructors and the offers submitted for your request. The platform does not guarantee an undocumented response time." },
  { q: "Can I recharge my wallet?", a: "Not through the website at this time. The current backend has no wallet recharge or deposit endpoint, so the interface will not simulate a payment." },
  { q: "Can I send chat messages?", a: "Chat history remains read-only until the backend provides a documented send-message endpoint." },
  { q: "How can I contact support?", a: "Use the support email shown on the Contact page and include your account email and order number when relevant." },
];

export default function HelpPage() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const items = useMemo(
    () => faq.filter((item) => `${item.q} ${item.a}`.toLowerCase().includes(query.trim().toLowerCase())),
    [query],
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-brand-secondary px-6 py-16 text-center text-white">
        <HelpCircle className="mx-auto text-sky-300" size={40} aria-hidden="true" />
        <h1 className="mt-5 text-4xl font-black">Help Center</h1>
        <p className="mt-3 text-slate-300">Clear answers based on the features currently available.</p>
        <label className="relative mx-auto mt-7 block max-w-xl">
          <span className="sr-only">Search questions</span>
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden="true" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search questions" className="w-full rounded-2xl border border-white/15 bg-white py-3.5 pe-4 ps-11 text-brand-secondary outline-none focus:ring-2 focus:ring-sky-300" />
        </label>
      </section>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <Link href="/" className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-bold text-brand-primary hover:bg-brand-primary/5">Back to home</Link>
        <div className="mt-6 space-y-3">
          {items.map((item) => {
            const expanded = open === item.q;
            return (
              <article key={item.q} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <h2>
                  <button type="button" onClick={() => setOpen(expanded ? null : item.q)} aria-expanded={expanded} className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-start font-bold text-brand-secondary">
                    {item.q}
                    <ChevronDown className={`shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`} size={18} aria-hidden="true" />
                  </button>
                </h2>
                {expanded && <p className="border-t border-slate-100 px-5 py-4 text-sm leading-7 text-text-muted">{item.a}</p>}
              </article>
            );
          })}
          {items.length === 0 && <p className="rounded-2xl bg-white p-8 text-center text-text-muted">No matching questions. Contact support for help.</p>}
        </div>
        <div className="mt-10 rounded-3xl bg-brand-secondary p-8 text-center text-white">
          <h2 className="text-2xl font-black">Still need help?</h2>
          <Link href="/contact" className="mt-5 inline-flex min-h-12 items-center rounded-xl bg-brand-primary px-7 py-3 font-bold text-white">Contact support</Link>
        </div>
      </main>
    </div>
  );
}
