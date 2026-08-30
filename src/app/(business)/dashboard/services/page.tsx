import Link from "next/link";
import { PageHeader } from "@/components/layout/Sidebar";
import { Badge, Button, ButtonLink, Card, EmptyState, Icon } from "@/components/ui";
import { Table, Td } from "@/components/features/Stat";
import { SERVICE_CATEGORIES } from "@/config/categories";
import { naira } from "@/lib/utils";
import { requireBusiness } from "../../business";
import { listServices } from "@/server/services/listings";
import { deleteServiceAction, saveServiceAction } from "../../actions";
import { ListingForm } from "../ListingForm";

export default async function ServicesPage({ searchParams }: { searchParams: Promise<{ new?: string; edit?: string }> }) {
  const { business } = await requireBusiness();
  const sp = await searchParams;
  const services = await listServices(business.id);
  const editing = sp.edit ? services.find((s) => s.id === sp.edit) : undefined;
  const showForm = !!sp.new || !!editing;
  return (
    <>
      <PageHeader title="Services" sub={`${services.length} listed · bookable inside your opening hours (Settings)`} actions={!showForm ? <ButtonLink href="/dashboard/services?new=1"><Icon name="plus" size={18} />Add service</ButtonLink> : undefined} />
      {showForm ? <ListingForm kind="service" item={editing} categories={SERVICE_CATEGORIES} action={saveServiceAction} /> : null}
      {!services.length && !showForm ? <EmptyState icon={<Icon name="scissors" size={32} />} title="No services yet" description="Add a service with a price and duration so students can book real slots." action={<ButtonLink href="/dashboard/services?new=1" size="sm">Add a service</ButtonLink>} /> : null}
      {services.length ? <Card><Table head={["Service", "Category", "Price", "Duration", "Status", ""]}>{services.map((s) => (
        <tr key={s.id}>
          <Td className="font-semibold">{s.name}</Td><Td className="text-muted">{s.category}</Td><Td>{naira(s.price)}</Td><Td>{s.durationMins} min</Td>
          <Td>{s.active ? <Badge tone="success">Bookable</Badge> : <Badge tone="neutral">Paused</Badge>}</Td>
          <Td><div className="flex justify-end gap-2"><Link href={`/dashboard/services?edit=${s.id}`} className="text-sm font-semibold text-primary">Edit</Link><form action={deleteServiceAction}><input type="hidden" name="id" value={s.id} /><Button type="submit" variant="ghost" size="sm" aria-label="Delete"><Icon name="trash" size={16} /></Button></form></div></Td>
        </tr>
      ))}</Table></Card> : null}
    </>
  );
}
