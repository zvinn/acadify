import { ArrowLeft, CalendarDays, CircleDollarSign, Clock3, FileText, MessageSquare, UserRound } from "lucide-react";

import type { ApiOffer } from "@/lib/api/offers";
import { idOf, recordOf, textOf } from "@/lib/api/response";
import { Link } from "@/src/i18n/navigation";
import { OfferControls } from "./OfferControls";

function filesOf(offer: ApiOffer) {
  const request = recordOf(offer.request);
  const values = [request.demoFiles, request.allFiles, request.files, request.attachments, offer.allFiles];
  return values.flatMap((value) => Array.isArray(value) ? value : value ? [value] : []).map((value, index) => {
    const record = recordOf(value);
    return {
      url: textOf(record.url, textOf(record.path, textOf(record.secure_url, textOf(value)))),
      name: textOf(record.name, textOf(record.originalname, textOf(record.filename, `File ${index + 1}`))),
    };
  });
}

export function OfferDetail({ offer, backHref, label }: { offer: ApiOffer; backHref: string; label: string }) {
  const id = idOf(offer);
  const request = recordOf(offer.request);
  const requestId = idOf(offer.request);
  const student = recordOf(request.student);
  const title = textOf(request.title, textOf(request.subject, textOf(request.name, label)));
  const description = textOf(request.description, textOf(request.details, "No description was returned by the backend."));
  const deadline = textOf(request.deadline, textOf(request.dueDate));
  const estimatedTime = offer.estimatedTime ?? offer.estimateTime ?? 0;
  const files = filesOf(offer);

  return (
    <div className="min-h-screen bg-[#f5f7fc] px-4 py-7 sm:px-6 lg:px-8" dir="ltr">
      <div className="mx-auto max-w-6xl">
        <Link href={backHref} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"><ArrowLeft size={16} /> Back</Link>
        <main className="mt-7">
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#5CC0D6]">{label}</p><h1 className="mt-3 text-3xl font-black text-[#162535]">{title}</h1><p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">{description}</p></div><span className="self-start rounded-full bg-cyan-50 px-4 py-2 text-xs font-black text-[#1689A4]">{offer.status ?? "pending"}</span></div>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Info icon={UserRound} label="Student" value={textOf(student.fullName, textOf(student.name, textOf(student.email, "Student")))} /><Info icon={CalendarDays} label="Deadline" value={deadline ? new Date(deadline).toLocaleString() : "Flexible"} /><Info icon={Clock3} label="Estimate" value={`${estimatedTime || 0} hours`} /><Info icon={CircleDollarSign} label="Price" value={offer.price == null ? "Not returned" : `${offer.price.toLocaleString()} EGP`} /></div>
            <div className="mt-8 border-t border-slate-100 pt-7"><div className="flex flex-wrap items-center justify-between gap-4"><h2 className="text-lg font-black text-[#162535]">Request files</h2>{requestId && <Link href={`/chat/${requestId}`} className="inline-flex items-center gap-2 rounded-full bg-[#162535] px-5 py-3 text-xs font-black text-white"><MessageSquare size={16} /> Open backend chat</Link>}</div><div className="mt-5 grid gap-3 sm:grid-cols-2">{files.map((file, index) => file.url ? <a key={`${file.url}-${index}`} href={file.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-4 text-sm font-bold text-[#162535]"><FileText className="text-[#5CC0D6]" size={18} /><span className="truncate">{file.name}</span></a> : <div key={`${file.name}-${index}`} className="rounded-2xl bg-slate-50 px-4 py-4 text-sm font-bold text-[#162535]">{file.name}</div>)}{files.length === 0 && <p className="sm:col-span-2 rounded-2xl bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">No files were returned.</p>}</div></div>
          </section>
          <section className="mt-8 rounded-3xl bg-[#162535] p-6 text-white shadow-lg sm:p-8"><p className="text-xs font-black uppercase tracking-[0.2em] text-[#5CC0D6]">Backend actions</p><h2 className="mt-2 text-2xl font-black">Manage offer</h2><div className="mt-6"><OfferControls offerId={id} estimatedTime={estimatedTime} /></div></section>
        </main>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof UserRound; label: string; value: string }) {
  return <article className="rounded-2xl bg-slate-50 p-4"><Icon className="text-[#5CC0D6]" size={18} /><p className="mt-3 text-[10px] font-black uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 break-words text-xs font-black text-[#162535]">{value}</p></article>;
}
