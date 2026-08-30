"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button, Field, Input } from "@/components/ui";
import { becomeRunnerAction } from "../actions";
import type { FormState } from "@/app/(auth)/actions";

export function RunnerForm({ loggedIn }: { loggedIn: boolean }) {
  const [state, action, pending] = useActionState<FormState, FormData>(becomeRunnerAction, {});
  const f = state.fields ?? {};
  if (!loggedIn) return <p className="text-muted">You need an account first. <Link href="/register?next=/deliver" className="font-semibold text-primary">Create account</Link> or <Link href="/login?next=/deliver" className="font-semibold text-primary">log in</Link>.</p>;
  return (
    <form action={action} className="flex flex-col gap-4">
      <Field label="Phone" error={f.phone} htmlFor="phone"><Input id="phone" name="phone" type="tel" required /></Field>
      <Field label="Where do you stay?" error={f.location} htmlFor="location"><Input id="location" name="location" placeholder="e.g. Hall 1, Room 22" required /></Field>
      <label className="flex items-start gap-3 text-[13px] text-muted"><input type="checkbox" required className="mt-0.5 accent-primary" />I&apos;ll deliver orders carefully and on time.</label>
      {state.error ? <p className="text-sm text-danger">{state.error}</p> : null}
      <Button type="submit" variant="accent" size="lg" loadingText="Signing up…" disabled={pending}>Start delivering</Button>
    </form>
  );
}
