import { Link } from "@/src/i18n/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  FileText,
  MonitorPlay,
  Radio,
} from "lucide-react";

import { getAllRequests, type ApiRequestItem } from "@/lib/api/requests";

import { OfferSubmitForm } from "../OfferSubmitForm";

type ExplainMode = "video" | "live";

type PageSearchParams = Promise<{
  mode?: string | string[];
}>;

const EXPLAIN_MODES: Array<{
  id: ExplainMode;
  label: string;
  icon: typeof MonitorPlay;
}> = [
  { id: "video", label: "Explanation by video", icon: MonitorPlay },
  { id: "live", label: "Explanation by live", icon: Radio },
];

function resolveMode(mode: string | string[] | undefined): ExplainMode {
  const value = Array.isArray(mode) ? mode[0] : mode;
  return value === "live" ? "live" : "video";
}

function idOf(request: ApiRequestItem) {
  return request._id ?? request.id ?? "";
}

function displayMajor(major: ApiRequestItem["major"]) {
  if (typeof major === "string") return major;
  return major?.name ?? major?.title ?? "General";
}

export default async function ExplainTasksPage({
  searchParams,
}: {
  searchParams: PageSearchParams;
}) {
  const { mode } = await searchParams;
  const selectedMode = resolveMode(mode);
  const requests = (await getAllRequests()).filter((request) =>
    selectedMode === "live"
      ? request.type === "live"
      : request.type === "video" || request.type === "lecture" || !request.type,
  );

  return (
    <div className="min-h-screen bg-[#f5f7fc] px-4 py-8 sm:px-6 lg:px-8" dir="ltr">
      <div className="mx-auto max-w-7xl">
        <PageHeader />
        <ModeSwitcher selectedMode={selectedMode} />

        <section className="mt-8 space-y-7" aria-label="Explanation requests">
          {requests.map((request) => (
            <ExplainRequestCard key={idOf(request) || request.title} request={request} />
          ))}
          {requests.length === 0 && (
            <div className="rounded-lg bg-white p-10 text-center text-slate-500 shadow-sm">
              No {selectedMode} explanation requests right now.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function PageHeader() {
  return (
    <header>
      <Link
        href="/instructor/tasks"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-950"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <div className="mt-3">
        <h1 className="text-4xl font-bold tracking-normal text-slate-950 sm:text-5xl">
          Explain Tasks
        </h1>
        <p className="mt-3 text-base font-medium text-slate-600">
          Review requests and submit your time-based offer.
        </p>
      </div>
    </header>
  );
}

function ModeSwitcher({ selectedMode }: { selectedMode: ExplainMode }) {
  return (
    <nav className="mt-10 grid gap-5 md:grid-cols-2" aria-label="Explanation type">
      {EXPLAIN_MODES.map((mode) => {
        const Icon = mode.icon;
        const isSelected = selectedMode === mode.id;

        return (
          <Link
            key={mode.id}
            href={`/instructor/tasks/explain?mode=${mode.id}`}
            scroll={false}
            aria-current={isSelected ? "page" : undefined}
            className={[
              "relative flex min-h-20 items-center justify-between rounded-lg border bg-white px-6 text-left text-base font-bold transition-all",
              isSelected
                ? "border-[#55bfea] text-[#36aee0] shadow-sm"
                : "border-transparent text-slate-800 shadow-[0_18px_35px_rgba(15,23,42,0.10)] hover:border-sky-200 hover:text-[#36aee0]",
            ].join(" ")}
          >
            <span className="flex items-center gap-3">
              <Icon className="h-5 w-5" />
              {mode.label}
            </span>

            {isSelected && (
              <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-md bg-[#55bfea] text-white">
                <Check className="h-4 w-4" />
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function ExplainRequestCard({ request }: { request: ApiRequestItem }) {
  const id = idOf(request);

  return (
    <article className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_330px] lg:items-start">
        <div>
          <span className="rounded-full bg-[#dff1ff] px-3 py-1 text-[11px] font-black uppercase tracking-wide text-[#037da9]">
            {request.type ?? "video"} request
          </span>

          <div className="mt-7">
            <h2 className="text-xl font-bold text-slate-950">
              {request.title ?? "Explanation request"}
            </h2>
            <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-slate-600">
              {request.description ?? "No description provided."}
            </p>
            <div className="mt-6 inline-flex h-10 min-w-0 items-center gap-2 rounded-md bg-[#eef5ff] px-3 text-xs font-bold text-slate-700">
              <FileText className="h-4 w-4 shrink-0" />
              <span className="truncate">{displayMajor(request.major)}</span>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-5">
            <p className="inline-flex items-center gap-2 text-sm font-bold text-red-600">
              <CalendarDays className="h-4 w-4 text-slate-700" />
              Deadline:{" "}
              {request.deadline
                ? new Date(request.deadline).toLocaleDateString()
                : "Flexible"}
            </p>
          </div>
        </div>

        <aside className="rounded-lg bg-[#edf4ff] p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-950">Submit Your Proposal</h3>
          {id ? (
            <OfferSubmitForm requestId={id} />
          ) : (
            <p className="mt-4 text-sm text-slate-500">Missing request id.</p>
          )}
        </aside>
      </div>
    </article>
  );
}
