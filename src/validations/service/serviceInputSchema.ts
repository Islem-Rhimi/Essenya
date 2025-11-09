import { z } from "zod";

export const predefinedTypes = [
  "Bio",
  "Local",
  "Artisanal",
  "Fait main",
  "Édition limitée",
  "Mariage",
  "Luxe",
  "Éco-responsable",
  "Vintage",
];

export const serviceInputSchema = z.object({
  nom: z.string().min(1, "Product name is required"),
  types: z.array(z.string()),
  description: z.string().min(1, "Description is required"),
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
  prix: z.string(),
});

export type serviceInputSchemaType = z.infer<typeof serviceInputSchema>;

export interface ServiceInputErrors {
  nom: string;
  types: string;
  description: string;
  imageUrl: string;
  prix: string;
}
