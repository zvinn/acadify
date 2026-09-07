import { ArrowLeft, CalendarDays, CircleDollarSign, FileText, MessageSquare, PackageCheck, UserRound } from "lucide-react";

import type { ApiOrder } from "@/lib/api/orders";
import { idOf, recordOf, textOf } from "@/lib/api/response";
import { Link } from "@/src/i18n/navigation";
import { ProjectWorkflowPanel } from "./ProjectWorkflowPanel";

export type ProjectKind = "assignment" | "video" | "live";

export function requestOfOrder(order: ApiOrder) {
  const direct = recordOf(order.request);
  if (Object.keys(direct).length) return direct;
  return recordOf(recordOf(order.offer).request);
}

export function projectKind(order: ApiOrder): ProjectKind {
  const type = textOf(requestOfOrder(order).type, textOf(order.type)).toLowerCase();
  if (type.includes("assignment")) return "assignment";
  if (type.includes("live")) return "live";
  return "video";
}

function numberOf(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function fileRecords(order: ApiOrder) {
  const request = requestOfOrder(order);
  const sources = [request.demoFiles, request.allFiles, request.files, request.attachments, order.documents, order.quizzes, order.videos];
  return sources.flatMap((source) => Array.isArray(source) ? source : source ? [source] : []).map((item, index) => {
    const record = recordOf(item);
    const url = textOf(record.url, textOf(record.path, textOf(record.secure_url, textOf(item))));
    return { url, name: textOf(record.name, textOf(record.originalname, textOf(record.filename, `File ${index + 1}`))) };
  }).filter((file) => file.url || file.name);
}

export function ProjectDetail({ order, kind, backHref }: { order: ApiOrder; kind: ProjectKind; backHref: string }) {
  const orderId = idOf(order);
  const offer = recordOf(order.offer);
  const request = requestOfOrder(order);
  const offerId = idOf(order.offer);
  const requestId = idOf(order.request) || idOf(offer.request);
  const student = recordOf(order.student);
  const title = textOf(request.title, textOf(request.subject, textOf(request.name, `${kind} project`)));
  const description = textOf(request.description, textOf(request.details, "No description was returned by the backend."));
  const deadline = textOf(request.deadline, textOf(request.dueDate));
  const budget = numberOf(offer.price) ?? numberOf(offer.amount) ?? numberOf(offer.totalPrice) ?? numberOf(request.budget) ?? numberOf(request.price);
  const studentName = textOf(student.fullName, textOf(student.name, textOf(student.email, "Student")));
  const files = fileRecords(order);

  return (
    <div className="min-h-screen bg-[#f5f7fc] px-4 py-7 sm:px-6 lg:px-8" dir="ltr">
      <div className="mx-auto max-w-6xl">
        <Link href={backHref} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-950"><ArrowLeft size={16} /> Back</Link>

        <main className="mt-7">
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#5CC0D6]">{kind} project</p>
                <h1 className="mt-3 text-3xl font-black text-[#162535]">{title}</h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">{description}</p>
              </div>
              <span className="inline-flex self-start rounded-full bg-cyan-50 px-4 py-2 text-xs font-black text-[#1689A4]">{order.status ?? "active"}</span>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Info icon={UserRound} label="Student" value={studentName} />
              <Info icon={CalendarDays} label="Deadline" value={deadline ? new Date(deadline).toLocaleString() : "Flexible"} />
              <Info icon={CircleDollarSign} label="Budget" value={budget == null ? "Not returned" : `${budget.toLocaleString()} EGP`} />
              <Info icon={PackageCheck} label="Order ID" value={orderId} />
            </div>

            <div className="mt-8 border-t border-slate-100 pt-7">
              <div className="flex items-center justify-between gap-4"><div><h2 className="text-lg font-black text-[#162535]">Attached files</h2><p className="mt-1 text-xs text-slate-400">Files returned with the request and order.</p></div>{orderId && <Link href={`/chat/${orderId}`} className="inline-flex items-center gap-2 rounded-full bg-[#162535] px-5 py-3 text-xs font-black text-white"><MessageSquare size={16} /> Open backend chat</Link>}</div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {files.map((file, index) => file.url ? <a key={`${file.url}-${index}`} href={file.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-4 text-sm font-bold text-[#162535] hover:bg-cyan-50"><FileText className="text-[#5CC0D6]" size={18} /><span className="truncate">{file.name}</span></a> : <div key={`${file.name}-${index}`} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-4 text-sm font-bold text-[#162535]"><FileText className="text-[#5CC0D6]" size={18} /><span className="truncate">{file.name}</span></div>)}
                {files.length === 0 && <p className="sm:col-span-2 rounded-2xl bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">No attached files were returned.</p>}
              </div>
            </div>
          </section>

          <ProjectWorkflowPanel kind={kind} orderId={orderId} offerId={offerId} requestId={requestId} />
        </main>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof UserRound; label: string; value: string }) {
  return <article className="rounded-2xl bg-slate-50 p-4"><Icon className="text-[#5CC0D6]" size={18} /><p className="mt-3 text-[10px] font-black uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 break-words text-xs font-black text-[#162535]">{value || "Not returned"}</p></article>;
}
