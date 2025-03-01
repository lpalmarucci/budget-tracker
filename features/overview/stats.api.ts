import { useQuery } from "@tanstack/react-query";
import { OVERVIEW_QUERY_KEY } from "@/features/overview/overview.api";

export const OVERVIEW_STATS_QUERY_KEY = "STATS_QUERY_KEY";

export function useOverviewStats(from?: Date, to?: Date) {
  return useQuery({
    queryKey: [OVERVIEW_QUERY_KEY, OVERVIEW_STATS_QUERY_KEY, from, to],
    queryFn: () =>
      fetch(`/api/stats/balance?from=${from?.toUTCString()}&to=${to?.toUTCString()}`).then((res) => res.json()),
  });
}
