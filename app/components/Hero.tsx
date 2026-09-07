"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("home.hero");
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
      {/* Background patterns */}
      <div className="brand-pattern pointer-events-none absolute inset-0 text-white opacity-[0.03]" />
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Text Content Area */}
          <div className="flex-1 text-center lg:text-end">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-primary/5 border border-brand-primary/10 rounded-full mb-8">
               <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
               </svg>
               <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">{t("badge")}</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black font-heading text-brand-secondary leading-[1.1] mb-8">
              {t("title1")} <br />
              <span className="text-brand-primary">{t("title2")}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-text-muted mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              {t("description")}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-10">
              <Link
                href="/get-started"
                className="w-full sm:w-auto bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-lg px-12 py-5 rounded-btn shadow-xl shadow-brand-primary/20 transition-all hover:translate-y-[-4px] flex items-center justify-center gap-2"
              >
                {t("getStarted")}
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              
              <Link
                href="/how-it-works"
                className="w-full sm:w-auto bg-white hover:bg-surface text-brand-secondary border border-border-subtle font-bold text-lg px-12 py-5 rounded-btn transition-all flex items-center justify-center gap-2"
              >
                {t("watchDemo")}
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-3 justify-center lg:justify-start">
               <div className="flex -space-x-3 space-x-reverse">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-zinc-200 overflow-hidden">
                       <div className="w-full h-full bg-gradient-to-br from-zinc-300 to-zinc-400" />
                    </div>
                  ))}
               </div>
               <span className="text-sm font-medium text-text-muted">
                  {t("socialProof")}<span className="text-brand-secondary font-bold">{t("socialProofBold")}</span>{t("socialProofEnd")}
               </span>
            </div>
          </div>

          {/* Visual Area (Figma Replica) */}
          <div className="flex-1 relative w-full max-w-xl">
             {/* Main Card */}
             <div className="relative z-20 w-4/5 me-auto aspect-square bg-gradient-to-br from-brand-primary to-brand-primary/80 rounded-[40px] shadow-2xl flex items-center justify-center overflow-hidden">
                <div className="brand-pattern absolute inset-0 text-white opacity-10" />
                <svg className="w-32 h-32 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M12 2L1 7l11 5 11-5-11-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                
                {/* Floating Inner Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
             </div>

             {/* UI Elements (Floating Cards) */}
             <div className="absolute top-10 right-0 z-30 w-64 bg-white p-4 rounded-xl shadow-2xl border border-white animate-float">
                <div className="flex items-center gap-3 mb-3">
                   <div className="w-8 h-8 bg-success rounded-lg flex items-center justify-center text-white text-xs">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                   </div>
                   <div className="flex-1">
                      <div className="h-2 w-24 bg-zinc-100 rounded mb-1" />
                      <div className="h-1.5 w-16 bg-zinc-50 rounded" />
                   </div>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between items-center text-[10px] font-bold text-text-muted mb-1">
                      <span>{t("uploading")}</span>
                      <span>85%</span>
                   </div>
                   <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-primary w-[85%] rounded-full shadow-sm" />
                   </div>
                </div>
             </div>

             <div className="absolute bottom-10 left-0 z-30 w-56 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-white animate-float-delayed">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center text-brand-primary">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                   </div>
                   <div>
                      <div className="text-[10px] font-bold text-brand-secondary">Lecture_Notes.pdf</div>
                      <div className="text-[8px] text-text-muted uppercase tracking-tighter">{t("uploaded")}</div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-15px) translateX(5px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(12px) translateX(-8px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 5s ease-in-out infinite; }
      `}</style>
    </section>
  );
}
