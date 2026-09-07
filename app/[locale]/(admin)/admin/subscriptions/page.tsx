import { getSubscriptions } from "@/lib/api/subscriptions";
import { AdminSubscriptionsManager } from "../_components/AdminSubscriptionsManager";

export default async function AdminSubscriptionsPage() {
  return <AdminSubscriptionsManager subscriptions={await getSubscriptions()} />;
}
