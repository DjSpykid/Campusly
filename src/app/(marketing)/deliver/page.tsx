import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Card, Icon } from "@/components/ui";
import { FEES } from "@/config/fees";
import { RunnerForm } from "./RunnerForm";

export const metadata = { title: "Become a runner | Campusly" };

export default async function DeliverPage() {
  const session = await auth();
  if (session?.user.roles.includes("runner")) redirect("/runner");
  const share = Math.round(FEES.deliveryFee * FEES.runnerShareRate);
  return (
    <main className="mx-auto grid max-w-[1240px] items-center gap-12 px-6 py-12 lg:grid-cols-2 lg:px-12">
      <div className="flex flex-col gap-5">
        <span className="self-start rounded-pill bg-accent px-3 py-1 text-xs font-semibold">Earn between lectures</span>
        <h1 className="text-[44px] font-bold leading-tight">Become a campus runner</h1>
        <p className="text-muted text-pretty">Accept deliveries when you&apos;re free, walk them across campus, get paid per drop. Runners keep <b className="text-ink">{Math.round(FEES.runnerShareRate * 100)}%</b> of every delivery fee.</p>
        <div className="flex flex-col gap-3.5">
          {[["Go online when you're free", "No shifts. Accept jobs between classes."], ["Accept what suits you", "See pick-up, drop-off and pay before you accept."], ["Paid per delivery", `₦${share} per drop. Tracked in your earnings.`]].map(([t, d]) => (
            <div key={t} className="flex gap-3"><div className="flex size-8 shrink-0 items-center justify-center rounded-pill bg-accent"><Icon name="check" size={16} /></div><div><div className="font-semibold">{t}</div><div className="text-[13px] text-muted">{d}</div></div></div>
          ))}
        </div>
      </div>
      <Card className="p-7"><h3 className="mb-4 text-lg font-bold">Sign up as a runner</h3><RunnerForm loggedIn={!!session?.user} /></Card>
    </main>
  );
}
