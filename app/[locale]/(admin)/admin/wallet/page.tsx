import { getTransactions, getWithdrawalRequests } from "@/lib/api/wallets";
import { AdminWalletManager } from "../_components/AdminWalletManager";

export default async function AdminWalletPage() {
  const [withdrawals, transactions] = await Promise.all([getWithdrawalRequests(), getTransactions()]);
  return <AdminWalletManager withdrawals={withdrawals} transactions={transactions} />;
}
