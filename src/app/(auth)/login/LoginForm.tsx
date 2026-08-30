"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui";
import { loginAction, type FormState } from "../actions";
import { IconInput } from "../AuthFields";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(loginAction, {});
  return (
    <form action={action} className="stagger flex flex-col gap-4">
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <IconInput icon="mail" label="Email" name="email" type="email" autoComplete="email" placeholder="you@student.edu.ng" required />
      <IconInput icon="lock" label="Password" name="password" type="password" autoComplete="current-password" placeholder="Your password" required />
      {state.error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-danger">{state.error}</p> : null}
      <Button type="submit" size="lg" loadingText="Logging in…" disabled={pending} className="mt-1">Log in</Button>
    </form>
  );
}
