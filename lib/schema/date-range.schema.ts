import z from "zod";

export const DateRangeSchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
});

export type OverviewSchemaType = z.infer<typeof DateRangeSchema>;
