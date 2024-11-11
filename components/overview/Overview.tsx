"use client";
import { subMonths } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import StatsCards from "@/components/overview/StatsCards";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import CategoriesStats from "@/components/overview/CategoriesStats";

export function Overview() {
  const [date, setDate] = useState<DateRange>({
    from: subMonths(new Date(), 1),
    to: new Date(),
  });

  return (
    <div className="w-full flex flex-col gap-4 justify-center">
      <div className="flex justify-between">
        <span className="tracking-wide font-semibold text-xl">Overview</span>
        <DateRangePicker
          initialDateFrom={date?.from}
          initialDateTo={date?.to}
          showCompare={false}
          locale="it-IT"
          onUpdate={(val) => {
            if (!val) return;
            setDate(val.range);
          }}
        />
      </div>
      <StatsCards from={date.from} to={date.to} />
      <CategoriesStats from={date.from} to={date.to} />
    </div>
  );
}
