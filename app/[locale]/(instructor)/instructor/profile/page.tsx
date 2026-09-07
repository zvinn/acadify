import { Link } from "@/src/i18n/navigation";
import { ArrowLeft, CreditCard, Mail, MapPin } from "lucide-react";

import { getAccountSnapshot, type ApiUser, type ApiWallet } from "@/lib/api/profile";

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
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "I"
  );
}

function balanceOf(wallet: ApiWallet) {
  return wallet.balanceUSD ?? wallet.balance ?? 0;
}

export default async function ProfilePage() {
  const { user, wallet } = await getAccountSnapshot("instructor");

  return (
    <div className="min-h-screen bg-white px-4 py-7 sm:px-6 lg:px-8" dir="ltr">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/instructor/tasks"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <header className="mt-8">
          <h1 className="text-4xl font-black tracking-normal text-slate-950 sm:text-5xl">
            My Profile
          </h1>
          <p className="mt-3 text-lg font-medium text-slate-500">
            Manage your account and wallet.
          </p>
        </header>

        <main className="mt-12 space-y-12">
          <ProfileCard user={user} />
          <WalletCard wallet={wallet} />
        </main>
      </div>
    </div>
  );
}

function ProfileCard({ user }: { user: ApiUser }) {
  const name = displayValue(user.fullName ?? user.name, "Instructor");

  return (
    <section className="rounded-2xl bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 sm:p-10">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-8">
          <Avatar initialsText={initials(name)} />

          <div>
            <h2 className="text-3xl font-black text-slate-950">{name}</h2>
            <p className="mt-3 flex items-center gap-2 text-base font-medium text-slate-500">
              <Mail className="h-4 w-4" />
              {displayValue(user.email)}
            </p>
            <p className="mt-2 flex items-center gap-2 text-base font-medium text-slate-500">
              <MapPin className="h-4 w-4" />
              {displayValue(user.country)}
            </p>
            <p className="mt-2 text-base font-medium text-slate-500">
              {displayValue(user.university)} / {displayValue(user.specialization ?? user.major)}
            </p>
          </div>
        </div>

        <Link
          href="/instructor/profile/edit"
          className="inline-flex h-14 min-w-44 items-center justify-center rounded-lg border-2 border-[#142235] px-8 text-base font-black text-[#142235] transition-colors hover:bg-[#142235] hover:text-white"
        >
          Edit Profile
        </Link>
      </div>
    </section>
  );
}

function Avatar({ initialsText }: { initialsText: string }) {
  return (
    <div className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-[#ffd3ad] ring-4 ring-white shadow-sm">
      <div className="absolute bottom-5 h-16 w-20 rounded-t-full bg-[#142235]" />
      <div className="absolute top-8 h-16 w-16 rounded-full bg-[#f2b382]" />
      <div className="absolute top-7 h-7 w-20 rounded-t-full bg-[#142235]" />
      <div className="absolute top-14 h-4 w-10 rounded-b-full bg-[#142235]" />
      <span className="relative mt-12 text-sm font-black text-white">
        {initialsText}
      </span>
    </div>
  );
}

function WalletCard({ wallet }: { wallet: ApiWallet }) {
  const currency = wallet.balanceUSD != null ? "USD" : wallet.currency ?? "EGP";

  return (
    <section className="rounded-2xl bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 sm:p-10">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#e8f8ff] text-[#32aee1]">
          <CreditCard className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-black text-slate-950">My Wallet</h2>
      </div>

      <div className="mt-10 rounded-xl bg-[#f8fafc] p-8 ring-1 ring-slate-200">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">
              Current Balance
            </p>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-5xl font-black leading-none text-slate-950">
                {balanceOf(wallet)}
              </span>
              <span className="pb-1 text-xl font-black text-slate-950">
                {currency}
              </span>
            </div>
            <p className="mt-6 max-w-xs text-base font-medium leading-6 text-slate-500">
              Use your wallet to receive earnings and request withdrawals.
            </p>
          </div>

          <Link
            href="/instructor/profile/withdraw"
            className="inline-flex h-16 w-full items-center justify-center rounded-xl bg-[#52bce3] text-lg font-black text-white shadow-[0_14px_24px_rgba(82,188,227,0.25)] transition-colors hover:bg-[#3ba8ce] sm:max-w-60"
          >
            Withdraw
          </Link>
        </div>
      </div>
    </section>
  );
}
