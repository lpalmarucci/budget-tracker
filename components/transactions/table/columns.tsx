import { ColumnDef } from "@tanstack/table-core";
import { Transaction } from "@prisma/client";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { TransactionType } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Transaction>[] = [
  {
    id: "category",
    accessorKey: "category",
    header: "Category",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => (
      <div className="text-left font-medium flex gap-2 items-center">
        <em-emoji shortcodes={row.original.categoryIcon} size={"20"} />
        <span>{row.getValue("category")}</span>
      </div>
    ),
  },
  {
    id: "description",
    accessorKey: "description",
    header: "Description",
  },
  {
    id: "date",
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <span className="text-muted-foreground">{formatDate(row.getValue("date"))}</span>,
  },
  {
    id: "type",
    accessorKey: "type",
    header: "Type",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => {
      const type = row.getValue("type") as TransactionType;

      return (
        <Badge
          variant="outline"
          className={cn({
            "text-emerald-500 border-emerald-500 bg-emerald-800/30": type === "income",
            "text-rose-500 border-rose-500 bg-rose-800/30": type === "expense",
          })}
        >
          {type}
        </Badge>
      );
    },
  },
  {
    id: "amount",
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => <span>{formatCurrency(row.getValue("amount"))}</span>,
  },
];
