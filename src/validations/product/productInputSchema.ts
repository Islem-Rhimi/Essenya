import { z } from "zod";

/* 🥕 Catégories */
export const categories = [
  { value: "Légumes", label: "Légumes" },
  { value: "Fruits", label: "Fruits" },
  { value: "Céréales", label: "Céréales" },
  { value: "Produits laitiers", label: "Produits laitiers" },
  { value: "Viande", label: "Viande" },
  { value: "Herbes", label: "Herbes" },
];

const CATEGORIES = [
  "Légumes",
  "Fruits",
  "Céréales",
  "Produits laitiers",
  "Viande",
  "Herbes",
] as const;
export const categorieEnum = z.enum(CATEGORIES);
export type Categorie = (typeof CATEGORIES)[number];

/* ⚖️ Unités */
export const units = [
  { value: "par livre", label: "par livre" },
  { value: "par kilogramme", label: "par kilogramme" },
  { value: "par douzaine", label: "par douzaine" },
  { value: "par pièce", label: "par pièce" },
  { value: "par botte", label: "par botte" },
  { value: "par sac", label: "par sac" },
  { value: "par boîte", label: "par boîte" },
];
const UNITS = [
  "par livre",
  "par kilogramme",
  "par douzaine",
  "par pièce",
  "par botte",
  "par sac",
  "par boîte",
] as const;
export const uniteEnum = z.enum(UNITS);
export type Unite = (typeof UNITS)[number];

/* 🏷️ Étiquettes prédéfinies */
export const predefinedTags = [
  "Bio",
  "Local",
  "Saisonnière",
  "Récolte fraîche",
  "Sans pesticides",
  "Sans OGM",
  "Élevage en plein air",
  "Alimentation naturelle",
  "Agriculture durable",
  "Éco-responsable",
  "Fait à la ferme",
  "Production artisanale",
  "Circuit court",
  "Commerce équitable",
  "Traditionnel",
  "Fermier",
  "Récolte manuelle",
  "Produit de montagne",
  "Produit de la mer",
  "Nourri à l’herbe",
];

/* 📦 Statuts du produit */
const STATUTS = ["en-stock", "rupture", "limité"] as const;
export const statutEnum = z.enum(STATUTS);
export type Statut = (typeof STATUTS)[number];

/* 🧾 Validation du formulaire produit */
export const productInputSchema = z.object({
  nom: z.string().min(1, "Le nom du produit est obligatoire."),
  description: z.string().min(1, "La description est obligatoire."),
  prix: z.string().min(1, "Le prix est obligatoire."),
  quantite: z.string().min(1, "La quantité est obligatoire."),
  unite: uniteEnum,
  localisation: z.string().min(1, "La localisation est obligatoire."),
  categorie: categorieEnum,
  tags: z.array(z.string()).optional(),
  statut: statutEnum,
  imageUrl: z
    .string()
    .min(1, "L’image est obligatoire.")
    .refine(
      (val) =>
        val.startsWith("http://") ||
        val.startsWith("https://") ||
        val.startsWith("/"),
      { message: "L’URL ou le chemin de l’image n’est pas valide." },
    )
    .optional()
    .nullable(),
  inventaire: z.number().int().min(0, "Le stock doit être un nombre positif."),
});

export type ProductInputSchemaType = z.infer<typeof productInputSchema>;

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
