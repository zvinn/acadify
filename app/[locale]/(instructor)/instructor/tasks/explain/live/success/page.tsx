export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowRight, Check, Clock3, Info, ShieldCheck } from "lucide-react";

export default function LiveTrialSuccessPage() {
  return (
    <div className="min-h-screen bg-white px-4 py-16 sm:px-6">
      <main className="mx-auto flex min-h-[calc(100vh-128px)] max-w-3xl flex-col items-center justify-center border border-dashed border-[#00a6ff] px-6 py-12 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-[#eaf5ff] shadow-[0_18px_38px_rgba(82,188,227,0.20)]">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#52bce3] shadow-[0_12px_24px_rgba(82,188,227,0.35)]">
            <Check className="h-9 w-9 text-white" strokeWidth={3} />
          </div>
        </div>

        <h1 className="mt-8 max-w-xl text-4xl font-black leading-tight tracking-normal text-slate-950 sm:text-5xl">
          Trial For live explaintion Submitted Successfully
        </h1>

        <p className="mt-3 max-w-lg text-xl font-medium leading-8 text-slate-600">
          Your trial video has been uploaded and is now waiting for student approval.
        </p>

        <section className="mt-10 w-full max-w-lg rounded-2xl bg-[#eef4ff] p-8">
          <div className="flex gap-5 text-start">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#037da9]">
              <Info className="h-5 w-5" />
            </span>
            <p className="text-sm font-medium leading-6 text-slate-600">
              You will be notified once the student reviews your trial and makes a
              decision. This usually takes 24-48 hours.
            </p>
          </div>

          <Link
            href="/instructor/offers"
            className="mt-8 inline-flex h-14 w-full items-center justify-center gap-3 rounded-lg bg-[#142235] text-base font-black text-white shadow-[0_14px_22px_rgba(15,23,42,0.22)] transition-colors hover:bg-[#0f1a2a]"
          >
            Go to Offers
            <ArrowRight className="h-5 w-5" />
          </Link>
        </section>

        <div className="mt-20 flex flex-wrap items-center justify-center gap-8 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
          <span className="inline-flex items-center gap-2">
            <Clock3 className="h-4 w-4" />
            Pending Review
          </span>
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Secure Upload
          </span>
        </div>
      </main>
    </div>
  );
}
