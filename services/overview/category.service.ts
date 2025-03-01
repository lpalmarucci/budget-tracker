import { useQuery } from "@tanstack/react-query";
import { Category } from "@prisma/client";
import { TransactionType } from "@/lib/types";

export const CATEGORY_QUERY_KEY = "STATS_QUERY_KEY";

export function getCategoryStats(type?: TransactionType) {
  return useQuery<Category[]>({
    queryKey: [CATEGORY_QUERY_KEY, type],
    queryFn: () => fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });
}
