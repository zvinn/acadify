import { Link } from "@/src/i18n/navigation";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock3,
  CreditCard,
  WalletCards,
} from "lucide-react";

import { getAccountSnapshot, type ApiTransaction } from "@/lib/api/profile";

import { WithdrawRequestForm } from "./WithdrawRequestForm";

function transactionAmount(transaction: ApiTransaction) {
  return transaction.amountUSD ?? transaction.amount ?? 0;
}

function transactionTitle(transaction: ApiTransaction) {
  return (
    transaction.title ??
    transaction.description ??
    transaction.type ??
    "Wallet transaction"
  );
}

export default async function WithdrawPage() {
  const { wallet, transactions } = await getAccountSnapshot("instructor");
  const balance = wallet.balanceUSD ?? wallet.balance ?? 0;
  const currency = wallet.balanceUSD != null ? "USD" : wallet.currency ?? "EGP";

  return (
    <div className="min-h-screen bg-[#f7f8fd] px-4 py-7 sm:px-6 lg:px-8" dir="ltr">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/instructor/profile"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <header className="mt-8">
          <h1 className="text-4xl font-black tracking-normal text-slate-950 sm:text-5xl">
            Withdraw Earnings
          </h1>
          <p className="mt-3 text-lg font-medium text-slate-500">
            Request your payout and track your wallet activity.
          </p>
        </header>

        <main className="mt-12 grid gap-8 lg:grid-cols-[1.45fr_1fr]">
          <div className="space-y-8">
            <BalanceCard balance={balance} currency={currency} />
            <WithdrawRequestForm />
          </div>
          <TransactionHistory transactions={transactions} currency={currency} />
        </main>

        <p className="mt-14 text-center text-sm font-medium text-slate-500">
          Processing may take up to 24 hours. For support,{" "}
          <Link href="/contact" className="font-black text-slate-800 underline">
            Contact Us
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

function BalanceCard({ balance, currency }: { balance: number; currency: string }) {
  return (
    <section className="flex flex-col gap-6 rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-100 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.22em] text-slate-600">
          Available Funds
        </p>
        <h2 className="mt-2 text-4xl font-black leading-none text-slate-950 sm:text-5xl">
          Your Balance: {balance} {currency}
        </h2>
      </div>
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#bfeeff] text-[#142235]">
        <WalletCards className="h-7 w-7" />
      </div>
    </section>
  );
}

function TransactionHistory({
  transactions,
  currency,
}: {
  transactions: ApiTransaction[];
  currency: string;
}) {
  return (
    <aside className="rounded-xl bg-[#dcecff] p-8 shadow-sm">
      <div className="flex items-center gap-3">
        <CreditCard className="h-6 w-6 text-[#142235]" />
        <h2 className="text-2xl font-black text-slate-950">
          Transaction History
        </h2>
      </div>

      <div className="mt-8 space-y-4">
        {transactions.length > 0 ? (
          transactions.slice(0, 6).map((transaction, index) => {
            const amount = transactionAmount(transaction);
            const isPositive = amount >= 0;
            return (
              <article
                key={transaction._id ?? transaction.id ?? index}
                className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
                        isPositive
                          ? "bg-[#e8f8ff] text-[#32aee1]"
                          : "bg-[#fff4df] text-[#d9931f]"
                      }`}
                    >
                      {isPositive ? (
                        <Building2 className="h-5 w-5" />
                      ) : (
                        <Clock3 className="h-5 w-5" />
                      )}
                    </span>
                    <div>
                      <h3 className="text-base font-black text-slate-950">
                        {transactionTitle(transaction)}
                      </h3>
                      <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                        {transaction.createdAt
                          ? new Date(transaction.createdAt).toLocaleDateString()
                          : transaction.status ?? "Recent"}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-base font-black ${
                        isPositive ? "text-emerald-500" : "text-slate-950"
                      }`}
                    >
                      {amount > 0 ? "+" : ""}
                      {amount} {currency}
                    </p>
                    {transaction.status && (
                      <span className="mt-3 inline-flex rounded-full bg-[#69f37d] px-4 py-1 text-xs font-black text-slate-950">
                        {transaction.status}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <p className="rounded-xl bg-white p-5 text-sm font-semibold text-slate-500">
            No wallet transactions yet.
          </p>
        )}
      </div>

      <div className="mt-8 rounded-xl bg-[#142235] p-5 text-white shadow-[0_16px_24px_rgba(15,23,42,0.16)]">
        <div className="flex gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#52bce3]" />
          <p className="text-sm font-semibold leading-6">
            Your latest withdrawal request will appear here after submission.
          </p>
        </div>
      </div>
    </aside>
  );
}
