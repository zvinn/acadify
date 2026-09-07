import { notFound } from "next/navigation";

import { getMyOrders } from "@/lib/api/orders";
import { idOf } from "@/lib/api/response";
import { ProjectDetail } from "../../../_components/ProjectDetail";

export default async function LiveProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = (await getMyOrders()).find((item) => idOf(item) === id);
  if (!order) notFound();
  return <ProjectDetail order={order} kind="live" backHref="/instructor/projects/explain?mode=live" />;
}
