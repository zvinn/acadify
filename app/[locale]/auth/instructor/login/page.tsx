export const dynamic = "force-dynamic";

import { ShieldCheck } from "lucide-react";

import { loginInstructor } from "@/app/auth/actions";
import { AuthFormCard } from "../../components/AuthFormCard";
import { AuthIllustrationLayout } from "../../components/AuthIllustrationLayout";
import { LoginForm } from "../../components/LoginForm";

type LoginPageProps = {
  searchParams: Promise<{ next?: string | string[] }>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function InstructorLoginPage({
  searchParams,
}: LoginPageProps) {
  const { next } = await searchParams;

  return (
    <AuthIllustrationLayout
      title={<>Instructor Login</>}
      subtitle="Access your instructor account and start helping students."
      illustrationType="instructor-login"
      badgeIcon={<ShieldCheck size={24} />}
      badgeTitle="CERTIFIED EXPERT"
      badgeDesc="Empowering students through structured learning and mentorship."
    >
      <div className="flex w-full flex-1 items-center justify-center lg:justify-end">
        <AuthFormCard title="">
          <LoginForm
            action={loginInstructor}
            role="instructor"
            registerHref="/auth/instructor/register"
            registerLabel="Register as Instructor"
            nextPath={first(next)}
          />
        </AuthFormCard>
      </div>
    </AuthIllustrationLayout>
  );
}
