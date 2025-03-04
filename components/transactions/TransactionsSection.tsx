"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import { subMonths } from "date-fns";
import { TransactionsTable } from "@/components/transactions/table";
import { columns } from "@/components/transactions/table/columns";
import { Skeleton } from "@/components/ui/skeleton";
import { getTransactions } from "@/services/transactions.service";
import { Section, SectionContent, SectionHeader } from "@/components/Section";

function TransactionsSection() {
  const [date, setDate] = useState<DateRange>({
    from: subMonths(new Date(), 1),
    to: new Date(),
  });

  const { data, isFetching } = getTransactions(date);

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
    <Section>
      <SectionHeader>
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
      </SectionHeader>
      <SectionContent>
        <TransactionsTable from={date.from} to={date.to} columns={tableColumns} data={tableData} />
      </SectionContent>
    </Section>
  );
}

export default TransactionsSection;
