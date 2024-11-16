"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { HistoryData } from "@/app/api/history/route";
import { TimeframeHistoryType } from "@/components/overview/HistoryPeriodSelector";
import { cn } from "@/lib/utils";
import CountUp from "react-countup";

interface HistoryChartProps {
  data: HistoryData[] | undefined;
  timeframe: TimeframeHistoryType;
}

function HistoryChart({ data, timeframe }: HistoryChartProps) {
  return data && data.length > 0 ? (
    <ResponsiveContainer width="100%" minHeight={400}>
      <BarChart data={data} barCategoryGap={5}>
        <defs>
          <linearGradient id="incomeBar" x1="0" y1="0" x2="0" y2="1">
            <stop offset={"0"} stopColor="#10b981" stopOpacity={"1"} />
            <stop offset={"1"} stopColor="#10b981" stopOpacity={"0"} />
          </linearGradient>

          <linearGradient id="expenseBar" x1="0" y1="0" x2="0" y2="1">
            <stop offset={"0"} stopColor="#ef4444" stopOpacity={"1"} />
            <stop offset={"1"} stopColor="#ef4444" stopOpacity={"0"} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="5 5" strokeOpacity={"0.2"} vertical={false} />
        <XAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          padding={{ left: 5, right: 5 }}
          dataKey={(data) => {
            const { year, month, day } = data;
            const date = new Date(year, month, day + 1 || 1);
            if (timeframe === "year") {
              return date.toLocaleDateString("default", {
                month: "long",
              });
            }
            return date.toLocaleDateString("default", {
              day: "numeric",
            });
          }}
        />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip cursor={{ opacity: 0.1 }} content={(props) => <CustomTooltip {...props} />} />
        <Bar dataKey="income" fillOpacity={1} fill="url(#incomeBar)" radius={4} />
        <Bar dataKey="expense" fillOpacity={1} fill="url(#expenseBar)" radius={4} />
      </BarChart>
    </ResponsiveContainer>
  ) : (
    <div className="w-full flex justify-center items-center min-h-[300px]">No data available</div>
  );
}

function CustomTooltip({ active, payload, formatter }: any) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;
  const { expense, income } = data;

  return (
    <div className="min-w-[300px] rounded border bg-background p-4">
      <TooltipRow label="Expense" value={expense} bgColor="bg-red-500" textColor="text-red-500" />
      <TooltipRow label="Income" value={income} bgColor="bg-emerald-500" textColor="text-emerald-500" />
      <TooltipRow label="Balance" value={income - expense} bgColor="bg-gray-100" textColor="text-foreground" />
    </div>
  );
}

function TooltipRow({
  label,
  value,
  bgColor,
  textColor,
}: {
  label: string;
  textColor: string;
  bgColor: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("h-4 w-4 rounded-full", bgColor)} />
      <div className="flex w-full justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className={cn("text-sm font-bold", textColor)}>
          <CountUp duration={0.5} preserveValue end={value} decimals={0} className="text-sm" />
        </div>
      </div>
    </div>
  );
}

export default HistoryChart;
