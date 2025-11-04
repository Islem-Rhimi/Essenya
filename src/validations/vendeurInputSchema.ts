import { z } from "zod";

export const venduerInputSchema = z.object({
  nomBoutique: z.string().min(3, "Minimum 3 caractères"),
  adresse: z.string().min(10, "Adresse complète"),
  description: z.string().min(20, "Décrivez votre activité"),
  images: z.string().url().optional().or(z.literal("")),
});

export type venduerInputSchemaType = z.infer<typeof venduerInputSchema>;
