export const dynamic = "force-dynamic";

import Link from "next/link";
import { Check, Info, ArrowRight, Clock, ShieldCheck } from "lucide-react";

export default function TrialSuccessPage() {
  return (
    <div className="min-h-[80vh] bg-white flex flex-col items-center justify-center py-16 px-6">
      
      {/* Success Icon */}
      <div className="w-24 h-24 bg-[#eff6ff] rounded-[32px] flex items-center justify-center mb-8">
        <div className="w-16 h-16 bg-[#52bce3] rounded-2xl flex items-center justify-center shadow-sm">
          <Check className="w-8 h-8 text-white" strokeWidth={3} />
        </div>
      </div>

      {/* Headings */}
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#111827] mb-4 text-center tracking-tight">
        Trial Submitted Successfully
      </h1>
      <p className="text-gray-600 text-lg text-center max-w-lg mb-10">
        Your trial video has been uploaded and is now waiting for student approval.
      </p>

      {/* Info Card with Button inside */}
      <div className="bg-[#eff6ff] rounded-[32px] p-6 max-w-xl w-full flex flex-col items-center">
        
        {/* Info Alert */}
        <div className="bg-white rounded-2xl p-5 flex gap-4 items-start w-full mb-6 shadow-sm border border-gray-100 mt-2">
          <div className="w-6 h-6 rounded-full border-2 border-[#0369a1] flex items-center justify-center flex-shrink-0 mt-0.5">
            <Info className="w-3.5 h-3.5 text-[#0369a1]" strokeWidth={3} />
          </div>
          <p className="text-[#475569] leading-relaxed text-[15px] font-medium">
            You will be notified once the student reviews your trial and makes a decision. This usually takes 24-48 hours.
          </p>
        </div>

        {/* Action Button */}
        <Link
          href="/instructor/offers"
          className="w-full bg-[#111827] hover:bg-[#1f2937] text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2"
        >
          Go to Offers 
          <ArrowRight className="w-5 h-5 ms-1" />
        </Link>
      </div>

      {/* Footer Status Tags */}
      <div className="flex items-center justify-center gap-10 mt-12 text-xs font-bold text-gray-400 uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Pending Review
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          Secure Upload
        </div>
      </div>
      
    </div>
  );
}
