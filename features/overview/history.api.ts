import { useQuery } from "@tanstack/react-query";
import { HistoryData } from "@/app/api/history/route";
import { PeriodHistoryType, TimeframeHistoryType } from "@/components/overview/HistoryPeriodSelector";
import { OVERVIEW_QUERY_KEY } from "@/features/overview/overview.api";

export const HISTORY_QUERY_KEY = "HISTORY";

export function useHistory(timeframe: TimeframeHistoryType, period: PeriodHistoryType) {
  return useQuery<HistoryData[]>({
    queryKey: [OVERVIEW_QUERY_KEY, HISTORY_QUERY_KEY, timeframe, period],
    queryFn: () =>
      fetch(`/api/history?timeframe=${timeframe}&year=${period.year}&month=${period.month}`).then((res) => res.json()),
  });
}
