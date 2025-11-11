// src/lib/validations/commande.ts
import { z } from "zod";

// Create order with payment schema
export const createCommandeWithPaymentSchema = z.object({
  produitId: z.string().cuid("ID produit invalide"),
  quantite: z
    .number()
    .min(1, "La quantité est requise")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "La quantité doit être un nombre positif",
    }),
  montant: z
    .string()
    .min(1, "Le montant est requis")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Le montant doit être un nombre positif",
    }),
  adresseLivraison: z
    .string()
    .min(3, "L'adresse doit contenir au moins 10 caractères")
    .max(500, "L'adresse ne peut pas dépasser 500 caractères"),
  methodePaiement: z.enum(["carte", "especes", "virement", "mobile"], {
    errorMap: () => ({ message: "Méthode de paiement invalide" }),
  }),
  notes: z
    .string()
    .max(1000, "Les notes ne peuvent pas dépasser 1000 caractères")
    .optional(),
});

// Simple order creation schema
export const createCommandeSchema = z.object({
  produitId: z.string().cuid("ID produit invalide"),
  quantite: z
    .number()
    .min(1, "La quantité est requise")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "La quantité doit être un nombre positif",
    }),
  adresseLivraison: z
    .string()
    .min(3, "L'adresse doit contenir au moins 10 caractères")
    .max(500, "L'adresse ne peut pas dépasser 500 caractères"),
  notes: z
    .string()
    .max(1000, "Les notes ne peuvent pas dépasser 1000 caractères")
    .optional(),
});

// Get orders with pagination schema
export const getMyOrdersSchema = z.object({
  page: z.number().min(1, "La page doit être au moins 1").default(1),
  pageSize: z
    .number()
    .min(1, "La taille de page doit être au moins 1")
    .max(50, "La taille de page ne peut pas dépasser 50")
    .default(10),
  statut: z
    .enum(["EN_ATTENTE", "CONFIRMEE", "EN_COURS", "LIVREE", "ANNULEE", "TOUS"])
    .optional(),
});

// Get single order schema
export const getOrderByIdSchema = z.object({
  orderId: z.string().cuid("ID commande invalide"),
});

// Cancel order schema
export const cancelOrderSchema = z.object({
  orderId: z.string().cuid("ID commande invalide"),
});

// Update order status schema (for admin/vendor)
export const updateOrderStatusSchema = z.object({
  orderId: z.string().cuid("ID commande invalide"),
  statut: z.enum(["EN_ATTENTE", "CONFIRMEE", "EN_COURS", "LIVREE", "ANNULEE"]),
});

// Update delivery address schema
export const updateDeliveryAddressSchema = z.object({
  orderId: z.string().cuid("ID commande invalide"),
  adresseLivraison: z
    .string()
    .min(3, "L'adresse doit contenir au moins 10 caractères")
    .max(500, "L'adresse ne peut pas dépasser 500 caractères"),
});

// Types exported for use in components
export type CreateCommandeWithPaymentInput = z.infer<
  typeof createCommandeWithPaymentSchema
>;
export type CreateCommandeInput = z.infer<typeof createCommandeSchema>;
export type GetMyOrdersInput = z.infer<typeof getMyOrdersSchema>;
export type GetOrderByIdInput = z.infer<typeof getOrderByIdSchema>;
export type CancelOrderInput = z.infer<typeof cancelOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type UpdateDeliveryAddressInput = z.infer<
  typeof updateDeliveryAddressSchema
>;
