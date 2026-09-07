import { Link } from "@/src/i18n/navigation";
import { ArrowLeft } from "lucide-react";

import { getInstructorMe } from "@/lib/api/profile";

import { InstructorEditProfileForm } from "./InstructorEditProfileForm";

export default async function EditProfilePage() {
  const user = await getInstructorMe();

  return (
    <div className="min-h-screen bg-[#f7f7f8] px-4 py-7 sm:px-6 lg:px-8" dir="ltr">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/instructor/profile"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <header className="mt-2">
          <h1 className="text-3xl font-black tracking-normal text-slate-950">
            Edit Profile
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Update your personal and academic information.
          </p>
        </header>

        <InstructorEditProfileForm user={user} />
      </div>
    </div>
  );
}
