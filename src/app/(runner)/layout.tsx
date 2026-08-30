import { DashboardShell, Sidebar, type NavItem } from "@/components/layout/Sidebar";
import { requireUser } from "@/lib/auth/session";

const items: NavItem[] = [
  { href: "/runner", label: "Available", icon: "truck" },
  { href: "/runner/deliveries", label: "My deliveries", icon: "box" },
  { href: "/runner/earnings", label: "Earnings", icon: "wallet" },
];

export default async function RunnerLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser("runner");
  return <DashboardShell sidebar={<Sidebar role="Runner" items={items} name={user.name ?? ""} sub="Runner" />}>{children}</DashboardShell>;
}
