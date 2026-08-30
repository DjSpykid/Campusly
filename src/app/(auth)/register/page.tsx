import Link from "next/link";
import { RegisterForm } from "./RegisterForm";

export const metadata = { title: "Create your account | Campusly" };

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="rounded-pill bg-primary-light px-2.5 py-1 text-xs font-semibold text-primary">Free forever</span>
        <h1 className="mt-3 text-[28px] font-bold leading-tight">Create your account</h1>
        <p className="mt-1.5 text-muted">Buy, book, sell and earn with one login.</p>
      </div>
      <RegisterForm />
      <p className="text-center text-[13px] text-muted">Already on Campusly? <Link href="/login" className="font-semibold">Log in</Link></p>
    </div>
  );
}
