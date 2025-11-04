// src/server/trpc/routers/demandeService.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { paginate, buildPaginationMeta } from "../utils/pagination";

export const demandeServiceRouter = createTRPCRouter({
  myRequests: protectedProcedure
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

      const [total, requests] = await Promise.all([
        ctx.db.demandeService.count({ where }),
        ctx.db.demandeService.findMany({
          where,
          skip,
          take,
          include: { service: true },
          orderBy: { date: "desc" },
        }),
      ]);

      return {
        data: requests,
        meta: buildPaginationMeta(total, page, pageSize),
      };
    }),

  create: protectedProcedure
    .input(z.object({ serviceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.demandeService.create({
        data: {
          serviceId: input.serviceId,
          userId: ctx.session.user.id,
          statut: "NOUVELLE",
        },
      });
    }),
});
