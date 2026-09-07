import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
  variant?: "default" | "outlined" | "elevated";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", padding = "md", variant = "default", children, ...props }, ref) => {
    
    const baseStyles = "rounded-card bg-white transition-all overflow-hidden";
    
    const variants = {
      default: "border border-border-subtle shadow-sm",
      outlined: "border-2 border-zinc-100",
      elevated: "shadow-xl border border-zinc-100/50"
    };

    const paddings = {
      none: "",
      sm: "p-4",
      md: "p-6 sm:p-8",
      lg: "p-8 sm:p-12"
    };

    const combinedClasses = `${baseStyles} ${variants[variant]} ${paddings[padding]} ${className}`;

    return (
      <div ref={ref} className={combinedClasses} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
