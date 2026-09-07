"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, UploadCloud, Home, ArrowRight } from "lucide-react";

import { Link } from "@/src/i18n/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") ?? "lecture";
  const isAssignment = type === "assignment";

  const config = {
    title: isAssignment
      ? "Assignment Uploaded Successfully!"
      : "Lecture Materials Uploaded Successfully!",
    subtitle: isAssignment
      ? "Your assignment has been submitted for expert review. You'll receive detailed feedback soon."
      : "Your lecture material has been received. Our experts will analyze it and provide personalized insights.",
    nextLabel: isAssignment ? "View My Assignments" : "Upload Another File",
    nextHref: isAssignment ? "/assignments" : "/upload",
  };

  return (
    <div className="max-w-md w-full text-center">
      {/* Success Icon with animated ring */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div
            className="absolute inset-0 rounded-full animate-ping opacity-20"
            style={{ background: "#5CC0D6" }}
          />
          <div
            className="relative w-24 h-24 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(92,192,214,0.15)",
              border: "2px solid rgba(92,192,214,0.3)",
            }}
          >
            <CheckCircle2 size={48} style={{ color: "#5CC0D6" }} />
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-3" style={{ color: "#162535" }}>
        {config.title}
      </h1>
      <p className="text-sm leading-relaxed mb-8" style={{ color: "#667085" }}>
        {config.subtitle}
      </p>

      {/* Status tracker */}
      <div
        className="rounded-2xl p-5 mb-8 flex flex-col gap-3 text-start"
        style={{ background: "#fff", boxShadow: "0 1px 8px rgba(22,37,53,0.06)" }}
      >
        {[
          { label: "File Received", done: true },
          { label: "Expert Assigned", done: true },
          { label: "Under Review", done: false },
          { label: "Feedback Ready", done: false },
        ].map((step, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
              style={
                step.done
                  ? { background: "rgba(34,197,94,0.1)", color: "#22C55E" }
                  : { background: "#F0F0F0", color: "#9CA3AF" }
              }
            >
              {step.done ? (
                <CheckCircle2 size={14} />
              ) : (
                <span className="w-2 h-2 rounded-full bg-current" />
              )}
            </div>
            <span
              className="text-sm font-medium"
              style={{ color: step.done ? "#162535" : "#9CA3AF" }}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Link
          href={config.nextHref}
          className="w-full inline-flex items-center justify-center gap-2 font-bold py-3.5 rounded-full transition-all hover:opacity-90 hover:scale-[1.02]"
          style={{ background: "#5CC0D6", color: "#fff" }}
        >
          {config.nextLabel}
          <ArrowRight size={18} />
        </Link>
        <Link
          href="/upload"
          className="w-full inline-flex items-center justify-center gap-2 font-semibold py-3.5 rounded-full text-sm transition-all hover:opacity-80"
          style={{ background: "#fff", color: "#162535", border: "1.5px solid #E5E7EB" }}
        >
          <UploadCloud size={16} />
          Upload Another File
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70 mt-1"
          style={{ color: "#667085" }}
        >
          <Home size={15} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default function UploadSuccessPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "#F6F7F8" }}
    >
      <Suspense
        fallback={
          <div className="text-sm" style={{ color: "#667085" }}>
            Loading...
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
