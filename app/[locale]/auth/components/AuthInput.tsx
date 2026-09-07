'use client';

import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  isPassword?: boolean;
}

export function AuthInput({ label, isPassword, className = '', ...props }: AuthInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const generatedId = React.useId();
  const inputId = props.id ?? generatedId;
  const t = useTranslations('authLayout');
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : props.type;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={inputId} className="text-sm font-semibold text-white/90">
        {label}
      </label>
      <div className="relative w-full text-[#0E1111] overflow-hidden text-sm">
        <input
          id={inputId}
          type={inputType ?? 'text'}
          className="w-full h-[48px] bg-white rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-medium placeholder:text-gray-400 placeholder:font-normal disabled:cursor-not-allowed disabled:opacity-70"
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute end-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            aria-label={showPassword ? t('hidePassword') : t('showPassword')}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}

type AuthSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: { value: string; label: string }[];
  className?: string;
};

export function AuthSelect({ label, options, className = '', ...props }: AuthSelectProps) {
  const generatedId = React.useId();
  const selectId = props.id ?? generatedId;
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={selectId} className="text-sm font-semibold text-white/90">
        {label}
      </label>
      <div className="relative w-full text-[#0E1111] text-sm">
        <select
          id={selectId}
          className="appearance-none w-full h-[48px] bg-white rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-medium cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {/* Simple down arrow */}
        <div className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-gray-500">
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export function AuthButton({ children, variant = 'primary', className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }) {
  return (
    <button
      className={`w-full h-[48px] rounded-xl font-bold text-sm transition-all shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 ${
        variant === 'primary' 
          ? 'bg-brand-primary hover:bg-brand-primary/90 text-white shadow-brand-primary/30 hover:shadow-brand-primary/40'
          : 'bg-[#3A4B61] hover:bg-[#324154] text-white shadow-none'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
