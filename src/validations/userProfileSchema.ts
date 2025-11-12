import { z } from "zod";

export const userProfileSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  numTel: z
    .string()
    .regex(/^[0-9+\s()-]*$/, "Numéro de téléphone invalide")
    .optional()
    .or(z.literal("")),
  dateOfBirth: z.string().optional().or(z.literal("")),
});

export const vendorProfileSchema = z.object({
  nomBoutique: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  adresse: z.string().min(10, "L'adresse doit contenir au moins 10 caractères"),
  description: z
    .string()
    .max(1000, "La description ne peut pas dépasser 1000 caractères")
    .optional()
    .or(z.literal("")),
  images: z.string().optional(),
  tourism: z.boolean(),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;
export type VendorProfileFormData = z.infer<typeof vendorProfileSchema>;
