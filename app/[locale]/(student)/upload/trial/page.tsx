import { redirect } from "next/navigation";

export default async function TrialUploadRedirect({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  redirect("/trials");
}
