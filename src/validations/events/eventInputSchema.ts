import { z } from "zod";

export const eventInputSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  date: z.string(),
  color: z.string().optional(),
});

export type eventInputSchemaType = z.infer<typeof eventInputSchema>;
