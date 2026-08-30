import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { getCart } from "@/server/services/cart";
import { Button, ButtonLink, Card, EmptyState, Icon } from "@/components/ui";
import { Thumb } from "@/components/features/Cards";
import { naira } from "@/lib/utils";
import { FEES } from "@/config/fees";
import { setQtyAction } from "../actions";

export default async function CartPage({ searchParams }: { searchParams: Promise<{ replaced?: string }> }) {
  const u = await requireUser();
  const { replaced } = await searchParams;
  const cart = await getCart(u.id);
  if (!cart.items.length) return <EmptyState icon={<Icon name="cart" size={32} />} title="Your cart is empty" description="Find something on Discover." action={<ButtonLink href="/discover" size="sm">Browse products</ButtonLink>} />;
  return (
    <div className="mx-auto flex max-w-[900px] flex-col gap-5">
      <h1 className="text-[28px] font-bold">Your cart · {cart.businessName}</h1>
      {replaced ? <p className="rounded-md bg-amber-50 px-4 py-2.5 text-sm text-amber-800">Your cart was replaced. One seller per checkout.</p> : null}
      <Card className="p-6">
        {cart.items.map((i) => (
          <div key={i.productId} className="flex items-center gap-4 border-b border-border py-3 last:border-0">
            <Thumb src={i.image} alt={i.name} seed={i.productId} className="size-16 rounded-md" />
            <div className="flex-1"><div className="font-semibold">{i.name}</div><div className="text-[13px] text-muted">{naira(i.unitPrice)} each{!i.inStock ? " · out of stock" : ""}</div></div>
            <form action={setQtyAction} className="flex items-center gap-2">
              <input type="hidden" name="productId" value={i.productId} />
              <select name="qty" defaultValue={i.qty} className="h-9 rounded-[10px] border border-border bg-surface px-2 text-sm font-semibold">{[1, 2, 3, 4, 5, 6, 8, 10].map((n) => <option key={n} value={n}>{n}</option>)}</select>
              <Button type="submit" variant="outline" size="sm">Update</Button>
              <Button type="submit" name="qty" value="0" variant="ghost" size="sm" aria-label="Remove"><Icon name="trash" size={16} /></Button>
            </form>
            <span className="w-24 text-right font-bold">{naira(i.unitPrice * i.qty)}</span>
          </div>
        ))}
        <div className="mt-4 flex flex-wrap items-center justify-end gap-6">
          <span className="text-[13px] text-muted">Subtotal <b className="text-ink">{naira(cart.subtotal)}</b> · Delivery from <b className="text-ink">{naira(FEES.deliveryFee)}</b></span>
          <ButtonLink href="/checkout" size="lg">Checkout</ButtonLink>
        </div>
      </Card>
      <Link href="/discover" className="text-sm font-semibold text-primary">← Keep shopping</Link>
    </div>
  );
}
