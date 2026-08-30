import { cn } from "@/lib/utils";
import { STATUS_TONE } from "@/config/status";

type Tone = "neutral" | "warning" | "success" | "danger" | "primary";
const tones: Record<Tone, string> = {
  neutral: "bg-[#f1f0f6] text-muted",
  primary: "bg-primary-light text-primary",
  success: "bg-green-100 text-green-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700",
};

export function Badge({ tone = "neutral", className, children }: { tone?: Tone; className?: string; children: React.ReactNode }) {
  return <span className={cn("inline-flex h-6 items-center rounded-pill px-2.5 text-xs font-semibold", tones[tone], className)}>{children}</span>;
}

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={STATUS_TONE[status] ?? "neutral"}>{status.replace(/_/g, " ")}</Badge>;
}
