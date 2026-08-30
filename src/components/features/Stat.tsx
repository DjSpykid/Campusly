import { Card, Icon } from "@/components/ui";

export function Stat({ label, value, hint, up }: { label: string; value: string; hint?: string; up?: boolean }) {
  return (
    <Card className="flex flex-1 flex-col gap-2 px-6 py-5">
      <span className="text-[13px] text-muted">{label}</span>
      <span className="font-display text-[28px] font-extrabold tracking-tight">{value}</span>
      {hint ? <span className={`flex items-center gap-1 text-xs ${up ? "text-green-700" : "text-muted"}`}>{up ? <Icon name="arrowUp" size={14} /> : null}{hint}</span> : null}
    </Card>
  );
}

export function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead><tr>{head.map((h) => <th key={h} className="border-b border-border px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">{h}</th>)}</tr></thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
export const Td = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => <td className={`border-b border-border px-4 py-3.5 align-middle ${className}`}>{children}</td>;

export function Timeline({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center">
      {steps.map((s, i) => (
        <div key={s} className={`flex items-center ${i < steps.length - 1 ? "flex-1" : ""}`}>
          <div className="flex w-[90px] flex-col items-center gap-1.5">
            <div className={`flex size-7 items-center justify-center rounded-pill border-2 ${i <= current ? "border-primary bg-primary" : "border-border bg-surface"}`}>
              {i < current ? <Icon name="check" size={14} className="text-white" /> : i === current ? <div className="size-2 rounded-pill bg-white" /> : null}
            </div>
            <span className={`text-center text-xs ${i <= current ? "text-ink" : "text-muted"} ${i === current ? "font-semibold" : ""}`}>{s}</span>
          </div>
          {i < steps.length - 1 ? <div className={`mx-[-20px] mb-[22px] h-0.5 flex-1 ${i < current ? "bg-primary" : "bg-border"}`} /> : null}
        </div>
      ))}
    </div>
  );
}

export const fmtDate = (iso: string) => new Date(iso).toLocaleString("en-NG", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
export const fmtDay = (iso: string) => new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short" });
