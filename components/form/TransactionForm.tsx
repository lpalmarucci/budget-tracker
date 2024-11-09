"use client";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { TransactionSchema, type TransactionSchemaType } from "@/lib/schema/Transaction.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/SubmitButton";
import * as React from "react";
import { createTransaction } from "@/lib/actions/transaction";
import CategoryPicker from "@/components/form/CategoryPicker";
import { TransactionType } from "@/lib/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

interface TransactionFormProps {
  type: TransactionType;
  onTransactionCreated?: () => void;
}

export function TransactionForm({ type, onTransactionCreated }: TransactionFormProps) {
  const form = useForm<TransactionSchemaType>({
    resolver: zodResolver(TransactionSchema),
    defaultValues: {
      description: "",
      amount: 0,
      date: undefined,
      category: undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      toast({ variant: "success", description: "Transaction added successfully 🎉", itemID: "create-transaction" });
      form.reset();
      onTransactionCreated?.();
    },
    onError: (err) => {
      toast({ description: "Something went wrong ❌", variant: "destructive" });
    },
  });

  function onSubmit(values: TransactionSchemaType) {
    mutation.mutate({ type, body: values });
  }

  return (
    <Form {...form}>
      <form id="transaction-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Transaction description (optional)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>Transaction amount (required)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2 items-center">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <CategoryPicker
                    type={type}
                    onSelectCategory={(val) => {
                      form.setValue("category", val);
                      field.onChange(val);
                    }}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>Select a category (required)</FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? formatDate(field.value) : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
                <FormDescription>Transaction date</FormDescription>
              </FormItem>
            )}
          />
        </div>
        <SubmitButton formId="transaction-form" disabled={!form.formState.isValid}>
          Create
        </SubmitButton>
      </form>
    </Form>
  );
}
