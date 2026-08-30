import Link from "next/link";
import { Avatar, Icon, Logo, type IconName } from "@/components/ui";
import { signOut } from "@/lib/auth";

export type NavItem = { href: string; label: string; icon: IconName };

export function Sidebar({ role, items, active, name, sub }: { role: string; items: NavItem[]; active?: string; name: string; sub: string }) {
  return (
    <aside className="flex w-[248px] shrink-0 flex-col gap-2 border-r border-border bg-surface p-4">
      <div className="px-2 pb-5"><Logo size={30} /></div>
      <div className="px-2 pb-3 text-xs font-semibold uppercase tracking-wider text-muted">{role}</div>
      {items.map((it) => {
        const on = active === it.href;
        return (
          <Link key={it.href} href={it.href} className={`flex h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold ${on ? "bg-primary-light text-primary" : "text-muted hover:bg-bg hover:text-ink"}`}>
            <Icon name={it.icon} />
            {it.label}
          </Link>
        );
      })}
      <div className="flex-1" />
      <div className="flex items-center gap-3 border-t border-border px-2 pt-3">
        <Avatar name={name} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-semibold">{name}</div>
          <div className="truncate text-xs text-muted">{sub}</div>
        </div>
        <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
          <button type="submit" title="Log out" className="text-muted hover:text-ink"><Icon name="logout" size={18} /></button>
        </form>
      </div>
    </aside>
  );
}

export function DashboardShell({ sidebar, children }: { sidebar: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg">
      {sidebar}
      <main className="flex min-w-0 flex-1 flex-col gap-6 p-8 lg:px-10">{children}</main>
    </div>
  );
}

export function PageHeader({ title, sub, actions }: { title: string; sub?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div>
        <h1 className="text-[28px] font-bold">{title}</h1>
        {sub ? <p className="mt-1.5 text-muted">{sub}</p> : null}
      </div>
      {actions ? <div className="flex gap-3">{actions}</div> : null}
    </div>
  );
}
