"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button, Card, Field, Input, Select, Textarea } from "@/components/ui";
import { ImagesField } from "@/components/features/ImagesField";
import type { FormState } from "@/app/(auth)/actions";
import type { ProductDTO, ServiceDTO } from "@/types";

type Props = { kind: "product"; item?: ProductDTO; categories: readonly string[]; action: (s: FormState, f: FormData) => Promise<FormState> } | { kind: "service"; item?: ServiceDTO; categories: readonly string[]; action: (s: FormState, f: FormData) => Promise<FormState> };

export function ListingForm(props: Props) {
  const [state, action, pending] = useActionState<FormState, FormData>(props.action, {});
  const f = state.fields ?? {};
  const item = props.item;
  const isService = props.kind === "service";
  return (
    <form action={action}>
      <Card className="flex flex-col gap-4 p-6">
        <h3 className="font-bold">{item ? "Edit" : "Add a"} {props.kind}</h3>
        {item ? <input type="hidden" name="id" value={item.id} /> : null}
        <Field label={isService ? "Service name" : "Product name"} error={f.name} htmlFor="name"><Input id="name" name="name" defaultValue={item?.name} required /></Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Category" error={f.category} htmlFor="category"><Select id="category" name="category" defaultValue={item?.category ?? props.categories[0]}>{props.categories.map((c) => <option key={c} value={c}>{c}</option>)}</Select></Field>
          <Field label="Price (₦)" error={f.price} htmlFor="price"><Input id="price" name="price" type="number" min={50} step={50} defaultValue={item?.price} required /></Field>
        </div>
        {isService ? <Field label="Duration (minutes)" error={f.durationMins} htmlFor="durationMins"><Input id="durationMins" name="durationMins" type="number" min={15} step={15} defaultValue={(item as ServiceDTO | undefined)?.durationMins ?? 60} required /></Field> : null}
        <Field label="Description" error={f.description} htmlFor="description"><Textarea id="description" name="description" defaultValue={item?.description} placeholder={isService ? "What's included, where it happens, what to bring." : "What it is, sizes, how fast you deliver."} /></Field>
        <ImagesField initial={item?.images ?? []} />
        {f.images ? <p className="text-xs text-danger">{f.images}</p> : null}
        <label className="flex items-center gap-3 text-sm"><input type="checkbox" name={isService ? "active" : "inStock"} defaultChecked={item ? (isService ? (item as ServiceDTO).active : (item as ProductDTO).inStock) : true} className="size-4 accent-primary" />{isService ? "Bookable" : "In stock"}</label>
        {state.error ? <p className="text-sm text-danger">{state.error}</p> : null}
        <div className="flex gap-3"><Button type="submit" loadingText="Saving…" disabled={pending}>{item ? "Save changes" : `Publish ${props.kind}`}</Button><Link href={`/dashboard/${props.kind}s`} className="inline-flex h-11 items-center px-3 text-sm font-semibold text-muted">Cancel</Link></div>
      </Card>
    </form>
  );
}
