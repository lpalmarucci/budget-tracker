import { z } from "zod";

export const TransactionSchema = z.object({
  description: z.string(),
  amount: z.coerce.number().positive(),
  date: z.date(),
  category: z.string().min(1),
});

export type TransactionSchemaType = z.infer<typeof TransactionSchema>;
