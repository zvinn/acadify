import React, { useId } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, id, disabled, "aria-describedby": describedBy, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || `input-${generatedId}`;
    const errorId = `${inputId}-error`;
    
    return (
      <div className="flex w-full flex-col gap-2">
        {label && (
          <label htmlFor={inputId} className="text-sm font-bold text-text-main">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={[describedBy, error ? errorId : null].filter(Boolean).join(" ") || undefined}
          className={`
            w-full px-4 py-3 rounded-btn border bg-white
            focus:outline-none focus:ring-2 focus:border-brand-primary placeholder:text-zinc-400
            transition-all text-text-main font-medium
            ${error ? "border-error focus:ring-error/20" : "border-border-subtle hover:border-zinc-300 focus:ring-brand-primary/20"}
            ${disabled ? "opacity-50 cursor-not-allowed bg-zinc-50" : ""}
            ${className}
          `}
          {...props}
        />
        {error && (
          <span id={errorId} className="mt-1 text-xs font-bold text-error" role="alert">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
