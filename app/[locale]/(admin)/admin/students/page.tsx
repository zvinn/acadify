import { getStudents } from "@/lib/api/users";
import { AdminUserManager } from "../_components/AdminUserManager";

export default async function AdminStudentsPage() {
  return <AdminUserManager kind="student" users={await getStudents()} />;
}
