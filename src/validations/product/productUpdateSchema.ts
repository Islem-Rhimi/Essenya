import { z } from "zod";

export const categories = [
  { value: "vegetables", label: "vegetables" },
  { value: "fruits", label: "fruits" },
  { value: "grains", label: "grains" },
  { value: "dairy", label: "dairy" },
  { value: "meat", label: "meat" },
  { value: "herbs", label: "herbs" },
];

const CATEGORIES = [
  "vegetables",
  "fruits",
  "grains",
  "dairy",
  "meat",
  "herbs",
] as const;
export const categorieEnum = z.enum(CATEGORIES);
export type Categorie = (typeof CATEGORIES)[number];

export const units = [
  { value: "per lb", label: "per lb" },
  { value: "per kg", label: "per kg" },
  { value: "per dozen", label: "per dozen" },
  { value: "per piece", label: "per piece" },
  { value: "per bunch", label: "per bunch" },
  { value: "per bag", label: "per bag" },
  { value: "per box", label: "per box" },
];
const UNITS = [
  "per lb",
  "per kg",
  "per dozen",
  "per piece",
  "per bunch",
  "per bag",
  "per box",
] as const;
export const uniteEnum = z.enum(UNITS);
export type Unit = (typeof UNITS)[number];
export const predefinedTags = [
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
const STATUTS = ["in-stock", "out-of-stock", "limited"] as const;
export const statutEnum = z.enum(STATUTS);
export type Statut = (typeof STATUTS)[number];

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

export interface ProductInputErrors {
  nom: string;
  description: string;
  prix: string;
  quantite: string;
  unite: string;
  localisation: string;
  categorie: string;
  tags: string;
  statut: string;
  imageUrl: string;
  inventaire: string;
}
