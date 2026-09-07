"use client";

import { useState } from "react";
import { Link } from "@/src/i18n/navigation";
import {
  ChevronLeft,
  User,
  Mail,
  MapPin,
  Wallet,
  Plus,
  Edit3,
  Bell,
  Shield,
} from "lucide-react";

import type { ApiTransaction, ApiUser, ApiWallet } from "@/lib/api/profile";

function displayValue(value: unknown, fallback = "Not provided") {
  if (typeof value === "string" && value.trim()) {
    return value;
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return displayValue(record.name ?? record.title, fallback);
  }
  return fallback;
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatAmount(amount: number | undefined) {
  return Number.isFinite(amount) ? amount : 0;
}

function transactionTitle(transaction: ApiTransaction) {
  return (
    transaction.title ??
    transaction.description ??
    transaction.type ??
    "Wallet transaction"
  );
}

export function StudentProfileClient({
  user,
  wallet,
  transactions,
}: {
  user: ApiUser;
  wallet: ApiWallet;
  transactions: ApiTransaction[];
}) {
  const [activeSection, setActiveSection] = useState<"profile" | "wallet">(
    "profile",
  );

  const name = displayValue(user.fullName ?? user.name, "Student");
  const balance = formatAmount(wallet.balanceUSD ?? wallet.balance);
  const currency = wallet.balanceUSD != null ? "USD" : wallet.currency ?? "EGP";

  return (
    <div className="min-h-screen" style={{ background: "#F6F7F8" }}>
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm mb-8 transition-opacity hover:opacity-70"
          style={{ color: "#162535", opacity: 0.5 }}
        >
          <ChevronLeft size={16} />
          Back
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div
              className="rounded-2xl p-6 text-center flex flex-col items-center gap-3"
              style={{
                background: "#162535",
                boxShadow: "0 4px 24px rgba(22,37,53,0.12)",
              }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold border-4"
                style={{
                  background: "#5CC0D6",
                  borderColor: "rgba(255,255,255,0.15)",
                }}
              >
                {initials(name) || "S"}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{name}</h2>
                <p
                  className="text-sm mt-0.5"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  {displayValue(user.university)}
                </p>
              </div>
              <span
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{
                  background: "rgba(92,192,214,0.15)",
                  color: "#5CC0D6",
                }}
              >
                Student
              </span>

              <Link
                href="/profile/edit"
                className="mt-2 w-full inline-flex items-center justify-center gap-2 font-semibold py-2.5 rounded-full text-sm transition-all hover:opacity-90"
                style={{ background: "#5CC0D6", color: "#fff" }}
              >
                <Edit3 size={15} />
                Edit Profile
              </Link>
            </div>

            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "#fff",
                boxShadow: "0 1px 8px rgba(22,37,53,0.06)",
              }}
            >
              {[
                { id: "profile", label: "My Profile", icon: <User size={16} /> },
                { id: "wallet", label: "My Wallet", icon: <Wallet size={16} /> },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setActiveSection(item.id as "profile" | "wallet")
                  }
                  className="w-full flex items-center gap-3 px-5 py-4 text-sm font-semibold text-left transition-all"
                  style={
                    activeSection === item.id
                      ? {
                          color: "#5CC0D6",
                          background: "rgba(92,192,214,0.06)",
                          borderLeft: "3px solid #5CC0D6",
                        }
                      : { color: "#667085", borderLeft: "3px solid transparent" }
                  }
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            {activeSection === "profile" && (
              <div
                className="rounded-2xl p-8"
                style={{
                  background: "#fff",
                  boxShadow: "0 1px 8px rgba(22,37,53,0.06)",
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold" style={{ color: "#162535" }}>
                    Personal Information
                  </h3>
                  <Link
                    href="/profile/edit"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full transition-all hover:opacity-80"
                    style={{
                      background: "rgba(92,192,214,0.1)",
                      color: "#5CC0D6",
                    }}
                  >
                    <Edit3 size={14} />
                    Edit
                  </Link>
                </div>

                <div className="flex flex-col gap-5">
                  {[
                    { icon: <User size={18} />, label: "Full Name", value: name },
                    {
                      icon: <Mail size={18} />,
                      label: "Email Address",
                      value: displayValue(user.email),
                    },
                    {
                      icon: <MapPin size={18} />,
                      label: "Location",
                      value: displayValue(user.country),
                    },
                    {
                      icon: <Shield size={18} />,
                      label: "University",
                      value: displayValue(user.university),
                    },
                    {
                      icon: <Shield size={18} />,
                      label: "Faculty / Major",
                      value: `${displayValue(user.faculty)} / ${displayValue(user.major)}`,
                    },
                  ].map((field) => (
                    <div
                      key={field.label}
                      className="flex items-center gap-4 p-4 rounded-xl"
                      style={{ background: "#F6F7F8" }}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          background: "rgba(92,192,214,0.12)",
                          color: "#5CC0D6",
                        }}
                      >
                        {field.icon}
                      </div>
                      <div>
                        <p className="text-xs font-medium" style={{ color: "#667085" }}>
                          {field.label}
                        </p>
                        <p
                          className="text-sm font-semibold mt-0.5"
                          style={{ color: "#162535" }}
                        >
                          {field.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t" style={{ borderColor: "#F0F0F0" }}>
                  <Link
                    href="/notifications"
                    className="flex items-center justify-between p-4 rounded-xl transition-all hover:opacity-80"
                    style={{ background: "#F6F7F8" }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{
                          background: "rgba(92,192,214,0.12)",
                          color: "#5CC0D6",
                        }}
                      >
                        <Bell size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "#162535" }}>
                          Notifications
                        </p>
                        <p className="text-xs" style={{ color: "#667085" }}>
                          Manage your notification preferences
                        </p>
                      </div>
                    </div>
                    <ChevronLeft
                      size={16}
                      style={{ color: "#667085", transform: "rotate(180deg)" }}
                    />
                  </Link>
                </div>
              </div>
            )}

            {activeSection === "wallet" && (
              <div
                className="rounded-2xl p-8"
                style={{
                  background: "#fff",
                  boxShadow: "0 1px 8px rgba(22,37,53,0.06)",
                }}
              >
                <h3 className="text-xl font-bold mb-6" style={{ color: "#162535" }}>
                  My Wallet
                </h3>

                <div
                  className="rounded-2xl p-6 mb-6 flex items-center justify-between"
                  style={{ background: "#162535" }}
                >
                  <div>
                    <p
                      className="text-sm mb-1"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      Current Balance
                    </p>
                    <p className="text-4xl font-bold text-white">
                      {balance}{" "}
                      <span className="text-xl" style={{ color: "#5CC0D6" }}>
                        {currency}
                      </span>
                    </p>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 font-semibold px-5 py-2.5 rounded-full text-sm transition-all hover:opacity-90 hover:scale-105"
                    style={{ background: "#5CC0D6", color: "#fff" }}
                  >
                    <Plus size={16} />
                    Recharge
                  </button>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-4" style={{ color: "#667085" }}>
                    Recent Transactions
                  </h4>
                  <div className="flex flex-col gap-3">
                    {transactions.length > 0 ? (
                      transactions.slice(0, 5).map((transaction, index) => {
                        const amount =
                          transaction.amountUSD ?? transaction.amount ?? 0;
                        return (
                          <div
                            key={transaction._id ?? transaction.id ?? index}
                            className="flex items-center justify-between p-4 rounded-xl"
                            style={{ background: "#F6F7F8" }}
                          >
                            <div>
                              <p className="text-sm font-medium" style={{ color: "#162535" }}>
                                {transactionTitle(transaction)}
                              </p>
                              <p className="text-xs mt-0.5" style={{ color: "#667085" }}>
                                {transaction.createdAt
                                  ? new Date(transaction.createdAt).toLocaleDateString()
                                  : transaction.status ?? "Recent"}
                              </p>
                            </div>
                            <span
                              className="text-sm font-bold"
                              style={{ color: amount >= 0 ? "#22C55E" : "#EF4444" }}
                            >
                              {amount > 0 ? "+" : ""}
                              {amount} {currency}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <p className="rounded-xl bg-[#F6F7F8] p-4 text-sm text-[#667085]">
                        No transactions yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
