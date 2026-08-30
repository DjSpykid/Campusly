import { PageHeader } from "@/components/layout/Sidebar";
import { requireBusiness } from "../../business";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage() {
  const { business } = await requireBusiness();
  return (
    <>
      <PageHeader title="Settings" sub="Your public profile and opening hours." />
      <SettingsForm business={business} />
    </>
  );
}
