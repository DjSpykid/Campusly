"use client";

import { useActionState } from "react";
import { Button, Card, Field, Input, Textarea } from "@/components/ui";
import type { BusinessDTO } from "@/types";
import { ImagesField } from "@/components/features/ImagesField";
import type { FormState } from "@/app/(auth)/actions";
import { saveSettingsAction } from "../../actions";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function SettingsForm({ business: b }: { business: BusinessDTO }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveSettingsAction, {});
  const f = state.fields ?? {};
  return (
    <form action={action} className="grid items-start gap-5 lg:grid-cols-[1.4fr_1fr]">
      <Card className="flex flex-col gap-4 p-6">
        <h3 className="font-bold">Profile</h3>
        <Field label="Business name" error={f.name} htmlFor="name"><Input id="name" name="name" defaultValue={b.name} required /></Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Category" error={f.category} htmlFor="category"><Input id="category" name="category" defaultValue={b.category} required /></Field>
          <Field label="Location" error={f.location} htmlFor="location"><Input id="location" name="location" defaultValue={b.location} required /></Field>
        </div>
        <Field label="Description" error={f.description} htmlFor="description"><Textarea id="description" name="description" defaultValue={b.description} /></Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="WhatsApp number" error={f.phone} htmlFor="phone"><Input id="phone" name="phone" defaultValue={b.contact.phone} required /></Field>
          <Field label="Instagram" error={f.instagram} htmlFor="instagram"><Input id="instagram" name="instagram" defaultValue={b.contact.instagram} /></Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2"><ImagesField name="logo" max={1} label="Logo" hint="Square works best" initial={b.logoUrl ? [b.logoUrl] : []} /><ImagesField name="cover" max={1} label="Cover photo" hint="Wide photo for the top of your page" initial={b.coverUrl ? [b.coverUrl] : []} /></div>
        {state.error ? <p className="text-sm text-danger">{state.error}</p> : null}
        {f.saved ? <p className="text-sm font-semibold text-green-700">Saved.</p> : null}
        <Button type="submit" loadingText="Saving…" disabled={pending} className="self-start">Save changes</Button>
      </Card>
      <Card className="flex flex-col gap-3 p-6">
        <h3 className="font-bold">Opening hours</h3>
        <p className="text-[13px] text-muted">Students can only book service slots inside these hours.</p>
        {DAYS.map((name, d) => {
          const h = b.availability.find((x) => x.day === d);
          return (
            <div key={d} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name={`open-${d}`} defaultChecked={!!h} className="size-4 accent-primary" />
              <span className="w-20 font-semibold">{name.slice(0, 3)}</span>
              <Input name={`start-${d}`} type="time" defaultValue={h?.start ?? "09:00"} className="h-9 flex-1" />
              <span className="text-muted">to</span>
              <Input name={`end-${d}`} type="time" defaultValue={h?.end ?? "17:00"} className="h-9 flex-1" />
            </div>
          );
        })}
      </Card>
    </form>
  );
}
