"use client";

import { useState, type ComponentProps } from "react";
import { Icon, type IconName } from "@/components/ui";

export function IconInput({ icon, error, label, className = "", type, ...props }: { icon: IconName; error?: string; label: string } & ComponentProps<"input">) {
  const [show, setShow] = useState(false);
  const isPw = type === "password";
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold">{label}</span>
      <div className={`flex h-12 items-center gap-2.5 rounded-md border bg-surface px-3.5 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 ${error ? "border-danger" : "border-border"} ${className}`}>
        <Icon name={icon} size={18} className="shrink-0 text-muted" />
        <input type={isPw && show ? "text" : type} className="h-full w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted" {...props} />
        {isPw ? <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="text-muted hover:text-ink"><Icon name={show ? "eyeOff" : "eye"} size={18} /></button> : null}
      </div>
      {error ? <span className="mt-1 block text-xs text-danger">{error}</span> : null}
    </label>
  );
}
