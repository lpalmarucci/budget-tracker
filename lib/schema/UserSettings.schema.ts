import * as z from "zod";
import { CURRENCIES } from "@/lib/currencies";

export const UpdateUserCurrencySchema = z.object({
  currency: z.custom<string>((value) => {
    const found = CURRENCIES.some((x) => x.value === value);

    if (!found) throw new Error(`invalid currency: ${value}`);

    return value;
  }),
});
