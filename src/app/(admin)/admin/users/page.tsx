import { PageHeader } from "@/components/layout/Sidebar";
import { Avatar, Badge, Card } from "@/components/ui";
import { Table, Td, fmtDay } from "@/components/features/Stat";
import { requireUser } from "@/lib/auth/session";
import { adminUsers } from "@/server/services/admin";

export default async function AdminUsersPage() {
  await requireUser("admin");
  const users = await adminUsers();
  return (
    <>
      <PageHeader title="Users" sub={`${users.length} accounts`} />
      <Card><Table head={["User", "Email", "Campus", "Roles", "Joined"]}>{users.map((u) => <tr key={u.id}><Td><div className="flex items-center gap-2.5"><Avatar name={u.name} className="size-8 text-[11px]" /><span className="font-semibold">{u.name}</span></div></Td><Td className="text-muted">{u.email}</Td><Td>{u.campus}</Td><Td><div className="flex flex-wrap gap-1">{u.roles.map((r) => <Badge key={r} tone={r === "admin" ? "danger" : "neutral"}>{r}</Badge>)}</div></Td><Td className="text-muted">{fmtDay(u.createdAt)}</Td></tr>)}</Table></Card>
    </>
  );
}
