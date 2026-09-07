import { redirect } from "next/navigation";

export default async function TrialChooseRedirect({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  redirect("/trials");
}
