import { AuthPanel } from "@/components/features/AuthPanel";
import { CAMPUS_NAME } from "@/config/site";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen bg-bg lg:grid-cols-2">
      <AuthPanel campus={CAMPUS_NAME} />
      <main className="flex items-start justify-center px-5 py-8 sm:items-center sm:px-10 lg:py-12">
        <div className="w-full max-w-[460px] animate-fade-up rounded-[20px] border border-border bg-surface p-6 shadow-[0_20px_60px_rgb(23_19_33/6%)] sm:p-9">{children}</div>
      </main>
    </div>
  );
}
