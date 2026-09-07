import { getAccountSnapshot } from "@/lib/api/profile";

import { StudentProfileClient } from "./StudentProfileClient";

export default async function MyProfilePage() {
  const { user, wallet, transactions } = await getAccountSnapshot("student");

  return (
    <StudentProfileClient
      user={user}
      wallet={wallet}
      transactions={transactions}
    />
  );
}
