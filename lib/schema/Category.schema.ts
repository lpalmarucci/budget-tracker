import { z } from "zod";

export const CategorySchema = z.object({
  name: z.string().min(1),
  icon: z.string(),
  type: z.enum(["income", "expense"]),
});

export type CategorySchemaType = z.infer<typeof CategorySchema>;
