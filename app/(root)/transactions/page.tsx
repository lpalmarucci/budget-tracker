import { getSession } from "@/auth";
import { redirect } from "next/navigation";
import TransactionsSection from "@/components/transactions/TransactionsSection";

export default async function TransactionsPage() {
  const session = await getSession();

  if (!session) return redirect("/auth/signin");

  return (
    <div className="h-full bg-card">
      <TransactionsSection />
    </div>
  );
}
