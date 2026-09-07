import { Link } from "@/src/i18n/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  FileText,
  MonitorPlay,
  Radio,
} from "lucide-react";

import { getMyOffers, type ApiOffer } from "@/lib/api/offers";

type OfferMode = "video" | "live";
type RequestRecord = Record<string, unknown>;

type PageSearchParams = Promise<{
  mode?: string | string[];
}>;

const OFFER_MODES: Array<{
  id: OfferMode;
  label: string;
  icon: typeof MonitorPlay;
}> = [
  { id: "video", label: "Explanation by video", icon: MonitorPlay },
  { id: "live", label: "Explanation by live", icon: Radio },
];

function resolveMode(mode: string | string[] | undefined): OfferMode {
  const value = Array.isArray(mode) ? mode[0] : mode;
  return value === "live" ? "live" : "video";
}

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
  return textOf(requestOf(offer), ["title", "subject", "name"], "Explanation request");
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

function isModeOffer(offer: ApiOffer, mode: OfferMode) {
  const type = requestType(offer);
  if (mode === "live") return type === "live";
  return !type || type === "video" || type === "lecture";
}

function displayStatus(status: string | undefined) {
  return status?.trim() || "pending";
}

export default async function ExplainOffersPage({
  searchParams,
}: {
  searchParams: PageSearchParams;
}) {
  const { mode } = await searchParams;
  const selectedMode = resolveMode(mode);
  const offers = (await getMyOffers()).filter((offer) =>
    isModeOffer(offer, selectedMode),
  );

  return (
    <div className="min-h-screen bg-[#f5f7fc] px-4 py-7 sm:px-6 lg:px-8" dir="ltr">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/instructor/offers"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <header className="mt-8">
          <h1 className="text-4xl font-bold tracking-normal text-slate-950 sm:text-5xl">
            Offers
          </h1>
          <p className="mt-3 text-base font-medium text-slate-600">
            Follow your submitted explanation offers.
          </p>
        </header>

        <OfferTabs selectedMode={selectedMode} />

        <section className="mt-12 space-y-8" aria-label={`${selectedMode} explain offers`}>
          {offers.map((offer) => (
            <OfferCard key={idOf(offer) || requestTitle(offer)} mode={selectedMode} offer={offer} />
          ))}

          {offers.length === 0 && (
            <div className="rounded-xl bg-white p-10 text-center text-slate-500 shadow-sm ring-1 ring-slate-100">
              No {selectedMode} explanation offers yet.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function OfferTabs({ selectedMode }: { selectedMode: OfferMode }) {
  return (
    <nav className="mt-12 grid gap-6 md:grid-cols-2" aria-label="Explain offer type">
      {OFFER_MODES.map((mode) => {
        const Icon = mode.icon;
        const isSelected = selectedMode === mode.id;

        return (
          <Link
            key={mode.id}
            href={`/instructor/offers/explain?mode=${mode.id}`}
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

function OfferCard({ offer, mode }: { offer: ApiOffer; mode: OfferMode }) {
  const offerId = idOf(offer);
  const status = displayStatus(offer.status);

  return (
    <article className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
      <div className="grid min-h-[260px] gap-8 lg:grid-cols-[1fr_280px]">
        <div>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sm font-black text-sky-700">
              {requestTitle(offer).charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-black text-slate-950">
                {requestTitle(offer)}
              </h2>
              <p className="flex items-center gap-1 text-xs font-medium text-slate-500">
                <Clock3 className="h-3.5 w-3.5" />
                {offer.createdAt
                  ? new Date(offer.createdAt).toLocaleDateString()
                  : "Submitted offer"}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="max-w-3xl text-sm font-medium leading-6 text-slate-600">
              {requestDescription(offer)}
            </p>
            <div className="mt-6 inline-flex h-10 max-w-full items-center gap-2 rounded-md bg-[#eaf3ff] px-4 text-sm font-bold text-slate-700">
              <FileText className="h-4 w-4 shrink-0" />
              <span className="truncate">Attached materials</span>
            </div>
          </div>

          <div className="mt-8 max-w-2xl border-t border-slate-200 pt-5">
            <p className="inline-flex items-center gap-2 text-sm font-bold text-red-600">
              <CalendarDays className="h-4 w-4 text-slate-700" />
              Deadline: {requestDeadline(offer)}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end justify-between gap-10">
          <StatusPill status={status} />

          <div className="w-full max-w-[265px] text-right">
            <p className="mb-4 text-xs font-bold text-slate-500">
              Estimate: {offer.estimatedTime ?? offer.estimateTime ?? "-"} hrs
            </p>
            {offerId && (
              <Link
                href={
                  mode === "live"
                    ? `/instructor/offers/explain/live/${offerId}`
                    : `/instructor/projects/explain/video/${offerId}`
                }
                className="inline-flex h-14 w-full items-center justify-center rounded-xl bg-[#142235] text-base font-black uppercase text-white shadow-[0_14px_22px_rgba(15,23,42,0.18)] transition-colors hover:bg-[#0f1a2a]"
              >
                View
              </Link>
            )}
          </div>
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
