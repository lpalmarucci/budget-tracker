"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MONTHS } from "@/lib/costants";
import { type Dispatch, type SetStateAction, useCallback } from "react";
import { addYears, subYears } from "date-fns";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { cn } from "@/lib/utils";

export type TimeframeHistoryType = "year" | "month";

export type PeriodHistoryType = {
  year: number;
  month: number;
};

interface HistoryPeriodSelectorProps {
  timeframe: TimeframeHistoryType;
  setTimeframe: Dispatch<SetStateAction<TimeframeHistoryType>>;
  period: PeriodHistoryType;
  setPeriod: Dispatch<SetStateAction<PeriodHistoryType>>;
  isLoading: boolean;
  className?: string;
}

function HistoryPeriodSelector({
  className,
  timeframe,
  setTimeframe,
  period,
  setPeriod,
  isLoading,
}: HistoryPeriodSelectorProps) {
  const getYearsOptions = useCallback(() => {
    const now = new Date();
    return [subYears(now, 1).getFullYear(), now.getFullYear(), addYears(now, 1).getFullYear()];
  }, []);

  return (
    <div className={cn(className, "flex gap-6 items-center")}>
      <Tabs
        onValueChange={(val) => setTimeframe(val as TimeframeHistoryType)}
        defaultValue={timeframe}
        className="flex gap-4 items-center"
      >
        <TabsList>
          <SkeletonWrapper isLoading={isLoading} className="w-[130px] h-10">
            <TabsTrigger value="year">Year</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </SkeletonWrapper>
        </TabsList>
      </Tabs>
      <div className="flex gap-2 items-center">
        <SkeletonWrapper isLoading={isLoading} className="h-10 w-[100px]">
          <Select
            defaultValue={period.year.toString()}
            onValueChange={(year) => {
              setPeriod((period) => ({ ...period, year: Number(year) }));
            }}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {getYearsOptions().map((y, idx) => (
                  <SelectItem key={`${y}-${idx}`} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </SkeletonWrapper>
        {timeframe === "month" && (
          <SkeletonWrapper isLoading={isLoading} className="h-10 w-[130px]">
            <Select
              defaultValue={period.month.toString()}
              onValueChange={(month) => setPeriod((period) => ({ ...period, month: Number(month) }))}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {MONTHS.map((m, idx) => (
                    <SelectItem key={`${m}-${idx}`} value={idx.toString()}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </SkeletonWrapper>
        )}
      </div>
    </div>
  );
}

export default HistoryPeriodSelector;
