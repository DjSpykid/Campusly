"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui";
import { registerAction, type FormState } from "../actions";
import { IconInput } from "../AuthFields";
import { CAMPUS_NAME } from "@/config/site";

export function RegisterForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(registerAction, {});
  const f = state.fields ?? {};
  return (
    <form action={action} className="stagger flex flex-col gap-4">
      <IconInput icon="user" label="Full name" name="name" autoComplete="name" placeholder="Aisha Bello" error={f.name} required />
      <IconInput icon="mail" label="Student email" name="email" type="email" autoComplete="email" placeholder="you@student.edu.ng" error={f.email} required />
      <div className="grid gap-4 sm:grid-cols-2">
        <IconInput icon="phone" label="Phone" name="phone" type="tel" autoComplete="tel" placeholder="0803 000 0000" error={f.phone} required />
        <IconInput icon="school" label="Campus" name="campus" defaultValue={CAMPUS_NAME === "your campus" ? "" : CAMPUS_NAME} placeholder="Your university" error={f.campus} required />
      </div>
      <IconInput icon="lock" label="Password" name="password" type="password" autoComplete="new-password" placeholder="At least 8 characters" error={f.password} required minLength={8} />
      {state.error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-danger">{state.error}</p> : null}
      <Button type="submit" size="lg" loadingText="Creating your account…" disabled={pending} className="mt-1">Create account</Button>
      <p className="text-center text-xs text-muted">By joining you agree to the community rules: real listings, real reviews, no scams.</p>
    </form>
  );
}
