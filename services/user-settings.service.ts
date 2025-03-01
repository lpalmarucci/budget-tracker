import { TransactionType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { UserSettings } from "@prisma/client";

export const USER_SETTINGS_QUERY_KEY = "USER_SETTINGS";

export function useUserSettings(type?: TransactionType) {
  return useQuery<UserSettings>({
    queryKey: [USER_SETTINGS_QUERY_KEY],
    queryFn: () => fetch("/api/user-settings").then((res) => res.json()),
  });
}
