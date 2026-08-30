import { DashboardShell, Sidebar, type NavItem } from "@/components/layout/Sidebar";
import { requireUser } from "@/lib/auth/session";
import { CAMPUS_NAME } from "@/config/site";

const items: NavItem[] = [
  { href: "/admin", label: "Overview", icon: "grid" },
  { href: "/admin/users", label: "Users", icon: "users" },
  { href: "/admin/businesses", label: "Businesses", icon: "store" },
  { href: "/admin/orders", label: "Orders", icon: "cart" },
  { href: "/admin/bookings", label: "Bookings", icon: "calendar" },
  { href: "/admin/deliveries", label: "Deliveries", icon: "truck" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser("admin");
  return <DashboardShell sidebar={<Sidebar role="Admin" items={items} name={user.name ?? ""} sub={CAMPUS_NAME} />}>{children}</DashboardShell>;
}
