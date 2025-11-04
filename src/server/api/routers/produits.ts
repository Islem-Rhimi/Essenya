// src/server/trpc/routers/produits.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import type { Prisma } from "@prisma/client";
import { paginate, buildPaginationMeta } from "../utils/pagination";

const buildSearchWhere = (search?: string): Prisma.ProduitsWhereInput => {
  if (!search) return {};
  return {
    OR: [
      { nom: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { categorie: { contains: search, mode: "insensitive" } },
    ],
  };
};

export const produitsRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(50).default(12),
        search: z.string().optional(),
        categorie: z.string().optional(),
        minPrix: z.number().optional(),
        maxPrix: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search, categorie, minPrix, maxPrix } = input;
      const { skip, take } = paginate(page, pageSize);

      const where: Prisma.ProduitsWhereInput = {
        ...buildSearchWhere(search),
        ...(categorie && {
          categorie: { contains: categorie, mode: "insensitive" },
        }),
        ...(minPrix || maxPrix
          ? {
              prix: {
                ...(minPrix && { gte: minPrix }),
                ...(maxPrix && { lte: maxPrix }),
              },
            }
          : {}),
      };

      const [total, produits] = await Promise.all([
        ctx.db.produits.count({ where }),
        ctx.db.produits.findMany({
          where,
          skip,
          take,
          include: { vendeur: { include: { user: true } } },
          orderBy: { createdAt: "desc" },
        }),
      ]);

      return {
        data: produits,
        meta: buildPaginationMeta(total, page, pageSize),
      };
    }),

  myList: protectedProcedure
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
      const where = { vendeurId: vendeur.id };

      const [total, produits] = await Promise.all([
        ctx.db.produits.count({ where }),
        ctx.db.produits.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: "desc" },
        }),
      ]);

      return {
        data: produits,
        meta: buildPaginationMeta(total, input.page, input.pageSize),
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        nom: z.string().min(3),
        prix: z.number().positive(),
        quantite: z.number().int().min(1),
        categorie: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const vendeur = await ctx.db.vendeur.findUnique({
        where: { userId: ctx.session.user.id },
      });
      if (!vendeur) throw new TRPCError({ code: "FORBIDDEN" });

      return ctx.db.produits.create({
        data: { ...input, vendeurId: vendeur.id },
      });
    }),
});
