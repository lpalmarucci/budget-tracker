import { Transaction } from "@prisma/client";
import CategoryFilter from "@/components/transactions/table/filters/CategoryFilter";

interface TransactionsTableFiltersProps {
  data: Transaction[];
  onFilterChanges: (categories: string[]) => void;
}

const TransactionsTableFilters = ({ data, onFilterChanges }: TransactionsTableFiltersProps) => {
  return (
    <div className="flex w-full items-center">
      <div className="flex items-center gap-4">
        <CategoryFilter data={data} onCategoriesChange={onFilterChanges} />
      </div>
    </div>
  );
};

export default TransactionsTableFilters;
