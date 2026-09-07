import type { LucideIcon } from "lucide-react";
import { BadgeDollarSign, CheckCircle2, Clock3, FileText, GraduationCap, MessageSquare, UploadCloud, Users, Video } from "lucide-react";

import { Link } from "@/src/i18n/navigation";
import Footer from "./Footer";
import Navbar from "./Navbar";

type MarketingInfoPageProps = {
  badge: string;
  title: string;
  description: string;
  sectionTitle: string;
  steps: Array<{ title: string; description: string }>;
  ctaTitle: string;
  ctaDescription: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  variant: "students" | "instructors" | "process";
};

const icons: Record<MarketingInfoPageProps["variant"], LucideIcon[]> = {
  students: [UploadCloud, Users, GraduationCap],
  instructors: [Clock3, BadgeDollarSign, MessageSquare],
  process: [FileText, Users, Video],
};

export default function MarketingInfoPage(props: MarketingInfoPageProps) {
  const stepIcons = icons[props.variant];
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar role="guest" />
      <main className="flex-1 pt-[81px]">
        <section className="relative overflow-hidden bg-slate-50 px-6 py-20 text-center sm:py-28">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-sky-100/40" aria-hidden="true" />
          <div className="relative mx-auto max-w-4xl">
            <p className="inline-flex rounded-full border border-brand-primary/20 bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-brand-primary">{props.badge}</p>
            <h1 className="mt-7 text-4xl font-black leading-tight text-brand-secondary sm:text-6xl">{props.title}</h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-text-muted sm:text-lg">{props.description}</p>
            <Link href={props.primaryHref} className="mt-8 inline-flex min-h-12 items-center rounded-xl bg-brand-primary px-7 py-3 font-bold text-white transition hover:bg-brand-primary/90">{props.primaryLabel}</Link>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <h2 className="text-center text-3xl font-black text-brand-secondary sm:text-4xl">{props.sectionTitle}</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {props.steps.map((step, index) => {
              const Icon = stepIcons[index];
              return (
                <article key={step.title} className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary"><Icon size={24} aria-hidden="true" /></div>
                  <h3 className="mt-6 text-xl font-black text-brand-secondary">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-text-muted">{step.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mx-auto mb-20 w-[calc(100%-3rem)] max-w-6xl rounded-[2rem] bg-brand-secondary px-6 py-14 text-center text-white sm:px-12 sm:py-20">
          <CheckCircle2 className="mx-auto text-sky-300" size={36} aria-hidden="true" />
          <h2 className="mt-5 text-3xl font-black sm:text-5xl">{props.ctaTitle}</h2>
          <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-300">{props.ctaDescription}</p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href={props.primaryHref} className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-primary px-7 py-3 font-bold text-white">{props.primaryLabel}</Link>
            {props.secondaryHref && props.secondaryLabel && <Link href={props.secondaryHref} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/25 px-7 py-3 font-bold text-white transition hover:bg-white/10">{props.secondaryLabel}</Link>}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
