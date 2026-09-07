import React from 'react';
import { BookOpenCheck, GraduationCap, Presentation, UserRoundCheck } from 'lucide-react';

interface AuthIllustrationLayoutProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  badgeIcon?: React.ReactNode;
  badgeTitle: string;
  badgeDesc: string;
  illustrationType: 'student-register' | 'student-login' | 'instructor-register' | 'instructor-login';
  children: React.ReactNode;
}

export function AuthIllustrationLayout({
  title,
  subtitle,
  badgeIcon,
  badgeTitle,
  badgeDesc,
  illustrationType,
  children
}: AuthIllustrationLayoutProps) {
  const IllustrationIcon = illustrationType === 'student-login'
    ? GraduationCap
    : illustrationType === 'student-register'
      ? BookOpenCheck
      : illustrationType === 'instructor-login'
        ? Presentation
        : UserRoundCheck;

  return (
    <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 h-full items-center lg:items-start pt-4">
      {/* Left side: Illustration */}
      <div className="w-full lg:w-1/2 max-w-xl">
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-tight mb-4">
          {title}
        </h1>
        <p className="text-gray-500 text-lg mb-12">
          {subtitle}
        </p>

        <div className="relative w-full aspect-square max-w-[480px] mx-auto lg:mx-0 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-slate-200" aria-hidden="true">
            <div className="absolute -end-16 -top-16 h-56 w-56 rounded-full bg-brand-primary/15 blur-2xl" />
            <div className="absolute start-1/2 top-1/2 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[2.5rem] bg-white text-brand-primary shadow-xl">
              <IllustrationIcon size={72} strokeWidth={1.3} />
            </div>
          </div>

          {/* Floating Badge */}
          <div className="absolute bottom-6 start-6 flex max-w-[80%] items-start gap-4 rounded-2xl border border-white/50 bg-white/95 p-4 shadow-xl backdrop-blur-md">
            {badgeIcon && (
              <div className="w-10 h-10 rounded-full bg-blue-50 text-brand-primary flex items-center justify-center flex-shrink-0">
                {badgeIcon}
              </div>
            )}
            <div>
              <h4 className="font-bold text-gray-900 text-sm">{badgeTitle}</h4>
              <p className="text-gray-500 text-xs font-medium mt-1 leading-snug">{badgeDesc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Form Details */}
      <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
        {children}
      </div>
    </div>
  );
}
