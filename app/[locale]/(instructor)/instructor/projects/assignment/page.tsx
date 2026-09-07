import { Link } from "@/src/i18n/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CircleDollarSign,
  FileText,
} from "lucide-react";

import { getMyOrders, type ApiOrder } from "@/lib/api/orders";

type DataRecord = Record<string, unknown>;

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

function projectTitle(order: ApiOrder) {
  return textOf(requestOf(order), ["title", "subject", "name"], "Assignment project");
}

function projectDescription(order: ApiOrder) {
  return textOf(
    requestOf(order),
    ["description", "details", "body"],
    "No description provided yet.",
  );
}

function projectDeadline(order: ApiOrder) {
  const deadline = textOf(requestOf(order), ["deadline", "dueDate"], "");
  return deadline ? new Date(deadline).toLocaleDateString() : "Flexible";
}

function projectBudget(order: ApiOrder) {
  const offer = offerOf(order);
  const request = requestOf(order);
  const amount =
    numberOf(offer, ["price", "amount", "totalPrice"]) ??
    numberOf(request, ["budget", "price"]);
  return amount == null ? "-" : `${amount} EGP`;
}

function isAssignmentOrder(order: ApiOrder) {
  const type = requestType(order);
  return !type || type === "assignment";
}

export default async function AssignmentProjectsPage() {
  const projects = (await getMyOrders()).filter(isAssignmentOrder);

  return (
    <div className="min-h-screen bg-[#f5f7fc] px-4 py-7 sm:px-6 lg:px-8" dir="ltr">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/instructor/projects"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <header className="mt-8">
          <h1 className="text-4xl font-bold tracking-normal text-slate-950 sm:text-5xl">
            Assignment projects
          </h1>
          <p className="mt-4 text-base font-medium text-slate-600">
            Open accepted assignments and continue working with students.
          </p>
        </header>

        <section className="mt-10 grid gap-6" aria-label="Assignment projects">
          {projects.map((project) => (
            <ProjectCard key={idOf(project) || projectTitle(project)} project={project} />
          ))}

          {projects.length === 0 && (
            <div className="rounded-xl bg-white p-10 text-center text-slate-500 shadow-sm ring-1 ring-slate-100">
              No assignment projects yet.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: ApiOrder }) {
  const id = idOf(project);
  const title = projectTitle(project);

  return (
    <article className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-black text-sky-700">
              {title.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-950">{title}</h2>
              <p className="text-xs font-bold uppercase text-slate-500">
                {project.status ?? "In progress"}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs font-black uppercase text-[#037da9]">
              Subject
            </p>
            <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-slate-600">
              {projectDescription(project)}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <span className="inline-flex h-9 items-center gap-2 rounded-md bg-[#eef5ff] px-3 text-xs font-bold text-slate-700">
              <FileText className="h-4 w-4" />
              Attached materials
            </span>
            <span className="inline-flex h-9 items-center gap-2 rounded-md bg-slate-50 px-3 text-xs font-bold text-slate-700 ring-1 ring-slate-200">
              <CalendarDays className="h-4 w-4" />
              {projectDeadline(project)}
            </span>
            <span className="inline-flex h-9 items-center gap-2 rounded-md bg-slate-50 px-3 text-xs font-bold text-slate-700 ring-1 ring-slate-200">
              <CircleDollarSign className="h-4 w-4" />
              {projectBudget(project)}
            </span>
          </div>
        </div>

        {id && (
          <Link
            href={`/instructor/projects/assignment/${id}`}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#142235] px-8 text-sm font-black text-white transition-colors hover:bg-[#0f1a2a]"
          >
            Open Project
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </article>
  );
}
