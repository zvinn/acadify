import { ArrowLeft, Download, FileText } from "lucide-react";

import { Link } from "@/src/i18n/navigation";
import { getOrder } from "@/lib/api/orders";
import { recordOf, textOf } from "@/lib/api/response";

export default async function AssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);
  const offer = recordOf(order.offer);
  const request = recordOf(order.request || offer.request);
  const files = [...(order.documents ?? []), ...(order.quizzes ?? [])];

  return (
    <div className="min-h-screen bg-[#F6F7F8] px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <Link href="/assignments" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-500"><ArrowLeft size={16} /> Back to assignments</Link>
        <section className="rounded-[32px] bg-[#162535] p-8 text-white shadow-lg">
          <span className="text-xs font-bold uppercase tracking-widest text-[#5CC0D6]">Assignment order</span>
          <h1 className="mt-4 text-3xl font-black">{textOf(request.title, textOf(request.description, "Assignment"))}</h1>
          <p className="mt-3 text-sm text-white/50">Status: {order.status ?? "active"}</p>
        </section>
        <section className="mt-7 rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-100">
          <h2 className="text-xl font-black text-[#162535]">Delivered files</h2>
          <div className="mt-5 space-y-3">
            {files.map((file, index) => (
              <a key={`${file}-${index}`} href={file} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl bg-slate-50 px-5 py-4 text-sm font-bold text-[#162535]">
                <span className="flex min-w-0 items-center gap-3"><FileText className="shrink-0 text-[#5CC0D6]" size={19} /><span className="truncate">Solution file {index + 1}</span></span>
                <Download size={17} />
              </a>
            ))}
            {files.length === 0 && <p className="rounded-2xl bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">The instructor has not delivered solution files yet.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
