// src/server/trpc/routers/vendeur.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import type { Prisma } from "@prisma/client";
import { buildPaginationMeta, paginate } from "../utils/pagination";

const buildSearchWhere = (search?: string): Prisma.VendeurWhereInput => {
  if (!search) return {};
  return {
    OR: [
      { user: { name: { contains: search, mode: "insensitive" } } },
      { user: { email: { contains: search, mode: "insensitive" } } },
    ],
  };
};

export const vendeurRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(50).default(10),
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;
      const { skip, take } = paginate(page, pageSize);
      const where = buildSearchWhere(search);

      const [total, vendeur] = await Promise.all([
        ctx.db.vendeur.count({ where }),
        ctx.db.vendeur.findMany({
          where,
          skip,
          take,
          include: { user: true, produits: true, evenements: true },
          orderBy: { user: { createdAt: "desc" } },
        }),
      ]);

      return {
        data: vendeur,
        meta: buildPaginationMeta(total, page, pageSize),
      };
    }),

  myShop: protectedProcedure.query(async ({ ctx }) => {
    const vendeur = await ctx.db.vendeur.findUnique({
      where: { userId: ctx.session.user.id },
      include: { produits: true, evenements: true },
    });
    if (!vendeur) throw new TRPCError({ code: "NOT_FOUND" });
    return vendeur;
  }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        adresse: z.string().optional(),
        images: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const vendeur = await ctx.db.vendeur.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
      });
      if (!vendeur) throw new TRPCError({ code: "FORBIDDEN" });

      return ctx.db.vendeur.update({
        where: { id: input.id },
        data: input,
      });
    }),
});
