import { Link } from "@/src/i18n/navigation";
import { ChevronLeft } from "lucide-react";

import { getStudentMe } from "@/lib/api/profile";

import { StudentEditProfileForm } from "./StudentEditProfileForm";

export default async function StudentEditProfilePage() {
  const user = await getStudentMe();

  return (
    <div className="min-h-screen px-4 py-7 sm:px-6 lg:px-8" dir="ltr">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/profile"
          className="inline-flex items-center gap-1 text-sm mb-8 transition-opacity hover:opacity-70"
          style={{ color: "#162535", opacity: 0.5 }}
        >
          <ChevronLeft size={16} />
          Back
        </Link>

        <header>
          <h1 className="text-3xl font-black tracking-normal text-slate-950">
            Edit Profile
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Update your student account information.
          </p>
        </header>

        <StudentEditProfileForm user={user} />
      </div>
    </div>
  );
}
