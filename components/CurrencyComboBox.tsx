"use client";

import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CURRENCIES, Currency } from "@/lib/currencies";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { updateUserCurrency } from "@/lib/actions/userSettings";
import { UserSettings } from "@prisma/client";

export function CurrencyComboBox() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedCurrency, setSelectedCurrency] = React.useState<Currency | null>(null);
  const { toast } = useToast();

  const { data, isFetching } = useQuery<UserSettings>({
    queryKey: ["userSettings"],
    queryFn: () => fetch("/api/user-settings").then((res) => res.json()),
  });

  const mutation = useMutation({
    mutationFn: updateUserCurrency,
    onSuccess: (data: UserSettings) => {
      toast({ description: "Currency updated successfully 🎉", itemID: "update-currency" });
      setSelectedCurrency(CURRENCIES.find((c) => c.value === data.currency) || null);
    },
    onError: (err) => {
      toast({ description: "Something went wrong", variant: "destructive" });
    },
  });

  const selectOption = React.useCallback(
    (currency: Currency | null) => {
      if (!currency) {
        toast({ variant: "destructive", description: "Please select a currency." });
        return;
      }
      toast({ description: "Updating currency...", itemID: "update-currency" });

      mutation.mutate({ userId: "1", currency: currency.value });
    },
    [mutation],
  );

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start" disabled={isFetching}>
            {selectedCurrency ? <>{selectedCurrency.label}</> : <>+ Set currency</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <OptionList setOpen={setOpen} setSelectedOption={setSelectedCurrency} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full justify-start" disabled={isFetching}>
          {selectedCurrency ? <>{selectedCurrency.label}</> : <>+ Set currency</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <OptionList setOpen={setOpen} setSelectedOption={setSelectedCurrency} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function OptionList({
  setOpen,
  setSelectedOption,
}: {
  setOpen: (open: boolean) => void;
  setSelectedOption: (currency: Currency | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter status..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {CURRENCIES.map((status) => (
            <CommandItem
              key={status.value}
              value={status.value}
              onSelect={(value) => {
                setSelectedOption(CURRENCIES.find((currency) => currency.value === value) || null);
                setOpen(false);
              }}
            >
              {status.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
