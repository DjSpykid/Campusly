import Link from "next/link";
import { PageHeader } from "@/components/layout/Sidebar";
import { Button, Card, StatusBadge } from "@/components/ui";
import { Table, Td } from "@/components/features/Stat";
import { requireUser } from "@/lib/auth/session";
import { adminBusinesses } from "@/server/services/admin";
import { businessStatusAction } from "../../actions";

export default async function AdminBusinessesPage() {
  await requireUser("admin");
  const list = await adminBusinesses();
  return (
    <>
      <PageHeader title="Businesses" sub={`${list.length} registered`} />
      <Card><Table head={["Business", "Owner", "Type", "Orders", "Rating", "Status", ""]}>{list.map((b) => (
        <tr key={b.id}><Td><Link href={`/b/${b.slug}`} className="font-semibold text-ink">{b.name}</Link></Td><Td>{b.ownerName}</Td><Td className="text-muted">{b.type}</Td><Td>{b.orders}</Td><Td>{b.ratingCount ? b.ratingAvg : "-"}</Td><Td><StatusBadge status={b.status} /></Td>
          <Td><form action={businessStatusAction}><input type="hidden" name="id" value={b.id} /><input type="hidden" name="status" value={b.status === "active" ? "suspended" : "active"} /><Button type="submit" size="sm" variant={b.status === "active" ? "outline" : "secondary"}>{b.status === "active" ? "Suspend" : "Reactivate"}</Button></form></Td></tr>
      ))}</Table></Card>
    </>
  );
}
