import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import React from "react";

interface ActionSuccessProps {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  children?: React.ReactNode;
}

export default function ActionSuccess({
  title,
  description,
  buttonText,
  buttonHref,
  children,
}: ActionSuccessProps) {
  return (
    <div className="min-h-[80vh] bg-white flex flex-col items-center justify-center py-16 px-6">
      {/* Success Icon */}
      <div className="w-24 h-24 bg-[#eff6ff] rounded-3xl flex items-center justify-center mb-8 shadow-sm">
        <div className="w-16 h-16 bg-[#52bce3] rounded-2xl flex items-center justify-center shadow-md">
          <Check className="w-8 h-8 text-white" strokeWidth={3} />
        </div>
      </div>

      {/* Headings */}
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#111827] mb-4 text-center tracking-tight">
        {title}
      </h1>
      <p className="text-gray-600 text-lg text-center max-w-lg mb-10">
        {description}
      </p>

      {/* Button */}
      <Link
        href={buttonHref}
        className="bg-[#111827] hover:bg-[#1f2937] text-white font-bold py-4 px-10 rounded-xl transition-colors flex items-center justify-center gap-2 mb-12 shadow-sm"
      >
        {buttonText}
        <ArrowRight className="w-5 h-5 ml-1" />
      </Link>

      {/* Extras (Cards, Info Alert, Footer, etc.) */}
      {children && <div className="max-w-4xl w-full flex flex-col items-center">{children}</div>}
    </div>
  );
}
