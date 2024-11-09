"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { DialogBody } from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import { TransactionForm } from "@/components/form/TransactionForm";
import { TransactionType } from "@/lib/types";
import { useState } from "react";

type CreateTransactionDialogProps = {
  type: TransactionType;
  trigger: React.ReactNode;
};

export default function CreateTransactionDialog({ type, trigger }: CreateTransactionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild className="w-full md:w-auto">
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <span className='"text-2xl" font-bold tracking-tighter'>
              Create new{" "}
              <span
                className={cn(
                  "bg-gradient-to-t bg-clip-text text-transparent",
                  type === "income" ? "from-emerald-700 to-emerald-400" : "from-rose-700 to-rose-400",
                )}
              >
                {type}
              </span>
            </span>
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <TransactionForm type={type} onTransactionCreated={() => setIsOpen(false)} />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
