import { z } from "zod";
import { categorieEnum, statutEnum, uniteEnum } from "./productInputSchema";

export const productUpdateSchema = z.object({
  id: z.string(),
  nom: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  prix: z.string(),
  quantite: z.string().min(1, "quantite is required"),
  unite: uniteEnum,
  localisation: z.string().min(1, "Location is required"),
  categorie: categorieEnum,
  tags: z.array(z.string()),
  statut: statutEnum,
  imageUrl: z
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
  inventaire: z.number().int().min(0, "Inventory must be non-negative"),
});

export type productUpdateSchemaType = z.infer<typeof productUpdateSchema>;
