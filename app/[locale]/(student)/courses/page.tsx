import { ArrowRight, BookOpen, PlayCircle } from "lucide-react";

import { Link } from "@/src/i18n/navigation";
import { getMyOrders, type ApiOrder } from "@/lib/api/orders";
import { idOf, recordOf, textOf } from "@/lib/api/response";

function requestOf(order: ApiOrder) {
  const offer = recordOf(order.offer);
  return recordOf(order.request || offer.request);
}

function titleOf(order: ApiOrder) {
  const request = requestOf(order);
  return textOf(request.title, textOf(request.description, "Explanation order"));
}

export default async function CoursesPage() {
  const orders = await getMyOrders();
  const courses = orders.filter((order) => {
    const type = textOf(order.type, textOf(requestOf(order).type)).toLowerCase();
    return !type.includes("assignment");
  });

  return (
    <div className="min-h-screen bg-[#F6F7F8] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[#5CC0D6]">Learning</p>
            <h1 className="mt-2 text-3xl font-black text-[#162535]">My Courses</h1>
            <p className="mt-2 text-sm text-slate-500">Accepted live and recorded explanation orders.</p>
          </div>
          <Link href="/upload/lecture" className="rounded-full bg-[#162535] px-6 py-3 text-sm font-black text-white">
            Request explanation
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((order, index) => {
            const id = order._id ?? order.id ?? idOf(order.offer);
            const request = requestOf(order);
            const type = textOf(order.type, textOf(request.type, "explanation"));
            return (
              <article key={id || index} className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
                <div className="flex h-36 items-center justify-center bg-[#162535] text-[#5CC0D6]">
                  {type.toLowerCase().includes("live") ? <PlayCircle size={48} /> : <BookOpen size={48} />}
                </div>
                <div className="p-6">
                  <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold capitalize text-[#3BA7C5]">{type}</span>
                  <h2 className="mt-4 line-clamp-2 text-lg font-black text-[#162535]">{titleOf(order)}</h2>
                  <p className="mt-2 text-xs text-slate-400">Status: {order.status ?? "active"}</p>
                  {id && (
                    <Link href={`/courses/${id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#5CC0D6]">
                      Open course <ArrowRight size={15} />
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {courses.length === 0 && (
          <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-slate-100">
            <BookOpen className="mx-auto text-slate-300" size={44} />
            <h2 className="mt-4 text-lg font-black text-[#162535]">No active courses</h2>
            <p className="mt-2 text-sm text-slate-500">A course appears here after an instructor offer is accepted.</p>
          </div>
        )}
      </div>
    </div>
  );
}
