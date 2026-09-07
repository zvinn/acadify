import { Link } from "@/src/i18n/navigation";
import type { ReactNode } from "react";
import {
  ChevronLeft,
  CheckCircle2,
  Clock,
  Zap,
  HelpCircle,
  FileText,
} from "lucide-react";

import { getOffersForRequest, type ApiOffer } from "@/lib/api/offers";
import { getRequest, type ApiRequestItem } from "@/lib/api/requests";

import { AcceptOfferForm } from "../AcceptOfferForm";

type OrderStatus = "Approved" | "Pending" | "Processing";

const STATUS_CONFIG: Record<
  OrderStatus,
  { bg: string; color: string; icon: ReactNode }
> = {
  Approved: {
    bg: "rgba(34,197,94,0.1)",
    color: "#22C55E",
    icon: <CheckCircle2 size={13} />,
  },
  Pending: {
    bg: "rgba(245,158,11,0.1)",
    color: "#F59E0B",
    icon: <Clock size={13} />,
  },
  Processing: {
    bg: "rgba(92,192,214,0.1)",
    color: "#5CC0D6",
    icon: <Zap size={13} />,
  },
};

function statusOf(status?: string): OrderStatus {
  const normalized = status?.toLowerCase();
  if (normalized?.includes("approve") || normalized === "completed") {
    return "Approved";
  }
  if (normalized?.includes("progress") || normalized?.includes("process")) {
    return "Processing";
  }
  return "Pending";
}

function displayMajor(major: ApiRequestItem["major"]) {
  if (typeof major === "string") {
    return major;
  }
  return major?.name ?? major?.title ?? "General";
}

function offerIdOf(offer: ApiOffer) {
  return offer._id ?? offer.id ?? "";
}

function offerStatusOf(status: string | undefined) {
  return status?.trim() || "pending";
}

function offerEstimateOf(offer: ApiOffer) {
  const estimate = offer.estimatedTime ?? offer.estimateTime;
  return estimate == null ? "-" : `${estimate} hrs`;
}

function offerPriceOf(offer: ApiOffer) {
  return offer.price == null ? "-" : `${offer.price.toLocaleString("en-US")} EGP`;
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [request, offers] = await Promise.all([
    getRequest(id),
    getOffersForRequest(id),
  ]);
  const statusKey = statusOf(request.status);
  const status = STATUS_CONFIG[statusKey];

  return (
    <div className="min-h-screen" style={{ background: "#F6F7F8" }}>
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <Link
          href="/orders"
          className="inline-flex items-center gap-1 text-sm mb-8 transition-opacity hover:opacity-70"
          style={{ color: "#162535", opacity: 0.5 }}
        >
          <ChevronLeft size={16} />
          Back to My Orders
        </Link>

        <div
          className="rounded-[32px] p-8 md:p-10 mb-8 text-white relative overflow-hidden shadow-lg"
          style={{ background: "#162535" }}
        >
          <div
            className="absolute top-[-80px] right-[-80px] w-[300px] h-[300px] rounded-full opacity-10 blur-3xl"
            style={{ background: "#5CC0D6" }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span
                className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "#5CC0D6",
                }}
              >
                {displayMajor(request.major)}
              </span>
              <span
                className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full"
                style={{ background: status.bg, color: status.color }}
              >
                {status.icon}
                {statusKey}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold font-heading mb-2 leading-snug">
              {request.title ?? "Student request"}
            </h1>
            <p className="text-zinc-400 text-sm">
              Created{" "}
              {request.createdAt
                ? new Date(request.createdAt).toLocaleString()
                : "recently"}{" "}
              - Request ID: {id}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-extrabold text-[#162535] mb-6">
                Request Timeline
              </h2>

              <div className="flex flex-col gap-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                {[
                  { step: "Request Submitted", done: true },
                  { step: "Waiting for Instructor Offers", done: statusKey !== "Pending" },
                  { step: "Order Processing", done: statusKey === "Processing" || statusKey === "Approved" },
                  { step: "Completed", done: statusKey === "Approved" },
                ].map((step) => (
                  <div key={step.step} className="flex items-start gap-4 relative z-10">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: step.done
                          ? "rgba(34,197,94,0.1)"
                          : "rgba(22,37,53,0.05)",
                        color: step.done ? "#22C55E" : "#667085",
                      }}
                    >
                      {step.done ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#162535]">
                        {step.step}
                      </h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {step.done ? "Done" : "Pending"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-extrabold text-[#162535] mb-4 flex items-center gap-2">
                <FileText size={18} style={{ color: "#5CC0D6" }} />
                Request Details
              </h2>
              <p className="text-sm leading-7 text-gray-600">
                {request.description ?? "No description was provided."}
              </p>
              {request.deadline && (
                <p className="mt-4 text-sm font-bold text-[#162535]">
                  Deadline: {new Date(request.deadline).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm">
              <h3 className="font-extrabold text-[#162535] text-base mb-4">
                Request Summary
              </h3>

              <div className="flex flex-col gap-3 text-xs">
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-400">Type:</span>
                  <span className="font-extrabold text-[#162535] text-sm">
                    {request.type ?? "request"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-400">Status:</span>
                  <span className="font-bold text-[#162535]">{statusKey}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-400">Major:</span>
                  <span className="font-bold text-[#162535]">
                    {displayMajor(request.major)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm">
              <h3 className="font-extrabold text-[#162535] text-base mb-4">
                Instructor Offers
              </h3>

              <div className="flex flex-col gap-3">
                {offers.map((offer) => {
                  const offerId = offerIdOf(offer);

                  return (
                    <article
                      key={offerId || offer.createdAt}
                      className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold text-gray-400">
                            Estimate
                          </p>
                          <p className="text-sm font-extrabold text-[#162535]">
                            {offerEstimateOf(offer)}
                          </p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold capitalize text-gray-500">
                          {offerStatusOf(offer.status)}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs">
                        <span className="text-gray-400">Price</span>
                        <span className="font-extrabold text-[#162535]">
                          {offerPriceOf(offer)}
                        </span>
                      </div>

                      {offerId && (
                        <AcceptOfferForm offerId={offerId} type={request.type} />
                      )}
                    </article>
                  );
                })}

                {offers.length === 0 && (
                  <p className="rounded-2xl bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
                    No instructor offers yet.
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm">
              <h3 className="font-extrabold text-[#162535] text-base mb-2 flex items-center gap-2">
                <HelpCircle size={16} className="text-zinc-400" />
                Need Assistance?
              </h3>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                If you have any questions regarding schedules, payments, or file
                deliveries, contact our support team.
              </p>

              <Link
                href="/contact"
                className="block w-full py-3 rounded-full font-bold text-gray-600 border border-gray-200 text-xs text-center transition-colors hover:bg-gray-50"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
