import React, { useMemo, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Transaction } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Badge } from "@/components/ui/badge";

interface CategoryFilterProps {
  data: Transaction[];
  onCategoriesChange: (ids: string[]) => void;
}

type Category = {
  name: string;
  icon: string;
  count: number;
};

function CategoryFilter({ data, onCategoriesChange }: CategoryFilterProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set(data.map((d) => d.category)));
  const categories = useMemo(() => {
    return data.reduce((prev: Category[], transaction) => {
      const categoryIdx = prev.findIndex((d) => d.name === transaction.category);
      if (categoryIdx >= 0) {
        prev[categoryIdx].count += 1;
        return prev;
      }
      return [...prev, { name: transaction.category, icon: transaction.categoryIcon, count: 0 }];
    }, []);
  }, [data]);

  return (
    <div className="flex items-center gap-2 my-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" role="combobox" className={cn("justify-start border-2 pl-2")}>
            <PlusCircledIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            categories
          </Button>
        </PopoverTrigger>
        <PopoverContent className=" p-0" align={"start"}>
          <Command
            onSubmit={(e) => {
              e.stopPropagation();
            }}
          >
            <CommandInput placeholder="Search category..." />
            <CommandList>
              <CommandEmpty>No Category found.</CommandEmpty>
              {categories?.map((category) => (
                <CommandItem
                  value={category.name}
                  key={`${category.name}-${category.icon}`}
                  className="px-4 py-2 flex gap-3 items-center cursor-pointer"
                >
                  <Checkbox
                    checked={selectedCategories.has(category.name)}
                    onCheckedChange={(checked) => {
                      if (checked) setSelectedCategories((prev) => new Set([...prev, category.name]));
                      else setSelectedCategories((prev) => new Set([...prev].filter((c) => c !== category.name)));
                      onCategoriesChange(Array.from(selectedCategories));
                    }}
                  />
                  <em-emoji shortcodes={category.icon} size="20" />
                  <span className="-mt-1">{category.name}</span>
                </CommandItem>
              ))}
              <Button variant="ghost" className="w-full" onClick={() => setSelectedCategories(() => new Set())}>
                Clear filters
              </Button>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {Array.from(selectedCategories).map((name) => (
        <Badge variant="secondary" className="px-4 py-2">
          {name}
        </Badge>
      ))}
    </div>
  );
}

export default CategoryFilter;
