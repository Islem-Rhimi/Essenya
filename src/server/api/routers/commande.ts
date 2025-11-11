// src/server/trpc/routers/commande.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { paginate, buildPaginationMeta } from "../utils/pagination";
import { TRPCError } from "@trpc/server";
import {
  cancelOrderSchema,
  createCommandeWithPaymentSchema,
  getMyOrdersSchema,
  getOrderByIdSchema,
} from "~/validations/commades/createCommandeWithPaymentSchema ";
import type { Prisma } from "@prisma/client";

export const commandeRouter = createTRPCRouter({
  vendeurOrders: protectedProcedure
    .input(getMyOrdersSchema) // ✅ reuse same pagination & filter schema
    .query(async ({ ctx, input }) => {
      const { page, pageSize, statut } = input;
      const { skip, take } = paginate(page, pageSize);

      const where: Prisma.CommandeWhereInput = {
        produit: {
          vendeur: { userId: { equals: ctx.session.user.id } },
        },
        ...(statut && statut !== "TOUS" && { statut }),
      };

      const [total, orders] = await Promise.all([
        ctx.db.commande.count({ where }),
        ctx.db.commande.findMany({
          where,
          skip,
          take,
          include: { produit: true, paiement: true, user: true }, // ✅ include buyer info
          orderBy: { date: "desc" },
        }),
      ]);

      return {
        data: orders,
        meta: buildPaginationMeta(total, page, pageSize),
      };
    }),

  updateStatut: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
        statut: z.enum([
          "EN_ATTENTE",
          "CONFIRMEE",
          "EN_COURS",
          "LIVREE",
          "ANNULEE",
        ]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.commande.update({
        where: { id: input.orderId },
        data: { statut: input.statut },
      });
    }),

  myOrders: protectedProcedure
    .input(getMyOrdersSchema)
    .query(async ({ ctx, input }) => {
      const { page, pageSize, statut } = input;
      const { skip, take } = paginate(page, pageSize);

      const where = {
        userId: ctx.session.user.id,
        ...(statut && statut !== "TOUS" && { statut }),
      };

      const [total, orders] = await Promise.all([
        ctx.db.commande.count({ where }),
        ctx.db.commande.findMany({
          where,
          skip,
          take,
          include: { produit: true, paiement: true },
          orderBy: { date: "desc" },
        }),
      ]);

      return { data: orders, meta: buildPaginationMeta(total, page, pageSize) };
    }),

  create: protectedProcedure
    .input(
      z.object({
        produitId: z.string(),
        quantite: z.number(),
        adresseLivraison: z.string(),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.commande.create({
        data: {
          produitId: input.produitId,
          quantite: input.quantite,
          adresseLivraison: input.adresseLivraison,
          notes: input.notes,
          userId: ctx.session.user.id,
          statut: "EN_ATTENTE",
        },
      });
    }),

  createWithPayment: protectedProcedure
    .input(createCommandeWithPaymentSchema)
    .mutation(async ({ ctx, input }) => {
      const { produitId, quantite, montant, adresseLivraison, notes } = input;

      // Check product availability
      const product = await ctx.db.produits.findUnique({
        where: { id: produitId },
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Produit non trouvé",
        });
      }

      if (product.quantite < quantite) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Stock insuffisant. Disponible: ${product.quantite}`,
        });
      }

      // Create order and payment in a transaction
      const result = await ctx.db.$transaction(async (tx) => {
        // Create the Commande
        const commande = await tx.commande.create({
          data: {
            quantite: quantite,
            adresseLivraison: adresseLivraison,
            statut: "EN_ATTENTE",
            notes: notes ?? "",
            userId: ctx.session.user.id,
            produitId: produitId,
          },
        });

        // Create the Paiement
        const paiement = await tx.paiement.create({
          data: {
            montant: montant,
            commandeId: commande.id,
          },
        });

        // Update product inventory
        await tx.produits.update({
          where: { id: produitId },
          data: {
            quantite: {
              decrement: quantite,
            },
          },
        });

        return { commande, paiement };
      });

      return {
        success: true,
        message: "Commande créée avec succès",
        data: result,
      };
    }),

  // Get single order details
  getOrderById: protectedProcedure
    .input(getOrderByIdSchema)
    .query(async ({ ctx, input }) => {
      const order = await ctx.db.commande.findFirst({
        where: {
          id: input.orderId,
          userId: ctx.session.user.id, // Ensure user owns the order
        },
        include: {
          produit: true,
          paiement: true,
        },
      });

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Commande non trouvée",
        });
      }

      return order;
    }),

  // Cancel order (if needed)
  cancelOrder: protectedProcedure
    .input(cancelOrderSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if order exists and belongs to user
      const order = await ctx.db.commande.findFirst({
        where: {
          id: input.orderId,
          userId: ctx.session.user.id,
        },
        include: {
          produit: true,
        },
      });

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Commande non trouvée",
        });
      }

      // Only allow cancellation if order is still pending
      if (order.statut !== "EN_ATTENTE") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Seules les commandes en attente peuvent être annulées",
        });
      }

      // Cancel order and restore inventory in a transaction
      const result = await ctx.db.$transaction(async (tx) => {
        // Update order status
        const cancelledOrder = await tx.commande.update({
          where: { id: input.orderId },
          data: { statut: "ANNULEE" },
        });
        await tx.produits.update({
          where: { id: order.produitId },
          data: {
            quantite: {
              increment: order.quantite,
            },
          },
        });

        return cancelledOrder;
      });

      return {
        success: true,
        message: "Commande annulée avec succès",
        data: result,
      };
    }),
});
