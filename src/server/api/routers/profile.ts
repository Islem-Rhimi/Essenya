// src/server/trpc/routers/user.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const profileRouter = createTRPCRouter({
  // Get current user's profile with vendor data
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      include: {
        vendeurProfile: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Utilisateur non trouvé",
      });
    }

    return user;
  }),

  // Update user profile
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").optional(),
        numTel: z
          .string()
          .regex(/^[0-9+\s()-]+$/, "Numéro de téléphone invalide")
          .optional(),
        dateOfBirth: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: input,
      });
    }),

  // Update vendor profile (only if user has vendor profile)
  updateVendorProfile: protectedProcedure
    .input(
      z.object({
        nomBoutique: z.string().min(3, "Le nom de boutique doit contenir au moins 3 caractères").optional(),
        adresse: z.string().min(10, "L'adresse doit contenir au moins 10 caractères").optional(),
        description: z.string().max(1000, "La description ne peut pas dépasser 1000 caractères").optional(),
        images: z.string().url("URL d'image invalide").optional(),
        tourism: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user has vendor profile
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        include: { vendeurProfile: true },
      });

      if (!user?.vendeurProfile) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Vous n'avez pas de profil vendeur",
        });
      }

      return ctx.db.vendeur.update({
        where: { userId: ctx.session.user.id },
        data: input,
      });
    }),

  // Create vendor profile
  createVendorProfile: protectedProcedure
    .input(
      z.object({
        nomBoutique: z.string().min(3, "Le nom de boutique doit contenir au moins 3 caractères"),
        adresse: z.string().min(10, "L'adresse doit contenir au moins 10 caractères"),
        description: z.string().max(1000, "La description ne peut pas dépasser 1000 caractères").optional(),
        images: z.string().url("URL d'image invalide").optional(),
        tourism: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user already has vendor profile
      const existingVendor = await ctx.db.vendeur.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (existingVendor) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Vous avez déjà un profil vendeur",
        });
      }

      return ctx.db.vendeur.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });
    }),

  // Get profile statistics
  getProfileStats: protectedProcedure.query(async ({ ctx }) => {
    const [totalOrders, pendingOrders, completedOrders] = await Promise.all([
      ctx.db.commande.count({
        where: { userId: ctx.session.user.id },
      }),
      ctx.db.commande.count({
        where: {
          userId: ctx.session.user.id,
          statut: { in: ["EN_ATTENTE", "CONFIRMEE", "EN_COURS"] },
        },
      }),
      ctx.db.commande.count({
        where: {
          userId: ctx.session.user.id,
          statut: "LIVREE",
        },
      }),
    ]);

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
    };
  }),

  // Change password (if user has password)
  changePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string().min(1, "Mot de passe actuel requis"),
        newPassword: z.string().min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { password: true },
      });

      if (!user?.password) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Vous utilisez une connexion sociale (pas de mot de passe)",
        });
      }

      // Import bcrypt for password hashing
      const bcrypt = await import("bcryptjs");
      
      const isValid = await bcrypt.compare(input.currentPassword, user.password);
      if (!isValid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Mot de passe actuel incorrect",
        });
      }

      const hashedPassword = await bcrypt.hash(input.newPassword, 10);

      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { password: hashedPassword },
      });

      return { success: true, message: "Mot de passe mis à jour avec succès" };
    }),
});