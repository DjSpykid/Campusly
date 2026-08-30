import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/server/services/listings";
import { Badge, Button, Card, Icon, Stars } from "@/components/ui";
import { BusinessAvatar } from "@/components/features/Cards";
import { Gallery } from "@/components/features/Gallery";
import { naira } from "@/lib/utils";
import { FEES } from "@/config/fees";
import { addToCartAction } from "../../actions";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getProduct(id).catch(() => null);
  if (!data) notFound();
  const { product: p, business: b } = data;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 text-[13px] text-muted"><Link href="/discover">Discover</Link><Icon name="chevron" size={12} /><Link href={`/discover?category=${encodeURIComponent(p.category)}`}>{p.category}</Link><Icon name="chevron" size={12} /><span className="text-ink">{p.name}</span></div>
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <Gallery images={p.images} alt={p.name} seed={p.id} />
        <div className="flex flex-col gap-5">
          <Link href={`/b/${b.slug}`} className="flex items-center gap-3"><BusinessAvatar b={b} /><div><div className="font-semibold text-ink">{b.name}</div><div className="flex items-center gap-1.5 text-xs text-muted"><Stars rating={b.ratingAvg} size={11} />{b.ratingCount ? `${b.ratingAvg} (${b.ratingCount})` : "New"}{b.location ? ` · ${b.location}` : ""}</div></div>{p.inStock ? <Badge tone="success" className="ml-auto">In stock</Badge> : <Badge tone="danger" className="ml-auto">Out of stock</Badge>}</Link>
          <h1 className="text-[34px] font-bold">{p.name}</h1>
          <div className="font-display text-[32px] font-extrabold">{naira(p.price)}</div>
          {p.description ? <p className="text-muted text-pretty">{p.description}</p> : null}
          <form action={addToCartAction} className="flex items-center gap-3">
            <input type="hidden" name="productId" value={p.id} />
            <select name="qty" defaultValue="1" className="h-[52px] rounded-md border border-border bg-surface px-3 font-semibold">{[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}</select>
            <Button type="submit" size="lg" className="flex-1" disabled={!p.inStock} loadingText="Adding…"><Icon name="cart" />Add to cart</Button>
          </form>
          <Card className="flex flex-col gap-2.5 px-5 py-4 text-sm">
            <div className="flex items-center gap-2.5"><Icon name="truck" size={18} className="text-primary" />Campus delivery <b>{naira(FEES.deliveryFee)}</b> or pick up free</div>
            <div className="flex items-center gap-2.5"><Icon name="shield" size={18} className="text-primary" />Pay in-app with Paystack · seller is paid after delivery</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
