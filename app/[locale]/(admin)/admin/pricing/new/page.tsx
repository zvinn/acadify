import { redirect } from "next/navigation";

export default async function NewPricingRedirect({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  redirect("/admin/pricing");
}
