import { redirect } from "next/navigation";
import { DashboardShell, Sidebar, type NavItem } from "@/components/layout/Sidebar";
import { requireUser } from "@/lib/auth/session";
import { getBusinessByOwner } from "@/server/services/businesses";

const items: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: "home" },
  { href: "/dashboard/products", label: "Products", icon: "box" },
  { href: "/dashboard/services", label: "Services", icon: "scissors" },
  { href: "/dashboard/orders", label: "Orders", icon: "cart" },
  { href: "/dashboard/bookings", label: "Bookings", icon: "calendar" },
  { href: "/dashboard/earnings", label: "Earnings", icon: "wallet" },
  { href: "/dashboard/settings", label: "Settings", icon: "settings" },
];

export default async function BusinessLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const biz = await getBusinessByOwner(user.id);
  if (!biz) redirect("/sell");
  const nav = biz.type === "products" ? items.filter((i) => i.label !== "Services" && i.label !== "Bookings") : biz.type === "services" ? items.filter((i) => i.label !== "Products" && i.label !== "Orders") : items;
  return <DashboardShell sidebar={<Sidebar role="Business" items={nav} name={biz.name} sub={biz.location || biz.category} />}>{children}</DashboardShell>;
}
