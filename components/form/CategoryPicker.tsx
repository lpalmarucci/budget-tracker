"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ChevronsUpDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@prisma/client";
import * as React from "react";
import { useState } from "react";
import CreateCategoryDialog from "@/components/CreateCategoryDialog";
import { TransactionType } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";

interface CategoryPickerProps {
  type: TransactionType;
  onSelectCategory: (val: Category | null) => void;
}

function CategoryPicker({ type, onSelectCategory }: CategoryPickerProps) {
  const { data, isFetching } = useQuery<Category[]>({
    queryKey: ["categories", type],
    queryFn: () => fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState("");

  const selectedCategory = data?.find((c) => c.name === value) ?? null;

  React.useEffect(() => {
    onSelectCategory(selectedCategory);
  }, [selectedCategory]);


  if (isFetching) return <Skeleton className="w-[200px] h-[40px]" />;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn("w-[200px] justify-between", selectedCategory && "text-muted-foreground")}
        >
          {selectedCategory ? <CategoryRow category={selectedCategory} /> : "Select category"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command onSubmit={(e) => {
          e.stopPropagation()
        }}>
          <CommandInput placeholder="Search category..." />
          <CreateCategoryDialog
            type={type}
            onCreate={(newCategoryName: string) => {
              setValue(newCategoryName);
              setOpen(false);
            }}
          />
          <CommandList>
            <CommandEmpty>No Category found.</CommandEmpty>
            {data?.map((category) => (
              <CommandItem
                onSelect={(val) => {
                  setValue(val);
                  setOpen(false);
                }}
                value={category.name}
                key={`${category.name}-${category.type}-${category.userId}`}
                className="px-4 py-2 flex gap-3 items-center cursor-pointer"
              >
                <em-emoji shortcodes={category.icon} size="20" />
                <span className="-mt-1">{category.name}</span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default CategoryPicker;

function CategoryRow({ category }: { category: Category }) {
  return (
    <div className="flex items-center gap-2 truncate">
      <span role="img">
        <em-emoji shortcodes={category.icon} size="20"></em-emoji>
      </span>
      <span>{category.name}</span>
    </div>
  );
}
