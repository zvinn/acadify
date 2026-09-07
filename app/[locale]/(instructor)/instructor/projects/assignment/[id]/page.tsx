import { notFound } from "next/navigation";

import { getMyOrders } from "@/lib/api/orders";
import { idOf } from "@/lib/api/response";
import { ProjectDetail } from "../../_components/ProjectDetail";

export default async function AssignmentProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = (await getMyOrders()).find((item) => idOf(item) === id);
  if (!order) notFound();
  return <ProjectDetail order={order} kind="assignment" backHref="/instructor/projects/assignment" />;
}
