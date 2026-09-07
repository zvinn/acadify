export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  FileText,
  MessageSquare,
} from "lucide-react";

const NEXT_STEPS = [
  {
    icon: FileText,
    title: "Project Files",
    description: "All reference documents have been indexed and are ready.",
  },
  {
    icon: Clock3,
    title: "Deadline Tracking",
    description: "Automated reminders set for your upcoming milestones.",
  },
  {
    icon: MessageSquare,
    title: "Collaboration",
    description: "Direct channel opened for project-specific queries.",
  },
];

export default function ExplainSuccessPage() {
  return (
    <div className="min-h-screen bg-[#f5f7fc] px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/instructor/tasks/explain"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="mx-auto flex min-h-[calc(100vh-120px)] max-w-3xl flex-col items-center justify-center pt-10 text-center">
          <div className="fixed top-0 z-20 hidden w-full max-w-lg items-start gap-3 rounded-b-lg bg-[#142235] px-5 py-4 text-start text-sm font-semibold text-white shadow-lg sm:flex">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#52bce3]">
              <Check className="h-4 w-4" strokeWidth={3} />
            </span>
            <p>The offer has been submitted to offers successfully.</p>
          </div>

          <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-[#eaf5ff] shadow-[0_18px_38px_rgba(82,188,227,0.20)]">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#52bce3] shadow-[0_12px_24px_rgba(82,188,227,0.35)]">
              <Check className="h-9 w-9 text-white" strokeWidth={3} />
            </div>
          </div>

          <h1 className="mt-10 text-4xl font-bold leading-none tracking-normal text-slate-950 sm:text-5xl">
            Confirmed
            <span className="block">Successfully</span>
          </h1>

          <p className="mt-6 max-w-md text-base font-medium leading-relaxed text-slate-600">
            The offer has been added to offers. When student confirm, you can now start working on the files and manage everything from My Projects.
          </p>

          <Link
            href="/instructor/offers"
            className="mt-8 inline-flex h-14 items-center justify-center gap-3 rounded-lg bg-[#142235] px-10 text-sm font-black text-white shadow-[0_14px_22px_rgba(15,23,42,0.22)] transition-colors hover:bg-[#0f1a2a]"
          >
            Go to offers
            <ArrowRight className="h-4 w-4" />
          </Link>

          <div className="mt-20 grid w-full gap-5 sm:grid-cols-3">
            {NEXT_STEPS.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.title}
                  className="rounded-xl bg-white p-6 text-start shadow-sm ring-1 ring-slate-100"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#dff1ff] text-[#037da9]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-5 text-sm font-black text-slate-950">{step.title}</h2>
                  <p className="mt-3 text-xs font-medium leading-relaxed text-slate-600">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
