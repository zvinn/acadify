import { redirect } from "next/navigation";

export default async function TrialBookRedirect({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  redirect("/trials");
}
