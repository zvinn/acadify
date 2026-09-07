"use client";

import { Link } from "@/src/i18n/navigation";
import { useActionState } from "react";

import { registerInstructor, type AuthFormState } from "@/app/auth/actions";
import { AuthButton, AuthInput, AuthSelect } from "./AuthInput";
import { AuthFormMessage } from "./AuthFormMessage";

const initialState: AuthFormState = {};

export function InstructorRegisterForm() {
  const [state, formAction, pending] = useActionState(
    registerInstructor,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="space-y-2">
        <AuthInput
          label="Full Name"
          name="fullName"
          placeholder="Johnathan Doe"
          autoComplete="name"
          required
          disabled={pending}
        />
        <AuthFormMessage state={state} field="fullName" />
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        <AuthInput
          label="Age"
          name="age"
          type="number"
          min={18}
          placeholder="28"
          className="w-full md:w-1/3"
          disabled={pending}
        />
        <AuthSelect
          label="Status"
          name="status"
          options={[
            { value: "student", label: "Student" },
            { value: "employed", label: "Employed" },
            { value: "graduate", label: "Graduate" },
          ]}
          className="w-full md:w-2/3"
          disabled={pending}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-5 items-end">
        <AuthSelect
          label="Code"
          name="phoneCode"
          options={[
            { value: "+1", label: "+1 (USA)" },
            { value: "+966", label: "+966 (KSA)" },
            { value: "+20", label: "+20 (EGY)" },
          ]}
          className="w-full md:w-1/3"
          disabled={pending}
        />
        <div className="w-full md:w-2/3 space-y-2">
          <AuthInput
            label="Phone Number"
            name="phoneNumber"
            placeholder="555-0123"
            autoComplete="tel-national"
            required
            disabled={pending}
          />
          <AuthFormMessage state={state} field="phoneNumber" />
        </div>
      </div>

      <div className="space-y-2">
        <AuthInput
          label="Email Address"
          name="email"
          type="email"
          placeholder="email@example.com"
          autoComplete="email"
          required
          disabled={pending}
        />
        <AuthFormMessage state={state} field="email" />
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        <div className="flex-1 space-y-2">
          <AuthInput
            label="Password"
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            isPassword
            required
            disabled={pending}
          />
          <AuthFormMessage state={state} field="password" />
        </div>
        <div className="flex-1 space-y-2">
          <AuthInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            autoComplete="new-password"
            isPassword
            required
            disabled={pending}
          />
          <AuthFormMessage state={state} field="confirmPassword" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        <AuthInput
          label="University"
          name="university"
          placeholder="Cairo University"
          className="flex-1"
          disabled={pending}
        />
        <AuthInput
          label="Faculty"
          name="faculty"
          placeholder="Faculty of Engineering"
          className="flex-1"
          disabled={pending}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        <AuthInput
          label="Specialization"
          name="specialization"
          placeholder="Computer Engineering"
          className="flex-1"
          disabled={pending}
        />
        <AuthInput
          label="Current Job"
          name="currentJob"
          placeholder="Software Engineer"
          className="flex-1"
          disabled={pending}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        <AuthInput
          label="Major ID"
          name="major"
          placeholder="Backend major id"
          className="flex-1"
          disabled={pending}
        />
        <AuthInput
          label="Country ID"
          name="country"
          placeholder="Backend country id"
          className="flex-1"
          disabled={pending}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-white/90">
          Certifications
        </label>
        <textarea
          name="certifications"
          className="w-full h-24 bg-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-medium text-[#0E1111] text-sm resize-none disabled:cursor-not-allowed disabled:opacity-70"
          placeholder="AWS Certified Solutions Architect, Google Cloud Professional Developer"
          disabled={pending}
        />
        <p className="text-xs text-gray-400">
          Separate multiple certifications with commas.
        </p>
      </div>

      <AuthFormMessage state={state} />

      <AuthButton type="submit" className="mt-4" disabled={pending}>
        {pending ? "Creating account..." : "Create Instructor Account"}
      </AuthButton>

      <p className="text-center text-sm text-gray-300 mt-2">
        Already have an account?{" "}
        <Link
          href="/auth/instructor/login"
          className="text-[#55B5DE] font-semibold hover:underline"
        >
          Login
        </Link>
      </p>
    </form>
  );
}
