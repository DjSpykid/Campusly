import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getBusinessByOwner } from "@/server/services/businesses";
import { Card } from "@/components/ui";
import { SellForm } from "./SellForm";

export const metadata = { title: "Start selling | Campusly" };

export default async function SellPage() {
  const session = await auth();
  if (session?.user && (await getBusinessByOwner(session.user.id))) redirect("/dashboard");
  return (
    <main className="mx-auto grid max-w-[1240px] gap-10 px-6 py-10 lg:grid-cols-[1fr_400px] lg:px-12">
      <div className="flex flex-col gap-6">
        <div>
          <span className="rounded-pill bg-primary-light px-2.5 py-1 text-xs font-semibold text-primary">Free forever</span>
          <h1 className="mt-3 text-[32px] font-bold">Set up your business</h1>
          <p className="mt-1.5 text-muted">Takes about two minutes. You can edit everything later.</p>
        </div>
        <SellForm loggedIn={!!session?.user} />
      </div>
      <div className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
        <Card className="flex flex-col gap-3 bg-ink p-6 text-white">
          <h3 className="font-bold">What it costs</h3>
          {[["Joining", "Free"], ["Product sales", "5% per paid order"], ["Bookings", "8% per booking"], ["Delivery", "Paid by the buyer"]].map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm"><span className="text-[#b8b3cc]">{k}</span><b>{v}</b></div>
          ))}
        </Card>
        <Card className="p-6 text-sm text-muted">Once your business is live, students find you on Discover, order or book in-app, and pay through Paystack. You get paid after each delivery or completed booking.</Card>
      </div>
    </main>
  );
}
