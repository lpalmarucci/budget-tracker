"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { GetBalanceStatusType } from "@/app/api/stats/balance/route";

interface StatsCardsProps {
  from?: Date;
  to?: Date;
}

function StatsCards({ from, to }: StatsCardsProps) {
  const { data, isFetching } = useQuery<GetBalanceStatusType>({
    queryKey: ["overview", "stats", from, to],
    queryFn: () =>
      fetch(`/api/stats/balance?from=${from?.toUTCString()}&to=${to?.toUTCString()}`).then((res) => res.json()),
  });

  function calculateBalance(data: GetBalanceStatusType | undefined): number {
    if (!data) return 0;

    return (data.income ?? 0) - (data.expense ?? 0);
  }

  return (
    <div className="flex gap-2 justify-center items-center">
      <StatsCard
        title="Income"
        amount={data?.income ?? 0}
        icon={<TrendingUp className="h-12 w-12 p-2 rounded-lg text-emerald-500 bg-emerald-400/10" />}
        loading={isFetching}
      />
      <StatsCard
        title="Expense"
        amount={data?.expense ?? 0}
        icon={<TrendingDown className="h-12 w-12 p-2 rounded-lg text-red-500 bg-red-400/10" />}
        loading={isFetching}
      />
      <StatsCard
        title="Balance"
        amount={calculateBalance(data)}
        icon={<Wallet className="h-12 w-12 p-2 rounded-lg text-indigo-500 bg-indigo-400/10" />}
        loading={isFetching}
      />
    </div>
  );
}

export default StatsCards;

function StatsCard({
  title,
  icon,
  amount,
  loading,
}: {
  title: string;
  amount: number;
  icon: React.ReactNode;
  loading: boolean;
}) {
  return (
    <div className="p-4 w-full flex gap-4 items-center bg-card border rounded-md">
      {icon}
      <div className="w-full flex flex-col">
        <span className="text-md capitalize text-gray-400">{title}</span>
        {loading ? (
          <Skeleton className="h-7 w-full" />
        ) : (
          <span className="text-xl font-semibold">{formatCurrency(amount)}</span>
        )}
      </div>
    </div>
  );
}
