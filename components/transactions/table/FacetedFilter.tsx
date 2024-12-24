import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Column } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface FacetedFilterProps<TData> {
  title: string;
  column?: Column<TData>;
  options: {
    icon?: string;
    label: string;
    value: string;
  }[];
}

function FacetedFilter<TData extends unknown>({ title, column, options }: FacetedFilterProps<TData>) {
  const [open, setOpen] = useState<boolean>(false);
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  return (
    <div className="flex items-center gap-2 my-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" role="combobox" className={cn("justify-start border-2 pl-2")}>
            <PlusCircledIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            {title}
            {selectedValues.size > 0 && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                  {selectedValues.size}
                </Badge>
                <div className="hidden space-x-1 lg:flex">
                  {selectedValues.size > 2 ? (
                    <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                      {selectedValues.size} selected
                    </Badge>
                  ) : (
                    options
                      .filter((option) => selectedValues.has(option.value))
                      .map((option) => (
                        <Badge variant="secondary" key={option.value} className="rounded-sm px-1 font-normal">
                          {option.label}
                        </Badge>
                      ))
                  )}
                </div>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className=" p-0" align={"start"}>
          <Command
            onSubmit={(e) => {
              e.stopPropagation();
            }}
          >
            <CommandInput placeholder="Search value..." />
            <CommandList>
              <CommandEmpty>No Category found.</CommandEmpty>
              {options?.map(({ label, value, icon }, idx) => {
                const isSelected = selectedValues.has(value);
                return (
                  <CommandItem
                    value={value}
                    key={`${label}-${idx}`}
                    className="px-4 py-2 flex gap-3 items-center cursor-pointer"
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        if (checked) selectedValues.add(value);
                        else selectedValues.delete(value);
                        const filterValues = Array.from(selectedValues);
                        column?.setFilterValue(filterValues);
                      }}
                    />
                    {icon && <em-emoji shortcodes={icon} size="20" />}
                    <span>{label}</span>
                  </CommandItem>
                );
              })}
              <Button variant="ghost" className="w-full" onClick={() => column?.setFilterValue(undefined)}>
                Clear filters
              </Button>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default FacetedFilter;
