import Link from "next/link";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Log in | Campusly" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[28px] font-bold leading-tight">Welcome back</h1>
        <p className="mt-1.5 text-muted">Log in to buy, book, sell or deliver.</p>
      </div>
      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-danger">Wrong email or password.</p> : null}
      <LoginForm next={next} />
      <p className="text-center text-[13px] text-muted">New here? <Link href="/register" className="font-semibold">Create an account</Link></p>
    </div>
  );
}
