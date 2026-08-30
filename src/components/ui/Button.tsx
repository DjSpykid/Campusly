"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";

type Variant = "primary" | "secondary" | "outline" | "accent" | "danger" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-primary-dark shadow-[0_6px_16px_rgb(108_76_241/25%)] hover:shadow-[0_8px_20px_rgb(108_76_241/35%)]",
  secondary: "bg-primary-light text-primary hover:bg-[#e2dcfc]",
  outline: "bg-surface text-ink border border-border hover:bg-bg",
  accent: "bg-accent text-ink hover:brightness-95 shadow-[0_6px_16px_rgb(255_184_77/30%)]",
  danger: "bg-red-100 text-danger hover:bg-red-200",
  ghost: "bg-transparent text-ink hover:bg-bg",
};
const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[13px] rounded-[10px]",
  md: "h-11 px-5 text-sm rounded-md",
  lg: "h-[52px] px-7 text-[15px] rounded-md",
};

export const buttonStyles = (variant: Variant = "primary", size: Size = "md", className?: string) =>
  cn(
    "inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
    variants[variant],
    sizes[size],
    className,
  );

type Base = { variant?: Variant; size?: Size; className?: string; loading?: boolean; loadingText?: string };

export function Button({ variant, size, className, loading, loadingText, children, disabled, type = "button", ...props }: Base & ComponentProps<"button">) {
  const { pending } = useFormStatus();
  const busy = loading || (type === "submit" && pending);
  return (
    <button type={type} className={buttonStyles(variant, size, className)} disabled={disabled || busy} aria-busy={busy} {...props}>
      {busy ? <Spinner size={size === "sm" ? 14 : 18} /> : null}
      {busy && loadingText ? loadingText : children}
    </button>
  );
}

export function ButtonLink({ variant, size, className, ...props }: Base & ComponentProps<typeof Link>) {
  return <Link className={buttonStyles(variant, size, className)} {...props} />;
}
