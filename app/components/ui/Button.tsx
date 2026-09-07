import React from "react";
import { Link } from "@/src/i18n/navigation";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  href?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", isLoading, href, children, disabled, type = "button", ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-bold transition-all rounded-btn focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-brand-primary text-white hover:bg-brand-primary/90 shadow-md hover:shadow-lg focus:ring-brand-primary",
      secondary: "bg-brand-secondary text-white hover:bg-zinc-800 shadow-md hover:shadow-lg focus:ring-brand-secondary",
      outline: "border-2 border-brand-primary text-brand-primary hover:bg-brand-primary/5 focus:ring-brand-primary",
      ghost: "text-text-main hover:bg-zinc-100 focus:ring-zinc-200"
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 flex py-3 text-base",
      lg: "px-10 py-4 flex text-lg"
    };

    const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    if (href) {
      if (disabled || isLoading) {
        return (
          <span className={combinedClasses} aria-disabled="true" aria-busy={isLoading || undefined}>
            {children}
          </span>
        );
      }
      return (
        <Link href={href} className={combinedClasses}>
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        className={combinedClasses}
        {...props}
      >
        {isLoading && (
          <svg aria-hidden="true" className="-ms-1 me-3 h-5 w-5 animate-spin text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
