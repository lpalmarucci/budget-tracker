import { useQuery } from "@tanstack/react-query";
import { CategoriesStatsResponseType } from "@/app/api/stats/category/route";
import { OVERVIEW_QUERY_KEY } from "@/services/overview/overview.service";

export const STATS_CATEGORY_QUERY_KEY = "STATS_CATEGORY";

export function getStatsByCategory(from?: Date, to?: Date) {
  return useQuery<CategoriesStatsResponseType>({
    queryKey: [OVERVIEW_QUERY_KEY, STATS_CATEGORY_QUERY_KEY, from, to],
    queryFn: () =>
      fetch(`/api/stats/category?from=${from?.toUTCString()}&to=${to?.toUTCString()}`).then((res) => res.json()),
  });
}

export const OVERVIEW_STATS_QUERY_KEY = "STATS_QUERY_KEY";

export function getStatsByBalance(from?: Date, to?: Date) {
  return useQuery({
    queryKey: [OVERVIEW_QUERY_KEY, OVERVIEW_STATS_QUERY_KEY, from, to],
    queryFn: () =>
      fetch(`/api/stats/balance?from=${from?.toUTCString()}&to=${to?.toUTCString()}`).then((res) => res.json()),
  });
}
