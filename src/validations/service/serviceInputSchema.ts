import { z } from "zod";

export const predefinedTags = [
  "Equipment",
  "Heavy Machinery",
  "Seasonal Work",
  "Harvesting",
  "Livestock",
  "Emergency Care",
  "Installation",
  "Irrigation",
  "Testing",
  "Analysis",
];

export const serviceInputSchema = z.object({
  nom: z.string().min(1, "Service name is required"),
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

export type serviceInputSchemaType = z.infer<typeof serviceInputSchema>;

export interface ServiceInputErrors {
  nom: string;
  types: string;
  tags: string;
  description: string;
  imageUrl: string;
  prix: string;
}
