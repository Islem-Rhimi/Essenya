// src/server/trpc/routers/commande.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { paginate, buildPaginationMeta } from "../utils/pagination";

export const commandeRouter = createTRPCRouter({
  myOrders: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(50).default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize } = input;
      const { skip, take } = paginate(page, pageSize);
      const where = { userId: ctx.session.user.id };

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
    .input(z.object({ produitId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.commande.create({
        data: {
          produitId: input.produitId,
          userId: ctx.session.user.id,
          statut: "EN_ATTENTE",
        },
      });
    }),
});
