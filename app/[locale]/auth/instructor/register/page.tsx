import { Award } from "lucide-react";

import { AuthFormCard } from "../../components/AuthFormCard";
import { AuthIllustrationLayout } from "../../components/AuthIllustrationLayout";
import { InstructorRegisterForm } from "../../components/InstructorRegisterForm";

export default function InstructorRegisterPage() {
  return (
    <AuthIllustrationLayout
      title={
        <>
          Share your expertise.
          <br />
          <span className="text-[#55B5DE]">Teach with Acadify.</span>
        </>
      }
      subtitle="Create an instructor profile and respond to student requests."
      illustrationType="instructor-register"
      badgeIcon={<Award size={24} />}
      badgeTitle="CERTIFIED EXPERT"
      badgeDesc="Build your profile and support students worldwide."
    >
      <AuthFormCard
        title="Create Instructor Account"
        subtitle="Tell us about your academic and professional background."
      >
        <InstructorRegisterForm />
      </AuthFormCard>
    </AuthIllustrationLayout>
  );
}