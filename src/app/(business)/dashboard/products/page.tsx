import Link from "next/link";
import { PageHeader } from "@/components/layout/Sidebar";
import { Badge, Button, ButtonLink, Card, EmptyState, Icon } from "@/components/ui";
import { Table, Td } from "@/components/features/Stat";
import { Thumb } from "@/components/features/Cards";
import { PRODUCT_CATEGORIES } from "@/config/categories";
import { naira } from "@/lib/utils";
import { requireBusiness } from "../../business";
import { listProducts } from "@/server/services/listings";
import { deleteProductAction, saveProductAction } from "../../actions";
import { ListingForm } from "../ListingForm";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ new?: string; edit?: string; welcome?: string }> }) {
  const { business } = await requireBusiness();
  const sp = await searchParams;
  const products = await listProducts(business.id);
  const editing = sp.edit ? products.find((p) => p.id === sp.edit) : undefined;
  const showForm = !!sp.new || !!editing;
  return (
    <>
      <PageHeader title="Products" sub={sp.welcome ? "Your business is live! Add your first product so students can find you." : `${products.length} listed · shown on /b/${business.slug}`} actions={!showForm ? <ButtonLink href="/dashboard/products?new=1"><Icon name="plus" size={18} />Add product</ButtonLink> : undefined} />
      {showForm ? <ListingForm kind="product" item={editing} categories={PRODUCT_CATEGORIES} action={saveProductAction} /> : null}
      {!products.length && !showForm ? <EmptyState icon={<Icon name="box" size={32} />} title="No products yet" description="Add your first product. A name, a price and a photo is enough." action={<ButtonLink href="/dashboard/products?new=1" size="sm">Add a product</ButtonLink>} /> : null}
      {products.length ? <Card><Table head={["Product", "Category", "Price", "Stock", ""]}>{products.map((p) => (
        <tr key={p.id}>
          <Td><div className="flex items-center gap-3"><Thumb src={p.images[0]} alt="" seed={p.id} className="size-10 rounded-[8px]" /><span className="font-semibold">{p.name}</span></div></Td>
          <Td className="text-muted">{p.category}</Td><Td>{naira(p.price)}</Td>
          <Td>{p.inStock ? <Badge tone="success">In stock</Badge> : <Badge tone="neutral">Hidden</Badge>}</Td>
          <Td><div className="flex justify-end gap-2"><Link href={`/dashboard/products?edit=${p.id}`} className="text-sm font-semibold text-primary">Edit</Link><form action={deleteProductAction}><input type="hidden" name="id" value={p.id} /><Button type="submit" variant="ghost" size="sm" aria-label="Delete"><Icon name="trash" size={16} /></Button></form></div></Td>
        </tr>
      ))}</Table></Card> : null}
    </>
  );
}
