import { useQuery } from "@tanstack/react-query";
import { type DateRange } from "react-day-picker";

export const TRANSACTIONS_QUERY_KEY = "transactions";

export function getTransactions(date: DateRange) {
  return useQuery({
    queryKey: [TRANSACTIONS_QUERY_KEY, date],
    queryFn: () =>
      fetch(`/api/transactions?from=${date.from?.toUTCString()}&to=${date.to?.toUTCString()}`).then((res) =>
        res.json(),
      ),
  });
}
