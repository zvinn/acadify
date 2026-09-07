import { ArrowLeft, LockKeyhole, ReceiptText, Wallet } from "lucide-react";

import { Link } from "@/src/i18n/navigation";
import { getAccountSnapshot } from "@/lib/api/profile";

function amount(value: number | undefined) {
  return Number.isFinite(value) ? value! : 0;
}

export default async function StudentWalletPage() {
  const { wallet, transactions } = await getAccountSnapshot("student");
  const balance = amount(wallet.balanceUSD ?? wallet.balance);
  const frozen = amount(wallet.freezedBalanceUSD ?? wallet.freezedBalance);
  const currency = wallet.balanceUSD != null ? "USD" : wallet.currency ?? "EGP";

  return (
    <div className="min-h-screen bg-[#F6F7F8] px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#162535]">My Wallet</h1>
          <p className="mt-2 text-sm text-slate-500">
            Live balance and transaction data from your Acadify account.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <section className="rounded-3xl bg-[#162535] p-8 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white/55">Available balance</span>
              <Wallet className="text-[#5CC0D6]" size={26} />
            </div>
            <p className="mt-8 text-4xl font-black">
              {balance.toLocaleString("en-US")} <span className="text-xl text-[#5CC0D6]">{currency}</span>
            </p>
          </section>

          <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500">Frozen balance</span>
              <LockKeyhole className="text-amber-500" size={24} />
            </div>
            <p className="mt-8 text-4xl font-black text-[#162535]">
              {frozen.toLocaleString("en-US")} <span className="text-xl text-slate-400">{currency}</span>
            </p>
          </section>
        </div>

        <section className="mt-8 rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-100">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#5CC0D6]">
              <ReceiptText size={20} />
            </span>
            <div>
              <h2 className="text-lg font-black text-[#162535]">Transactions</h2>
              <p className="text-xs text-slate-400">Most recent wallet activity</p>
            </div>
          </div>

          <div className="space-y-3">
            {transactions.map((transaction, index) => {
              const value = amount(transaction.amountUSD ?? transaction.amount);
              return (
                <article
                  key={transaction._id ?? transaction.id ?? index}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 px-5 py-4"
                >
                  <div>
                    <p className="text-sm font-bold text-[#162535]">
                      {transaction.title ?? transaction.description ?? transaction.type ?? "Wallet transaction"}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {transaction.createdAt
                        ? new Date(transaction.createdAt).toLocaleString()
                        : transaction.status ?? "Recent"}
                    </p>
                  </div>
                  <span className={`text-sm font-black ${value >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {value > 0 ? "+" : ""}{value.toLocaleString("en-US")} {currency}
                  </span>
                </article>
              );
            })}
            {transactions.length === 0 && (
              <p className="rounded-2xl bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
                No wallet transactions yet.
              </p>
            )}
          </div>
        </section>

        <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          Wallet recharge is not exposed by the current backend contract. The page shows real balance data without simulating a deposit.
        </p>
      </div>
    </div>
  );
}