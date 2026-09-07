"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Link } from "@/src/i18n/navigation";
import { ChevronLeft, ArrowRight, CheckCircle2, Clock, Zap } from "lucide-react";

import type { ApiRequestItem } from "@/lib/api/requests";

type OrderStatus = "Approved" | "Pending" | "Processing";
type OrderTab = "Request" | "Offers";

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

export function OrdersClient({ requests }: { requests: ApiRequestItem[] }) {
  const [activeTab, setActiveTab] = useState<OrderTab>("Request");

  return (
    <div className="min-h-screen" style={{ background: "#F6F7F8" }}>
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm mb-8 transition-opacity hover:opacity-70"
          style={{ color: "#162535", opacity: 0.5 }}
        >
          <ChevronLeft size={16} />
          Back
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: "#162535" }}>
            My Orders
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#667085" }}>
            Track the status of your requests, assignments, and subscriptions.
          </p>
        </div>

        <div
          className="inline-flex rounded-xl p-1 mb-8"
          style={{ background: "rgba(22,37,53,0.06)" }}
        >
          {(["Request", "Offers"] as OrderTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className="relative px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
              style={
                activeTab === tab
                  ? {
                      background: "#fff",
                      color: "#162535",
                      boxShadow: "0 1px 6px rgba(22,37,53,0.10)",
                    }
                  : { color: "#667085" }
              }
            >
              {tab}
              {tab === "Offers" && (
                <span
                  className="ml-2 text-xs px-1.5 py-0.5 rounded-full font-medium"
                  style={{
                    background: "rgba(92,192,214,0.15)",
                    color: "#5CC0D6",
                  }}
                >
                  NEXT
                </span>
              )}
            </button>
          ))}
        </div>

        <p className="text-sm mb-6" style={{ color: "#667085" }}>
          {activeTab === "Request"
            ? "The requests you have submitted."
            : "Accepted offers and paid orders will be connected in the next phase."}
        </p>

        {activeTab === "Request" ? (
          <div className="flex flex-col gap-4">
            {requests.map((request) => {
              const statusKey = statusOf(request.status);
              const status = STATUS_CONFIG[statusKey];
              const id = request._id ?? request.id ?? "";

              return (
                <div
                  key={id || request.title}
                  className="bg-white rounded-2xl px-6 py-5 hover:shadow-md transition-all duration-300"
                  style={{ boxShadow: "0 1px 8px rgba(22,37,53,0.06)" }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div
                        className="flex items-center gap-2 mb-2 text-xs flex-wrap"
                        style={{ color: "#667085" }}
                      >
                        <span>
                          REQUEST DATE:{" "}
                          {request.createdAt
                            ? new Date(request.createdAt).toLocaleDateString()
                            : "Recent"}
                        </span>
                        <span className="mx-1">-</span>
                        <span
                          className="inline-flex items-center gap-1 font-semibold px-2.5 py-1 rounded-full"
                          style={{ background: status.bg, color: status.color }}
                        >
                          {status.icon}
                          {statusKey}
                        </span>
                      </div>
                      <h3 className="font-bold text-base leading-snug" style={{ color: "#162535" }}>
                        {request.title ?? request.description ?? "Student request"}
                      </h3>
                      <p className="text-sm mt-1" style={{ color: "#667085" }}>
                        {displayMajor(request.major)} | Type: {request.type ?? "request"}
                      </p>
                    </div>

                    {id && (
                      <Link
                        href={`/orders/${id}`}
                        className="shrink-0 inline-flex items-center gap-2 font-semibold px-5 py-2.5 rounded-full text-sm transition-all duration-200 hover:scale-105"
                        style={{ background: "#162535", color: "#fff" }}
                      >
                        Enter Order
                        <ArrowRight size={14} />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}

            {requests.length === 0 && (
              <div className="text-center py-16">
                <p className="text-lg font-medium" style={{ color: "#667085" }}>
                  No requests yet
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl bg-white px-6 py-12 text-center shadow-sm">
            <p className="text-sm font-medium" style={{ color: "#667085" }}>
              Offers will be connected with orders in phase 5.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
