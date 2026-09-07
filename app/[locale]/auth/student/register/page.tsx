import { CheckCircle2 } from "lucide-react";

import { AuthFormCard } from "../../components/AuthFormCard";
import { AuthIllustrationLayout } from "../../components/AuthIllustrationLayout";
import { StudentRegisterForm } from "../../components/StudentRegisterForm";

export default function StudentRegisterPage() {
  return (
    <AuthIllustrationLayout
      title={
        <>
          Learn with confidence.
          <br />
          <span className="text-[#55B5DE]">Start with Acadify.</span>
        </>
      }
      subtitle="Create your student account and submit requests to qualified instructors."
      illustrationType="student-register"
      badgeIcon={<CheckCircle2 size={24} />}
      badgeTitle="ASSIGNMENT HELP"
      badgeDesc="Expert support for assignments, videos, and live sessions."
    >
      <AuthFormCard
        title="Create Student Account"
        subtitle="Use accurate academic information so instructors can match your request."
      >
        <StudentRegisterForm />
      </AuthFormCard>
    </AuthIllustrationLayout>
  );
}