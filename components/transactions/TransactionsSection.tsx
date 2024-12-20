"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import { subMonths } from "date-fns";
import { TransactionsTable } from "@/components/transactions/table";
import { columns } from "@/components/transactions/table/columns";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

function TransactionsSection() {
  const [date, setDate] = useState<DateRange>({
    from: subMonths(new Date(), 1),
    to: new Date(),
  });

  const { data, isFetching, isLoading } = useQuery({
    queryKey: ["transactions", date],
    queryFn: () =>
      fetch(`/api/transactions?from=${date.from?.toUTCString()}&to=${date.to?.toUTCString()}`).then((res) =>
        res.json(),
      ),
  });

  const tableColumns = useMemo(
    () =>
      isFetching
        ? columns.map((column) => ({
            ...column,
            cell: () => <Skeleton className="h-8" />,
          }))
        : columns,
    [isFetching, columns],
  );
  const tableData = useMemo(() => (isFetching ? Array(10).fill({}) : data), [isFetching, data]);

  return (
    <div className="flex flex-col">
      <div className="border-b bg-card">
        <div className="container px-4 mx-auto w-full h-full flex flex-wrap justify-between items-center py-8">
          <span className="text-2xl font-bold">Transactions history</span>
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
      </div>
      <div className="container mx-auto">
        <TransactionsTable from={date.from} to={date.to} columns={tableColumns} data={tableData} />
      </div>
    </div>
  );
}

export default TransactionsSection;
