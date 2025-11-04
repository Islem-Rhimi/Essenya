// src/server/trpc/routers/paiement.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { paginate, buildPaginationMeta } from "../utils/pagination";

export const paiementRouter = createTRPCRouter({
  myPayments: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(50).default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize } = input;
      const { skip, take } = paginate(page, pageSize);
      const where = { commande: { userId: ctx.session.user.id } };

      const [total, payments] = await Promise.all([
        ctx.db.paiement.count({ where }),
        ctx.db.paiement.findMany({
          where,
          skip,
          take,
          include: { commande: true },
          orderBy: { date: "desc" },
        }),
      ]);

      return {
        data: payments,
        meta: buildPaginationMeta(total, page, pageSize),
      };
    }),
});
