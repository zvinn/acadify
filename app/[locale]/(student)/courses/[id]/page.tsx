import { ArrowLeft, BookOpen, CalendarDays, FileText } from "lucide-react";

import { Link } from "@/src/i18n/navigation";
import { getOrder } from "@/lib/api/orders";
import { recordOf, textOf } from "@/lib/api/response";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);
  const offer = recordOf(order.offer);
  const request = recordOf(order.request || offer.request);
  const title = textOf(request.title, textOf(request.description, "Explanation order"));
  const type = textOf(order.type, textOf(request.type, "explanation"));

  return (
    <div className="min-h-screen bg-[#F6F7F8] px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <Link href="/courses" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-500">
          <ArrowLeft size={16} /> Back to courses
        </Link>
        <section className="rounded-[32px] bg-[#162535] p-8 text-white shadow-lg md:p-10">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold capitalize text-[#5CC0D6]">{type}</span>
          <h1 className="mt-5 text-3xl font-black">{title}</h1>
          <p className="mt-3 text-sm text-white/50">Order #{id}</p>
        </section>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {[
            { label: "Status", value: order.status ?? "active", icon: BookOpen },
            { label: "Created", value: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Recent", icon: CalendarDays },
            { label: "Files", value: String((order.documents?.length ?? 0) + (order.videos?.length ?? 0)), icon: FileText },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <Icon className="text-[#5CC0D6]" size={22} />
              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
              <p className="mt-1 text-lg font-black capitalize text-[#162535]">{value}</p>
            </div>
          ))}
        </div>
        <section className="mt-7 rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-100">
          <h2 className="text-xl font-black text-[#162535]">Request details</h2>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">{textOf(request.description, "No description was provided.")}</p>
        </section>
      </div>
    </div>
  );
}
