"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Button, Card, Field, Input } from "@/components/ui";
import { naira } from "@/lib/utils";
import { bookAction, type BookState } from "../../actions";

type Slot = { time: string; startAt: string; available: boolean };

export function BookingForm({ serviceId, price, durationMins, slots, selected, days }: { serviceId: string; price: number; durationMins: number; slots: Slot[]; selected: string; days: { iso: string; label: string; num: number }[] }) {
  const [state, action, pending] = useActionState<BookState, FormData>(bookAction, {});
  const [pick, setPick] = useState<Slot | null>(null);
  const end = pick ? new Date(new Date(pick.startAt).getTime() + durationMins * 60000) : null;
  const hhmm = (d: Date) => d.toTimeString().slice(0, 5);
  return (
    <form action={action}>
      <Card className="flex flex-col gap-4 p-6">
        <h3 className="text-lg font-bold">Book an appointment</h3>
        <input type="hidden" name="serviceId" value={serviceId} />
        <div>
          <span className="mb-1.5 block text-[13px] font-semibold">Pick a day</span>
          <div className="grid grid-cols-7 gap-1.5">
            {days.map((d) => <Link key={d.iso} href={`?date=${d.iso}`} scroll={false} className={`flex h-[60px] flex-col items-center justify-center rounded-md border text-xs ${d.iso === selected ? "border-primary bg-primary text-white" : "border-border bg-surface"}`}><span className="opacity-80">{d.label}</span><span className="text-sm font-bold">{d.num}</span></Link>)}
          </div>
        </div>
        <div>
          <span className="mb-1.5 block text-[13px] font-semibold">Available times</span>
          {slots.length ? (
            <div className="grid grid-cols-3 gap-2">
              {slots.map((s) => (
                <button key={s.startAt} type="button" disabled={!s.available} onClick={() => setPick(s)} className={`h-11 rounded-[10px] border text-sm font-semibold ${pick?.startAt === s.startAt ? "border-primary bg-primary-light text-primary" : s.available ? "border-border bg-surface" : "border-border bg-[#f1f0f6] text-[#b5b1c4] line-through"}`}>{s.time}</button>
              ))}
            </div>
          ) : <p className="text-sm text-muted">Not available on this day. Try another.</p>}
        </div>
        <input type="hidden" name="startAt" value={pick?.startAt ?? ""} />
        <Field label="Note (optional)" htmlFor="note"><Input id="note" name="note" placeholder="Anything they should know" /></Field>
        <div className="border-t border-border" />
        <div className="flex justify-between text-sm"><span className="text-muted">{pick && end ? `${pick.time} – ${hhmm(end)}` : "Pick a slot"}</span><span>{naira(price)}</span></div>
        {state.error ? <p className="text-sm text-danger">{state.error}</p> : null}
        <Button type="submit" size="lg" loadingText="Redirecting to payment…" disabled={!pick || pending}>Confirm &amp; pay {naira(price)}</Button>
      </Card>
    </form>
  );
}
