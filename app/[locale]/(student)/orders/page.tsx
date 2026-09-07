import { getMyRequests } from "@/lib/api/requests";

import { OrdersClient } from "./OrdersClient";

export default async function MyOrdersPage() {
  const requests = await getMyRequests();

  return <OrdersClient requests={requests} />;
}
