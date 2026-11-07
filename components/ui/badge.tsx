import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

export function Badge({ children, className, ...props }: BadgeProps) {
  return (
    <span
      {...props}
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-surface px-3 py-1 text-xs font-medium text-text-secondary",
        className,
      )}
    >
      {children}
    </span>
  );
}