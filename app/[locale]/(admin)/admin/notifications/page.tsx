import { getAllNotifications } from "@/lib/api/notifications";
import { AdminNotificationsManager } from "../_components/AdminNotificationsManager";

export default async function AdminNotificationsPage() {
  return <AdminNotificationsManager notifications={await getAllNotifications()} />;
}
