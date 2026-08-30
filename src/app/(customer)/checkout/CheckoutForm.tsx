"use client";

import { useActionState, useState } from "react";
import { Button, Card, Field, Icon, Input } from "@/components/ui";
import { naira } from "@/lib/utils";
import { FEES } from "@/config/fees";
import type { CartDTO } from "@/types";
import { checkoutAction, type CheckoutState } from "../actions";

export function CheckoutForm({ cart }: { cart: CartDTO }) {
  const [state, action, pending] = useActionState<CheckoutState, FormData>(checkoutAction, {});
  const [fulfilment, setFulfilment] = useState<"delivery" | "pickup">("delivery");
  const fee = fulfilment === "delivery" ? FEES.deliveryFee : 0;
  const total = cart.subtotal + fee;
  const opt = (v: "delivery" | "pickup", t: string, d: string) => (
    <label className={`flex cursor-pointer gap-3 rounded-lg border p-4 ${fulfilment === v ? "border-primary bg-primary-light" : "border-border"}`}>
      <input type="radio" name="fulfilment" value={v} checked={fulfilment === v} onChange={() => setFulfilment(v)} className="sr-only" />
      <div className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-pill border-2 ${fulfilment === v ? "border-primary bg-primary" : "border-border bg-surface"}`}>{fulfilment === v ? <Icon name="check" size={12} className="text-white" /> : null}</div>
      <div><div className="font-semibold">{t}</div><div className="text-[13px] text-muted">{d}</div></div>
    </label>
  );
  return (
    <form action={action} className="grid items-start gap-8 lg:grid-cols-[1.4fr_1fr]">
      <div className="flex flex-col gap-5">
        <h1 className="text-[28px] font-bold">Checkout</h1>
        <Card className="flex flex-col gap-4 p-6">
          <h3 className="font-bold">1 · Delivery</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {opt("delivery", "Campus delivery", `A runner brings it to you · ${naira(FEES.deliveryFee)} · 30–45 min`)}
            {opt("pickup", "Pick up myself", "Collect from the seller · Free")}
          </div>
          {fulfilment === "delivery" ? <Field label="Hall / room / landmark" htmlFor="address"><Input id="address" name="address" placeholder="e.g. Hall 3, Room 214, 2nd floor" required /></Field> : null}
          <Field label="Note for the seller (optional)" htmlFor="note"><Input id="note" name="note" placeholder="e.g. Please call when you arrive" /></Field>
        </Card>
        <Card className="flex flex-col gap-3 p-6">
          <h3 className="font-bold">2 · Payment</h3>
          <div className="flex items-center gap-3 rounded-lg border border-primary bg-primary-light p-4"><div className="flex size-5 items-center justify-center rounded-pill bg-primary"><Icon name="check" size={12} className="text-white" /></div><div className="flex-1"><div className="font-semibold">Pay with Paystack</div><div className="text-[13px] text-muted">Card, bank transfer or USSD · secured</div></div><span className="rounded-pill bg-[#f1f0f6] px-2.5 py-1 text-xs font-semibold text-muted">Test mode</span></div>
          <p className="flex items-center gap-1.5 text-xs text-muted"><Icon name="shield" size={14} />Money is held by Campusly and released to the seller after delivery.</p>
        </Card>
      </div>
      <Card className="flex flex-col gap-3.5 p-6 lg:sticky lg:top-24">
        <div className="font-semibold">{cart.businessName}</div>
        {cart.items.map((i) => <div key={i.productId} className="flex justify-between text-sm"><span className="text-muted">{i.name} × {i.qty}</span><span>{naira(i.unitPrice * i.qty)}</span></div>)}
        <div className="border-t border-border" />
        <div className="flex justify-between text-sm"><span className="text-muted">Subtotal</span><span>{naira(cart.subtotal)}</span></div>
        <div className="flex justify-between text-sm"><span className="text-muted">Delivery</span><span>{naira(fee)}</span></div>
        <div className="flex justify-between text-lg font-bold"><span>Total</span><span>{naira(total)}</span></div>
        {state.error ? <p className="text-sm text-danger">{state.error}</p> : null}
        <Button type="submit" size="lg" loadingText="Redirecting to Paystack…" disabled={pending}>Pay {naira(total)}</Button>
        <p className="text-center text-xs text-muted">By paying you agree to Campusly&apos;s terms.</p>
      </Card>
    </form>
  );
}
