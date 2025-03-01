import { useQuery } from "@tanstack/react-query";
import { OVERVIEW_QUERY_KEY } from "@/features/overview/overview.api";
import { CategoriesStatsResponseType } from "@/app/api/stats/category/route";

export const STATS_CATEGORY_QUERY_KEY = "STATS_CATEGORY";

export function useStatsCategory(from?: Date, to?: Date) {
  return useQuery<CategoriesStatsResponseType>({
    queryKey: [OVERVIEW_QUERY_KEY, STATS_CATEGORY_QUERY_KEY, from, to],
    queryFn: () =>
      fetch(`/api/stats/category?from=${from?.toUTCString()}&to=${to?.toUTCString()}`).then((res) => res.json()),
  });
}
