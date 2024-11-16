"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { addYears, subYears } from "date-fns";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import HistoryPeriodSelector, {
  PeriodHistoryType,
  TimeframeHistoryType,
} from "@/components/overview/HistoryPeriodSelector";
import HistoryChart from "@/components/overview/HistoryChart";

function getYearsOption() {
  const now = new Date();
  return [subYears(now, 1), now.getFullYear(), addYears(now, 1)];
}

function History() {
  const [timeframe, setTimeframe] = useState<TimeframeHistoryType>("month");
  const [period, setPeriod] = useState<PeriodHistoryType>({
    year: new Date().getFullYear(),
    month: new Date().getUTCMonth(),
  });

  const { data, isFetching } = useQuery({
    queryKey: ["overview", "history", timeframe, period],
    queryFn: () =>
      fetch(`/api/history?timeframe=${timeframe}&year=${period.year}&month=${period.month}`).then((res) => res.json()),
  });

  console.log({ data });
  return (
    <div className="flex flex-col gap-2">
      <span className="tracking-wide font-semibold text-xl">History</span>
      <Card>
        <CardHeader>
          <div className="w-full flex items-center justify-between">
            <HistoryPeriodSelector
              period={period}
              setPeriod={setPeriod}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
              isLoading={isFetching}
            />
            <div className="flex gap-4 items-center">
              <div className="flex gap-2 items-center">
                <div className="rounded-full h-[12px] w-[12px] bg-emerald-500" />
                <span>Income</span>
              </div>
              <div className="flex gap-2 items-center">
                <div className="rounded-full h-[12px] w-[12px] bg-red-500" />
                <span>Expense</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <HistoryChart data={data} timeframe={timeframe} />
        </CardContent>
      </Card>
    </div>
  );
}

export default History;
