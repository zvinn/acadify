import { Link } from "@/src/i18n/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CircleDollarSign,
  FileText,
  MonitorPlay,
  Radio,
} from "lucide-react";

import { getMyOrders, type ApiOrder } from "@/lib/api/orders";

type ExplainProjectMode = "video" | "live";
type DataRecord = Record<string, unknown>;

type PageSearchParams = Promise<{
  mode?: string | string[];
}>;

const MODES: Array<{
  id: ExplainProjectMode;
  label: string;
  icon: typeof MonitorPlay;
}> = [
  { id: "video", label: "Explanation by video", icon: MonitorPlay },
  { id: "live", label: "Explanation by live", icon: Radio },
];

function resolveMode(mode: string | string[] | undefined): ExplainProjectMode {
  const value = Array.isArray(mode) ? mode[0] : mode;
  return value === "live" ? "live" : "video";
}

function idOf(order: ApiOrder) {
  return order._id ?? order.id ?? "";
}

function objectOf(value: unknown): DataRecord | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as DataRecord)
    : null;
}

function offerOf(order: ApiOrder) {
  return objectOf(order.offer);
}

function requestOf(order: ApiOrder) {
  return objectOf(offerOf(order)?.request);
}

function textOf(record: DataRecord | null, keys: string[], fallback: string) {
  if (!record) return fallback;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return fallback;
}

function numberOf(record: DataRecord | null, keys: string[]) {
  if (!record) return undefined;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
  }
  return undefined;
}

function requestType(order: ApiOrder) {
  return textOf(requestOf(order), ["type"], "");
}

function titleOf(order: ApiOrder) {
  return textOf(requestOf(order), ["title", "subject", "name"], "Explain project");
}

function descriptionOf(order: ApiOrder) {
  return textOf(
    requestOf(order),
    ["description", "details", "body"],
    "No description provided yet.",
  );
}

function deadlineOf(order: ApiOrder) {
  const deadline = textOf(requestOf(order), ["deadline", "dueDate"], "");
  return deadline ? new Date(deadline).toLocaleDateString() : "Flexible";
}

function budgetOf(order: ApiOrder) {
  const amount =
    numberOf(offerOf(order), ["price", "amount", "totalPrice"]) ??
    numberOf(requestOf(order), ["budget", "price"]);
  return amount == null ? "-" : `${amount} EGP`;
}

function isModeOrder(order: ApiOrder, mode: ExplainProjectMode) {
  const type = requestType(order);
  if (mode === "live") return type === "live";
  return !type || type === "video" || type === "lecture";
}

export default async function ExplainProjectsPage({
  searchParams,
}: {
  searchParams: PageSearchParams;
}) {
  const { mode } = await searchParams;
  const selectedMode = resolveMode(mode);
  const projects = (await getMyOrders()).filter((order) =>
    isModeOrder(order, selectedMode),
  );

  return (
    <div className="min-h-screen bg-[#f5f7fc] px-4 py-7 sm:px-6 lg:px-8" dir="ltr">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/instructor/projects"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <header className="mt-5">
          <h1 className="text-4xl font-bold tracking-normal text-slate-950 sm:text-5xl">
            Explain projects
          </h1>
          <p className="mt-3 text-base font-medium text-slate-600">
            Continue accepted explanation orders.
          </p>
        </header>

        <ModeTabs selectedMode={selectedMode} />

        <section className="mt-8 space-y-8" aria-label={`${selectedMode} explain projects`}>
          {projects.map((project) => (
            <ExplainProjectCard
              key={idOf(project) || titleOf(project)}
              mode={selectedMode}
              project={project}
            />
          ))}

          {projects.length === 0 && (
            <div className="rounded-xl bg-white p-10 text-center text-slate-500 shadow-sm ring-1 ring-slate-100">
              No {selectedMode} explanation projects yet.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function ModeTabs({ selectedMode }: { selectedMode: ExplainProjectMode }) {
  return (
    <nav className="mt-5 grid gap-5 md:grid-cols-2" aria-label="Explain project type">
      {MODES.map((mode) => {
        const Icon = mode.icon;
        const isSelected = selectedMode === mode.id;

        return (
          <Link
            key={mode.id}
            href={`/instructor/projects/explain?mode=${mode.id}`}
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

function ExplainProjectCard({
  project,
  mode,
}: {
  project: ApiOrder;
  mode: ExplainProjectMode;
}) {
  const id = idOf(project);
  const title = titleOf(project);

  return (
    <article className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_330px]">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sm font-black text-sky-700">
              {title.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-black text-slate-950">{title}</h2>
              <p className="text-xs font-bold uppercase text-slate-500">
                {project.status ?? "In progress"}
              </p>
            </div>
          </div>

          <div className="mt-7">
            <p className="max-w-3xl text-sm font-medium leading-6 text-slate-600">
              {descriptionOf(project)}
            </p>
            <div className="mt-6 inline-flex h-8 items-center gap-1.5 rounded-md bg-[#eaf3ff] px-3 text-xs font-bold text-slate-700">
              <FileText className="h-3.5 w-3.5" />
              Attached materials
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-200 pt-5">
            <p className="inline-flex items-center gap-2 text-sm font-bold text-red-600">
              <CalendarDays className="h-4 w-4 text-slate-700" />
              Deadline: {deadlineOf(project)}
            </p>
            <p className="inline-flex items-center gap-2 text-sm font-bold text-slate-700">
              <CircleDollarSign className="h-4 w-4" />
              {budgetOf(project)}
            </p>
          </div>
        </div>

        <aside className="rounded-xl bg-[#edf4ff] p-6 text-center shadow-sm lg:self-start">
          <p className="text-xs font-bold text-slate-500">Project Budget</p>
          <p className="mt-1 text-2xl font-black text-[#52bce3]">{budgetOf(project)}</p>

          {id && (
            <Link
              href={
                mode === "video"
                  ? `/instructor/projects/explain/video/${id}`
                  : `/instructor/projects/explain/live/${id}`
              }
              className="mt-7 inline-flex h-14 w-full items-center justify-center gap-3 rounded-lg bg-[#142235] text-sm font-black text-white shadow-[0_14px_22px_rgba(15,23,42,0.22)] transition-colors hover:bg-[#0f1a2a]"
            >
              {mode === "video" ? "Upload video" : "Open live project"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </aside>
      </div>
    </article>
  );
}
