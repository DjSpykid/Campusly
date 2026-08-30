"use client";

import { useActionState, useState } from "react";
import { Button, Star } from "@/components/ui";
import { Input } from "@/components/ui";
import { reviewAction, type ReviewState } from "./actions";

export function ReviewForm({ refType, refId }: { refType: "order" | "booking"; refId: string }) {
  const [state, action, pending] = useActionState<ReviewState, FormData>(reviewAction, {});
  const [rating, setRating] = useState(5);
  if (state.done) return <p className="text-sm font-semibold text-green-700">Thanks for your review!</p>;
  return (
    <form action={action} className="flex flex-wrap items-center gap-3">
      <input type="hidden" name="refType" value={refType} /><input type="hidden" name="refId" value={refId} /><input type="hidden" name="rating" value={rating} />
      <div className="flex gap-1">{[1, 2, 3, 4, 5].map((n) => <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} stars`}><Star size={22} filled={n <= rating} /></button>)}</div>
      <Input name="text" placeholder="How was it?" className="h-9 max-w-xs" />
      <Button type="submit" size="sm" disabled={pending}>Submit review</Button>
      {state.error ? <span className="text-xs text-danger">{state.error}</span> : null}
    </form>
  );
}
