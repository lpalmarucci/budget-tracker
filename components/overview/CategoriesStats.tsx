"use client";

import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import * as React from "react";
import { TransactionType } from "@/lib/types";
import { CategoriesStatsResponseType } from "@/app/api/stats/category/route";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface CategoriesStatsProps {
  from?: Date;
  to?: Date;
}

function CategoriesStats({ from, to }: CategoriesStatsProps) {
  const { data: statsQuery, isFetching } = useQuery<CategoriesStatsResponseType>({
    queryKey: ["overview", "category", from, to],
    queryFn: () =>
      fetch(`/api/stats/category?from=${from?.toUTCString()}&to=${to?.toUTCString()}`).then((res) => res.json()),
  });

  return (
    <div className="w-full flex gap-4 flex-wrap md:flex-nowrap">
      <CategoryStat type="income" data={statsQuery} loading={isFetching} />
      <CategoryStat type="expense" data={statsQuery} loading={isFetching} />
    </div>
  );
}

export default CategoriesStats;

interface CategoryStatProp {
  type: TransactionType;
  data?: CategoriesStatsResponseType;
  loading: boolean;
}

function CategoryStat({ type, data, loading }: CategoryStatProp) {
  if (loading || !data) return <Skeleton className="h-64 w-full" />;

  const dataByType = data.filter((d) => d.type === type).slice(0, 3);
  const total = dataByType.reduce((tot, c) => (c._sum?.amount ?? 0) + tot, 0);
  return (
    <Card className="w-full flex flex-col items-center gap-2 ">
      <CardHeader className="text-xl font-semibold text-muted-foreground">
        {type === "income" ? "Incomes by category" : "Expenses by category"}
      </CardHeader>
      <CardContent className="w-full flex flex-col gap-6 justify-center">
        {dataByType.length > 0 ? (
          dataByType.map((c, idx) => {
            const percentage = ((c._sum.amount ?? 0) * 100) / total;

            return (
              <div key={`${c.category}-${c.categoryIcon}`} className="w-full flex flex-col gap-2">
                <div className="h-full w-full flex items-center justify-between">
                  <div className="flex gap-2 items-center">
                    <em-emoji shortcodes={c.categoryIcon} size="10" />
                    <span>{c.category}</span>
                    <span className="text-xs text-muted-foreground mt-1">({percentage.toFixed(0)}%)</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{formatCurrency(c._sum.amount ?? 0)}</span>
                </div>
                <Progress value={percentage} indicator={type === "income" ? "bg-emerald-500" : "bg-red-500"} />
              </div>
            );
          })
        ) : (
          <div className="flex w-full text-sm items-center justify-center italic text-gray-600">
            No categories found
          </div>
        )}
      </CardContent>
    </Card>
  );
}
