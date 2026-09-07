import { redirect } from "next/navigation";

export default async function PricingDetailRedirect({ params }: { params: Promise<{ locale: string; id: string }> }) {
  await params;
  redirect("/admin/pricing");
}
