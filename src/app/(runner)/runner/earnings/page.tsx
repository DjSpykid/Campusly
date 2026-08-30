import { PageHeader } from "@/components/layout/Sidebar";
import { Stat } from "@/components/features/Stat";
import { naira } from "@/lib/utils";
import { requireUser } from "@/lib/auth/session";
import { runnerEarnings } from "@/server/services/deliveries";

export default async function RunnerEarningsPage() {
  const u = await requireUser("runner");
  const e = await runnerEarnings(u.id);
  return (
    <>
      <PageHeader title="Earnings" sub="Your share of every completed delivery." />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"><Stat label="Today" value={naira(e.today)} /><Stat label="This week" value={naira(e.week)} /><Stat label="All time" value={naira(e.total)} up={e.total > 0} /><Stat label="Deliveries completed" value={String(e.count)} /></div>
    </>
  );
}
