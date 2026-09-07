import { getAllOrders } from "@/lib/api/orders";
import { getAllRequests } from "@/lib/api/requests";
import { AdminOrdersManager } from "../_components/AdminOrdersManager";

export default async function AdminOrdersPage() {
  const [requests, orders] = await Promise.all([getAllRequests(), getAllOrders()]);
  return <AdminOrdersManager requests={requests} orders={orders} />;
}
