import { z } from "zod";

export const venduerInputSchema = z.object({
  nomBoutique: z.string().min(3, "Minimum 3 caractères"),
  adresse: z.string().min(10, "Adresse complète"),
  description: z.string().optional(),
  images: z
    .string()
    .min(1, "Image is required")
    .refine(
      (val) => {
        // Accept full URLs or relative paths starting with /
        return (
          val.startsWith("http://") ||
          val.startsWith("https://") ||
          val.startsWith("/")
        );
      },
      { message: "Must be a valid URL or path" },
    )
    .optional()
    .nullable(),
});

export type venduerInputSchemaType = z.infer<typeof venduerInputSchema>;
