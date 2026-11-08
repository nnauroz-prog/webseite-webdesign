import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "placeholder:text-muted-foreground flex min-h-[96px] w-full rounded-[12px] border border-[var(--border)] bg-white px-4 py-3 text-[17px] tracking-[-0.022em] transition-[border-color,box-shadow] focus-visible:border-[var(--gold-ink)] focus-visible:ring-[3px] focus-visible:ring-[rgb(244_91_30/0.3)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
