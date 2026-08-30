import { cn } from "@/lib/utils";

export function Avatar({ name, className, accent }: { name: string; className?: string; accent?: boolean }) {
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
  return (
    <div
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-pill text-[13px] font-bold",
        accent ? "bg-accent text-ink" : "bg-primary-light text-primary",
        className,
      )}
      aria-hidden
    >
      {initials}
    </div>
  );
}
