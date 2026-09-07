"use client";

import { Link } from "@/src/i18n/navigation";
import { useActionState } from "react";
import { ArrowUp } from "lucide-react";

import { registerStudent, type AuthFormState } from "@/app/auth/actions";
import { AuthButton, AuthInput, AuthSelect } from "./AuthInput";
import { AuthFormMessage } from "./AuthFormMessage";

const initialState: AuthFormState = {};

export function StudentRegisterForm() {
  const [state, formAction, pending] = useActionState(
    registerStudent,
    initialState,
  );

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-5">
      <div className="flex flex-col md:flex-row gap-5">
        <div className="flex-1 space-y-2">
          <AuthInput
            label="Full Name"
            name="fullName"
            placeholder="John Doe"
            autoComplete="name"
            required
            disabled={pending}
          />
          <AuthFormMessage state={state} field="fullName" />
        </div>
        <AuthInput
          label="University"
          name="university"
          placeholder="Enter University Name"
          className="flex-1"
          disabled={pending}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        <AuthInput
          label="Faculty / College"
          name="faculty"
          placeholder="e.g. Engineering"
          className="flex-1"
          disabled={pending}
        />
        <AuthInput
          label="Major ID"
          name="major"
          placeholder="Backend major id"
          className="flex-1"
          disabled={pending}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        <AuthSelect
          label="Academic Year"
          name="year"
          options={[
            { value: "first", label: "Year 1" },
            { value: "second", label: "Year 2" },
            { value: "third", label: "Year 3" },
            { value: "fourth", label: "Year 4" },
            { value: "fifth", label: "Year 5+" },
          ]}
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

      <div className="flex flex-col md:flex-row gap-5 items-end">
        <AuthSelect
          label="Phone Code"
          name="phoneCode"
          options={[
            { value: "+966", label: "+966" },
            { value: "+20", label: "+20" },
            { value: "+971", label: "+971" },
          ]}
          className="w-full md:w-1/3"
          disabled={pending}
        />
        <div className="w-full md:w-2/3 space-y-2">
          <AuthInput
            label="Phone Number"
            name="phoneNumber"
            placeholder="50 123 4567"
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
          placeholder="student@university.edu"
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

      <div className="mt-2 rounded-xl border border-dashed border-[#475569] bg-[#2e3b4e]/50 px-4 py-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#3b4759] text-[#55B5DE]">
          <ArrowUp size={24} />
        </div>
        <label className="block text-sm font-semibold text-white">
          University ID
        </label>
        <p className="mb-4 mt-1 text-xs text-gray-400">
          Supported: PDF, DOC, PPT, images, ZIP
        </p>
        <input
          type="file"
          name="StudentIdImage"
          className="block w-full cursor-pointer rounded-lg bg-white text-sm text-slate-800 file:mr-4 file:border-0 file:bg-[#55B5DE] file:px-4 file:py-3 file:text-sm file:font-bold file:text-white"
          disabled={pending}
        />
      </div>

      <label className="mt-4 flex items-start gap-3 text-xs text-gray-300">
        <input
          type="checkbox"
          name="terms"
          className="mt-0.5 h-4 w-4 rounded bg-white border-gray-300 focus:ring-brand-primary"
          required
          disabled={pending}
        />
        <span>
          By creating an account, you agree to the Acadify{" "}
          <a href="#" className="text-[#55B5DE] hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-[#55B5DE] hover:underline">
            Privacy Policy
          </a>
          .
        </span>
      </label>

      <AuthFormMessage state={state} />

      <AuthButton type="submit" className="mt-2" disabled={pending}>
        {pending ? "Creating account..." : "Create Account"}
      </AuthButton>

      <p className="text-center text-sm text-gray-300 mt-2">
        Already have an account?{" "}
        <Link
          href="/auth/student/login"
          className="text-[#55B5DE] font-semibold hover:underline"
        >
          Login
        </Link>
      </p>
    </form>
  );
}