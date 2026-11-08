import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground flex h-12 w-full rounded-[12px] border border-[var(--border)] bg-white px-4 py-2 text-[17px] tracking-[-0.022em] transition-[border-color,box-shadow] file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:border-[var(--gold-ink)] focus-visible:ring-[3px] focus-visible:ring-[rgb(244_91_30/0.3)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
