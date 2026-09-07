import { ArrowLeft } from "lucide-react";
import { Link } from "@/src/i18n/navigation";
import { getInstructor } from "@/lib/api/users";
import { AdminUserDetail } from "../../_components/AdminUserDetail";

export default async function AdminInstructorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getInstructor(id);
  return <div className="p-6 lg:p-9"><Link href="/admin/instructors" className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-slate-500"><ArrowLeft size={16} /> Back to instructors</Link><h1 className="mb-6 text-3xl font-black text-[#162535]">Instructor details</h1><AdminUserDetail kind="instructor" user={user} /></div>;
}
