"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Button, Card, Field, Icon, Input, Select, Textarea, type IconName } from "@/components/ui";
import { PRODUCT_CATEGORIES, SERVICE_CATEGORIES } from "@/config/categories";
import { ImagesField } from "@/components/features/ImagesField";
import { createBusinessAction } from "../actions";
import type { FormState } from "@/app/(auth)/actions";

const types: { v: "products" | "services" | "both"; t: string; d: string; icon: IconName }[] = [
  { v: "products", t: "Products", d: "Food, fashion, tech, gifts…", icon: "box" },
  { v: "services", t: "Services", d: "Hair, nails, tutoring, repairs…", icon: "scissors" },
  { v: "both", t: "Both", d: "A storefront and bookings", icon: "store" },
];

export function SellForm({ loggedIn }: { loggedIn: boolean }) {
  const [state, action, pending] = useActionState<FormState, FormData>(createBusinessAction, {});
  const [type, setType] = useState<"products" | "services" | "both">("both");
  const f = state.fields ?? {};
  const cats = type === "products" ? PRODUCT_CATEGORIES : type === "services" ? SERVICE_CATEGORIES : [...PRODUCT_CATEGORIES, ...SERVICE_CATEGORIES];
  if (!loggedIn) {
    return <Card className="p-6"><p className="text-muted">You need an account first.</p><div className="mt-4 flex gap-3"><Link href="/register?next=/sell" className="font-semibold text-primary">Create account</Link><Link href="/login?next=/sell" className="font-semibold text-primary">Log in</Link></div></Card>;
  }
  return (
    <form action={action}>
      <Card className="flex flex-col gap-5 p-6">
        <div>
          <span className="mb-1.5 block text-[13px] font-semibold">What do you offer?</span>
          <div className="grid gap-3 sm:grid-cols-3">
            {types.map((t) => (
              <label key={t.v} className={`flex cursor-pointer flex-col gap-2 rounded-lg border p-4 ${type === t.v ? "border-primary bg-primary-light" : "border-border"}`}>
                <input type="radio" name="type" value={t.v} checked={type === t.v} onChange={() => setType(t.v)} className="sr-only" />
                <Icon name={t.icon} size={22} className={type === t.v ? "text-primary" : "text-muted"} />
                <span className="font-semibold">{t.t}</span><span className="text-xs text-muted">{t.d}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Business name" error={f.name} htmlFor="name"><Input id="name" name="name" placeholder="e.g. Toke's Bakes" required /></Field>
          <Field label="Main category" error={f.category} htmlFor="category"><Select id="category" name="category" defaultValue="">{<option value="" disabled>Choose…</option>}{cats.map((c) => <option key={c} value={c}>{c}</option>)}</Select></Field>
        </div>
        <Field label="Where are you based?" error={f.location} htmlFor="location"><Input id="location" name="location" placeholder="e.g. Hall 3, Room 118" required /></Field>
        <Field label="Describe your business" error={f.description} htmlFor="description"><Textarea id="description" name="description" placeholder="Tell students what you make, how fast you deliver, and what makes you different." /></Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="WhatsApp number" error={f.phone} htmlFor="phone"><Input id="phone" name="phone" type="tel" required /></Field>
          <Field label="Instagram (optional)" error={f.instagram} htmlFor="instagram"><Input id="instagram" name="instagram" placeholder="@handle" /></Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2"><ImagesField name="logo" max={1} label="Logo (optional)" hint="Square works best" /><ImagesField name="cover" max={1} label="Cover photo (optional)" hint="Wide photo for the top of your page" /></div>
        {state.error ? <p className="text-sm text-danger">{state.error}</p> : null}
        <div className="flex items-center justify-between gap-4">
          <span className="text-[13px] text-muted">Next: add your first product or service</span>
          <Button type="submit" size="lg" loadingText="Creating…" disabled={pending}>Create my business</Button>
        </div>
      </Card>
    </form>
  );
}
