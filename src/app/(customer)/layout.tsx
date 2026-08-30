import { TopNav } from "@/components/layout/TopNav";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      <div className="mx-auto max-w-[1440px] px-6 py-8 lg:px-12">{children}</div>
    </>
  );
}
