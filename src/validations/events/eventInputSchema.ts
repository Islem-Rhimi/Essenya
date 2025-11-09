import { z } from "zod";

export const eventInputSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Le titre est requis"),
  localisation: z.string().min(1, "La localisation est requise"),
  description: z.string().optional(),
  image: z
    .string()
    .refine(
      (val) => {
        if (!val) return true;
        return (
          val.startsWith("http://") ||
          val.startsWith("https://") ||
          val.startsWith("/")
        );
      },
      { message: "Must be a valid URL or path" }
    )
    .optional(),
  date: z.string().min(1, "La date est requise"),
  time: z.string().min(1, "L'heure est requise"),
  color: z.string().min(1, "La couleur est requise"), // Changed: removed .optional()
});

export type eventInputSchemaType = z.infer<typeof eventInputSchema>;