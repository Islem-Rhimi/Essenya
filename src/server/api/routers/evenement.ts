// src/server/trpc/routers/evenement.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import type { Prisma } from "@prisma/client";
import { paginate, buildPaginationMeta } from "../utils/pagination";

const buildSearchWhere = (search?: string): Prisma.EvenementWhereInput => {
  if (!search) return {};
  return {
    OR: [
      { nom: { contains: search, mode: "insensitive" } },
      { lieu: { contains: search, mode: "insensitive" } },
    ],
  };
};

export const evenementRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(50).default(12),
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;
      const { skip, take } = paginate(page, pageSize);
      const where: Prisma.EvenementWhereInput = {
        ...buildSearchWhere(search),
        date: { gte: new Date() },
      };

      const [total, events] = await Promise.all([
        ctx.db.evenement.count({ where }),
        ctx.db.evenement.findMany({
          where,
          skip,
          take,
          include: { organisateur: { include: { user: true } } },
          orderBy: { date: "asc" },
        }),
      ]);

      return { data: events, meta: buildPaginationMeta(total, page, pageSize) };
    }),

  myEvents: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        pageSize: z.number().default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const vendeur = await ctx.db.vendeur.findUnique({
        where: { userId: ctx.session.user.id },
      });
      if (!vendeur) throw new TRPCError({ code: "FORBIDDEN" });

      const { skip, take } = paginate(input.page, input.pageSize);
      const where = { organisateurId: vendeur.id };

      const [total, events] = await Promise.all([
        ctx.db.evenement.count({ where }),
        ctx.db.evenement.findMany({
          where,
          skip,
          take,
          include: { reservations: true },
        }),
      ]);

      return {
        data: events,
        meta: buildPaginationMeta(total, input.page, input.pageSize),
      };
    }),
});
