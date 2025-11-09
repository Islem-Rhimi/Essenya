import { z } from "zod";

export const serviceUpdateSchema = z.object({
  id: z.string(),
  nom: z.string().min(1, "Product name is required"),
  types: z.string().min(1, "Service type is required"),
  tags: z.array(z.string()),
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

export type serviceUpdateSchemaType = z.infer<typeof serviceUpdateSchema>;

export interface ServiceInputErrors {
  nom: string;
  types: string;
  tags: string;
  description: string;
  imageUrl: string;
  prix: string;
}
