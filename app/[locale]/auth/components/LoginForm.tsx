"use client";

import { Link } from "@/src/i18n/navigation";
import { useActionState } from "react";
import { useTranslations } from "next-intl";

import { AuthInput, AuthButton } from "./AuthInput";
import { AuthFormMessage } from "./AuthFormMessage";
import type { AuthFormState } from "@/app/auth/actions";

type LoginFormProps = {
  action: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  role: "student" | "instructor";
  registerHref: string;
  registerLabel: string;
  nextPath?: string;
};

const initialState: AuthFormState = {};

export function LoginForm({
  action,
  role,
  registerHref,
  nextPath,
}: LoginFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const t = useTranslations("auth.login");

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {nextPath && <input type="hidden" name="next" value={nextPath} />}
      <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-3.5 text-xs text-sky-200">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-semibold text-sky-300">🔑 Demo Credentials:</span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">Demo Mode</span>
        </div>
        <div className="flex items-center justify-between py-0.5">
          <span className="text-gray-300">Email:</span>
          <code className="font-mono bg-black/40 px-1.5 py-0.5 rounded text-white select-all">
            {role === "student" ? "student@acadify.com" : "instructor@acadify.com"}
          </code>
        </div>
        <div className="flex items-center justify-between py-0.5">
          <span className="text-gray-300">Password:</span>
          <code className="font-mono bg-black/40 px-1.5 py-0.5 rounded text-white select-all">
            demo123
          </code>
        </div>
        <div className="mt-2 pt-1.5 border-t border-sky-500/20 text-[11px] text-sky-300/80 flex items-center justify-between">
          <span>Admin Access:</span>
          <span className="font-mono text-white">admin@acadify.com</span>
        </div>
      </div>

      <div className="space-y-2">
        <AuthInput
          label={t("email")}
          name="email"
          type="email"
          placeholder={t("emailPlaceholder")}
          autoComplete="email"
          required
          disabled={pending}
        />
        <AuthFormMessage state={state} field="email" />
      </div>

      <div className="space-y-2">
        <AuthInput
          label={t("password")}
          name="password"
          type="password"
          placeholder={t("passwordPlaceholder")}
          autoComplete="current-password"
          isPassword
          required
          disabled={pending}
        />
        <AuthFormMessage state={state} field="password" />
      </div>

      <div className="flex items-center justify-between mt-2 text-sm text-gray-300">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="remember"
            className="w-4 h-4 rounded text-brand-primary border-gray-400 focus:ring-brand-primary"
            disabled={pending}
          />
          <span>{t("rememberMe")}</span>
        </label>

        <Link
          href={`/auth/${role}/password-reset/request`}
          className="font-medium text-sky-300 hover:underline"
        >
          {t("forgotPassword")}
        </Link>
      </div>

      <AuthFormMessage state={state} />

      <AuthButton type="submit" className="mt-4" disabled={pending}>
        {pending ? t("submitting") : t("submit")}
      </AuthButton>

      <div className="relative flex py-5 items-center">
        <div className="flex-grow border-t border-gray-600"></div>
        <span className="mx-4 shrink-0 text-xs text-gray-300">{t("or")}</span>
        <div className="flex-grow border-t border-gray-600"></div>
      </div>

      <p className="text-center text-sm text-gray-300">
        {t("noAccount")}{" "}
        <Link
          href={registerHref}
          className="font-semibold text-sky-300 hover:underline"
        >
          {role === "student" ? t("registerStudent") : t("registerInstructor")}
        </Link>
      </p>
    </form>
  );
}
