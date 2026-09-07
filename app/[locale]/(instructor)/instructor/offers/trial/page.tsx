import { Link } from "@/src/i18n/navigation";
import { ArrowLeft, CalendarDays, Clock3, FileText } from "lucide-react";

import { getMyOffers, type ApiOffer } from "@/lib/api/offers";

type RequestRecord = Record<string, unknown>;

function idOf(offer: ApiOffer) {
  return offer._id ?? offer.id ?? "";
}

function objectOf(value: unknown): RequestRecord | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as RequestRecord)
    : null;
}

function requestOf(offer: ApiOffer) {
  return objectOf(offer.request);
}

function textOf(record: RequestRecord | null, keys: string[], fallback: string) {
  if (!record) return fallback;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return fallback;
}

function requestType(offer: ApiOffer) {
  return textOf(requestOf(offer), ["type"], "");
}

function requestTitle(offer: ApiOffer) {
  return textOf(requestOf(offer), ["title", "subject", "name"], "Student request");
}

function requestDescription(offer: ApiOffer) {
  return textOf(
    requestOf(offer),
    ["description", "details", "body"],
    "No description provided yet.",
  );
}

function requestDeadline(offer: ApiOffer) {
  const deadline = textOf(requestOf(offer), ["deadline", "dueDate"], "");
  return deadline ? new Date(deadline).toLocaleDateString() : "Flexible";
}

function displayStatus(status: string | undefined) {
  return status?.trim() || "pending";
}

function isTrialOffer(offer: ApiOffer) {
  const type = requestType(offer);
  return !type || type === "trial";
}

export default async function TrialOffersPage() {
  const offers = (await getMyOffers()).filter(isTrialOffer);

  return (
    <div className="min-h-screen bg-[#f5f7fc] px-4 py-7 sm:px-6 lg:px-8" dir="ltr">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/instructor/offers"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <header className="mt-6">
          <h1 className="text-4xl font-black tracking-normal text-slate-950">
            Trial offers
          </h1>
          <p className="mt-3 text-base font-medium text-slate-600">
            Track the offers you submitted for trial requests.
          </p>
        </header>

        <section className="mt-12 space-y-6" aria-label="Trial offers">
          {offers.map((offer) => (
            <TrialOfferCard key={idOf(offer) || requestTitle(offer)} offer={offer} />
          ))}

          {offers.length === 0 && (
            <div className="rounded-xl bg-white p-10 text-center text-slate-500 shadow-sm ring-1 ring-slate-100">
              No trial offers yet.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function TrialOfferCard({ offer }: { offer: ApiOffer }) {
  const offerId = idOf(offer);
  const status = displayStatus(offer.status);

  return (
    <article className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
      <div className="grid min-h-[220px] gap-8 lg:grid-cols-[1fr_180px]">
        <div>
          <StatusPill status={status} />

          <p className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-slate-500">
            <Clock3 className="h-3.5 w-3.5" />
            {offer.createdAt
              ? new Date(offer.createdAt).toLocaleDateString()
              : "Submitted offer"}
          </p>

          <h2 className="mt-5 text-2xl font-black text-slate-950">
            {requestTitle(offer)}
          </h2>
          <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-slate-600">
            {requestDescription(offer)}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <span className="inline-flex h-10 max-w-full items-center gap-2 rounded-md bg-[#eaf3ff] px-4 text-sm font-bold text-slate-700">
              <FileText className="h-4 w-4 shrink-0" />
              <span className="truncate">Attached materials</span>
            </span>
            <span className="inline-flex h-10 items-center gap-2 rounded-md bg-slate-50 px-4 text-sm font-bold text-slate-700 ring-1 ring-slate-200">
              <CalendarDays className="h-4 w-4" />
              {requestDeadline(offer)}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end justify-between">
          <div className="text-right">
            <p className="text-[11px] font-black uppercase text-slate-700">
              Estimated time
            </p>
            <p className="mt-2 text-sm font-black text-slate-950">
              {offer.estimatedTime ?? offer.estimateTime ?? "-"} hrs
            </p>
          </div>

          {offerId && (
            <Link
              href={`/instructor/offers/trial/${offerId}`}
              className="inline-flex h-12 w-full max-w-[170px] items-center justify-center rounded-lg bg-[#142235] text-sm font-black text-white transition-colors hover:bg-[#0f1a2a]"
            >
              View
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

function StatusPill({ status }: { status: string }) {
  const isApproved = /accept|approve|complete/i.test(status);

  return (
    <span
      className={[
        "inline-flex min-w-36 items-center justify-center rounded-full px-6 py-2 text-sm font-black capitalize",
        isApproved ? "bg-[#5cff75] text-[#084c16]" : "bg-[#ffbfc4] text-[#5b1118]",
      ].join(" ")}
    >
      {status}
    </span>
  );
}
