import { getInstructors } from "@/lib/api/users";
import { AdminUserManager } from "../_components/AdminUserManager";

export default async function AdminInstructorsPage() {
  return <AdminUserManager kind="instructor" users={await getInstructors()} />;
}
