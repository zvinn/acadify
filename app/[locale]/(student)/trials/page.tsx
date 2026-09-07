import { Clock3, FlaskConical, Info } from "lucide-react";

import { Link } from "@/src/i18n/navigation";
import { getMyRequests } from "@/lib/api/requests";

export default async function TrialsPage() {
  const requests = await getMyRequests();
  const trials = requests.filter((request) =>
    `${request.type ?? ""} ${request.title ?? ""}`.toLowerCase().includes("trial"),
  );

  return (
    <div className="min-h-screen bg-[#F6F7F8] px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-widest text-violet-500">Try before you continue</p>
          <h1 className="mt-2 text-3xl font-black text-[#162535]">Trial Sessions</h1>
          <p className="mt-2 text-sm text-slate-500">Trial requests recorded by the backend.</p>
        </div>

        <div className="space-y-4">
          {trials.map((trial, index) => (
            <article key={trial._id ?? trial.id ?? index} className="flex flex-col justify-between gap-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-500"><FlaskConical size={23} /></span>
                <div>
                  <h2 className="text-lg font-black text-[#162535]">{trial.title ?? trial.description ?? "Trial request"}</h2>
                  <p className="mt-1 text-xs text-slate-400">{trial.status ?? "pending"}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-xs font-bold text-slate-500"><Clock3 size={14} />{trial.createdAt ? new Date(trial.createdAt).toLocaleDateString() : "Recent"}</span>
            </article>
          ))}
        </div>

        {trials.length === 0 && (
          <div className="rounded-3xl bg-white px-6 py-14 text-center shadow-sm ring-1 ring-slate-100">
            <FlaskConical className="mx-auto text-slate-300" size={44} />
            <h2 className="mt-4 text-lg font-black text-[#162535]">No trial requests</h2>
            <p className="mt-2 text-sm text-slate-500">The current backend does not expose dedicated trial CRUD endpoints.</p>
          </div>
        )}

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          <Info className="mt-0.5 shrink-0" size={18} />
          <p>
            Creating and rescheduling a trial remains disabled because the production API collection has no valid trial endpoints. Use a regular live request for now, or add the missing backend contract.
          </p>
        </div>
        <Link href="/upload/lecture?type=live" className="mt-5 inline-flex rounded-full bg-[#162535] px-6 py-3 text-sm font-black text-white">Create a live explanation request</Link>
      </div>
    </div>
  );
}
