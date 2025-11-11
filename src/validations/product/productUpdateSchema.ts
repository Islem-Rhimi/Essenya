import { z } from "zod";

// 🌿 Catégories liées à l'agriculture et aux produits fermiers
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

// 🧾 Schéma de mise à jour d’un produit
export const productUpdateSchema = z.object({
  id: z.string(),
  nom: z.string().min(1, "Le nom du produit est requis"),
  description: z.string().min(1, "La description est requise"),
  prix: z.string(),
  quantite: z.string().min(1, "La quantité est requise"),
  unite: uniteEnum,
  localisation: z.string().min(1, "La localisation est requise"),
  categorie: categorieEnum,
  tags: z.array(z.string()),
  statut: statutEnum,
  imageUrl: z
    .string()
    .min(1, "L’image est requise")
    .refine(
      (val) =>
        val.startsWith("http://") ||
        val.startsWith("https://") ||
        val.startsWith("/"),
      { message: "Doit être une URL ou un chemin valide" },
    )
    .optional()
    .nullable(),
  inventaire: z.number().int().min(0, "L’inventaire doit être positif"),
});

export type productUpdateSchemaType = z.infer<typeof productUpdateSchema>;

// 🧩 Interface pour les erreurs
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
