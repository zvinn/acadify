export const dynamic = "force-dynamic";

import { Star } from "lucide-react";

import { loginStudent } from "@/app/auth/actions";
import { AuthFormCard } from "../../components/AuthFormCard";
import { AuthIllustrationLayout } from "../../components/AuthIllustrationLayout";
import { LoginForm } from "../../components/LoginForm";

type LoginPageProps = {
  searchParams: Promise<{ next?: string | string[] }>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function StudentLoginPage({
  searchParams,
}: LoginPageProps) {
  const { next } = await searchParams;

  return (
    <AuthIllustrationLayout
      title={<>Student Login</>}
      subtitle="Access your account and continue your learning journey."
      illustrationType="student-login"
      badgeIcon={<Star size={24} />}
      badgeTitle="JOIN Acadify"
      badgeDesc="Get expert support for your next academic milestone."
    >
      <div className="flex w-full flex-1 items-center justify-center lg:justify-end">
        <AuthFormCard title="">
          <LoginForm
            action={loginStudent}
            role="student"
            registerHref="/auth/student/register"
            registerLabel="Register as Student"
            nextPath={first(next)}
          />
        </AuthFormCard>
      </div>
    </AuthIllustrationLayout>
  );
}