"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import FacetedFilter from "@/components/transactions/table/FacetedFilter";
import React, { useMemo, useState } from "react";
import { Transaction } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { TransactionType } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { TrashIcon } from "@radix-ui/react-icons";
import DeleteTransactionDialog from "@/components/dialog/DeleteTransactionDialog";

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
  {
    id: "actions",
    cell: ({ row }) => {
      const transaction = row.original;
      console.log({ transaction });
      return <RowActions id={transaction.id} />;
    },
  },
];

interface TransactionsTableProps {
  columns: ColumnDef<Transaction>[];
  data: Transaction[];
  from?: Date;
  to?: Date;
}

export function TransactionsTable({ columns, data }: TransactionsTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const categoriesOptions = useMemo(() => {
    const categoriesMap = new Map();
    data?.forEach((transaction) => {
      categoriesMap.set(transaction.category, {
        value: transaction.category,
        icon: transaction.categoryIcon,
        label: transaction.category,
      });
    });
    const uniqueCategories = new Set(categoriesMap.values());
    return Array.from(uniqueCategories);
  }, [data]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <FacetedFilter title="Category" column={table.getColumn("category")} options={categoriesOptions} />
        <FacetedFilter
          title={"Type"}
          column={table.getColumn("type")}
          options={[
            {
              label: "Expense",
              value: "expense",
            },
            {
              label: "Income",
              value: "income",
            },
          ]}
        />

        <Button variant="outline" size="sm" onClick={() => table?.resetColumnFilters()}>
          Reset
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export function RowActions({ id }: { id: string }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <>
      <DropdownMenu open={showDropdown} onOpenChange={setShowDropdown}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 " onClick={() => setShowDropdown(true)}>
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={(e) => {
              setShowDropdown(false);
              setShowDeleteDialog((prev) => !prev);
            }}
          >
            <TrashIcon className="h-4 w-4 text-muted-foreground" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteTransactionDialog open={showDeleteDialog} setOpen={setShowDeleteDialog} transactionId={id} />
    </>
  );
}
