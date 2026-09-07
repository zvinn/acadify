export const dynamic = "force-dynamic";

import { KeyRound } from "lucide-react";
import { notFound } from "next/navigation";

import { AuthFormCard } from "../../../components/AuthFormCard";
import { AuthIllustrationLayout } from "../../../components/AuthIllustrationLayout";
import { PasswordResetForm } from "../../../components/PasswordResetForm";

type PasswordResetPageProps = {
  params: Promise<{ role: string; stage: string }>;
  searchParams: Promise<{ email?: string | string[] }>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function PasswordResetPage({
  params,
  searchParams,
}: PasswordResetPageProps) {
  const [{ role, stage }, query] = await Promise.all([params, searchParams]);
  if (
    (role !== "student" && role !== "instructor") ||
    (stage !== "request" && stage !== "verify" && stage !== "reset")
  ) {
    notFound();
  }

  const email = first(query.email);
  if (stage !== "request" && !email) {
    notFound();
  }

  const title =
    stage === "request"
      ? "Forgot your password?"
      : stage === "verify"
        ? "Verify your email"
        : "Choose a new password";
  const subtitle =
    stage === "request"
      ? "Enter your account email and we will send you a verification code."
      : stage === "verify"
        ? `Enter the verification code sent to ${email}.`
        : "Use a strong password that you do not use elsewhere.";

  return (
    <AuthIllustrationLayout
      title={<>{title}</>}
      subtitle={subtitle}
      illustrationType={
        role === "student" ? "student-login" : "instructor-login"
      }
      badgeIcon={<KeyRound size={24} />}
      badgeTitle="SECURE ACCOUNT RECOVERY"
      badgeDesc="Complete each step to safely restore access to your account."
    >
      <div className="flex w-full flex-1 items-center justify-center lg:justify-end">
        <AuthFormCard title={title} subtitle={subtitle}>
          <PasswordResetForm role={role} stage={stage} email={email} />
        </AuthFormCard>
      </div>
    </AuthIllustrationLayout>
  );
}
