import React from 'react';

export function AuthFormCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[480px] bg-[#2A374A] rounded-[24px] p-8 md:p-10 shadow-2xl relative overflow-hidden">
      {/* Decorative gradient glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[50%] bg-brand-primary opacity-5 blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 w-full">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
          {subtitle && <p className="text-[#94A3B8] text-sm">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
