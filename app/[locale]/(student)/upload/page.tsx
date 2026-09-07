"use client";

import { useTranslations } from "next-intl";
import { Video, Radio, FileText, ChevronLeft, ShieldQuestion } from "lucide-react";

import { Link } from "@/src/i18n/navigation";

export default function UploadFilesPage() {
  const t = useTranslations("upload");

  const UPLOAD_TYPES = [
    {
      id: "lecture-video",
      icon: <Video size={36} />,
      title: t("lectureVideoTitle"),
      subtitle: t("lectureVideoSub"),
      description: t("lectureVideoDesc"),
      href: "/upload/lecture?type=video",
      cta: t("getStarted"),
    },
    {
      id: "lecture-live",
      icon: <Radio size={36} />,
      title: t("lectureLiveTitle"),
      subtitle: t("lectureLiveSub"),
      description: t("lectureLiveDesc"),
      href: "/upload/lecture?type=live",
      cta: t("getStarted"),
    },
    {
      id: "assignment",
      icon: <FileText size={36} />,
      title: t("assignmentTitle"),
      subtitle: "",
      description: t("assignmentDesc"),
      href: "/upload/assignment",
      cta: t("getStarted"),
    },
    {
      id: "trial",
      icon: <ShieldQuestion size={36} />,
      title: t("trialTitle"),
      subtitle: t("trialSub"),
      description: t("trialDesc"),
      href: "/upload/trial/choose",
      cta: t("trialCta"),
    },

  ];

  return (
    <div className="min-h-screen" style={{ background: "#F6F7F8" }}>
      <div className="container mx-auto px-6 py-12">

        {/* Back button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm mb-10 transition-opacity hover:opacity-70"
          style={{ color: "#162535", opacity: 0.5 }}
        >
          <ChevronLeft size={16} />
          {t("backToDashboard")}
        </Link>

        {/* Header */}
        <div className="text-center mb-14">
          <h1
            className="text-4xl font-bold mb-3"
            style={{ color: "#162535" }}
          >
            {t("title")}
          </h1>
          <p className="text-base" style={{ color: "#667085" }}>
            {t("subtitle")}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="flex flex-col items-center gap-6 max-w-4xl mx-auto">
          {/* Top row — 2 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {UPLOAD_TYPES.slice(0, 2).map((type) => (
              <UploadCard key={type.id} type={type} />
            ))}
          </div>

          {/* Bottom row — 2 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <UploadCard type={UPLOAD_TYPES[2]} />
            <UploadCard type={UPLOAD_TYPES[3]} />
          </div>
        </div>

        {/* Supported formats note */}
        <p
          className="text-center text-sm mt-10"
          style={{ color: "#667085" }}
        >
          {t("formatsNote")}
        </p>
      </div>
    </div>
  );
}

function UploadCard({
  type,
}: {
  type: { id: string; icon: React.ReactNode; title: string; subtitle: string; description: string; href: string; cta: string; };
}) {
  return (
    <div
      className="group rounded-2xl p-8 flex flex-col gap-5 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      style={{
        background: "#162535",
        boxShadow: "0 4px 32px rgba(22,37,53,0.15)",
      }}
    >
      {/* Icon */}
      <div
        className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: "rgba(92,192,214,0.15)", color: "#5CC0D6" }}
      >
        {type.icon}
      </div>

      {/* Text */}
      <div>
        <h2 className="text-xl font-bold text-white leading-tight">
          {type.title}
        </h2>
        {type.subtitle && (
          <p className="text-sm font-medium mt-0.5" style={{ color: "#5CC0D6" }}>
            {type.subtitle}
          </p>
        )}
        <p className="text-sm mt-2 leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
          {type.description}
        </p>
      </div>

      {/* CTA Button */}
      <Link
        href={type.href}
        className="mt-auto inline-flex items-center justify-center font-semibold py-3 px-6 rounded-full transition-all duration-300 hover:opacity-90 hover:scale-[1.02]"
        style={{ background: "#5CC0D6", color: "#fff" }}
      >
        {type.cta}
      </Link>
    </div>
  );
}
