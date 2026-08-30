import { ButtonLink, LogoMark } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 px-6 text-center">
      <LogoMark size={56} className="animate-float" />
      <h1 className="text-[32px] font-bold">That page isn&apos;t on campus</h1>
      <p className="max-w-sm text-muted">The link may be old, or the business may have taken a break. Try Discover.</p>
      <ButtonLink href="/discover" size="lg">Go to Discover</ButtonLink>
    </main>
  );
}
