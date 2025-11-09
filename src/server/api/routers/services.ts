// src/server/trpc/routers/services.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import type { Prisma } from "@prisma/client";
import { paginate } from "../utils/pagination";
import { TRPCError } from "@trpc/server";
import { serviceUpdateSchema } from "~/validations/service/serviceUpdateSchema";
import { serviceInputSchema } from "~/validations/service/serviceInputSchema";

const buildSearchWhere = (search?: string): Prisma.ServicesWhereInput => {
  if (!search) return {};
  return {
    OR: [{ nom: { contains: search, mode: "insensitive" } }],
  };
};

const buildPaginationMeta = (total: number, page: number, pageSize: number) => {
  const lastPage = Math.ceil(total / pageSize);
  const from = total > 0 ? (page - 1) * pageSize + 1 : 0;
  const to = Math.min(page * pageSize, total);

  return {
    total,
    lastPage,
    currentPage: page,
    perPage: pageSize,
    current_page: page,
    per_page: pageSize,
    last_page: lastPage,
    from,
    to,
  };
};

export const servicesRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(50).default(12),
        search: z.string().optional(),
        type: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search, type } = input;
      const { skip, take } = paginate(page, pageSize);
      const where: Prisma.ServicesWhereInput = {
        ...buildSearchWhere(search),
        ...(type && { type: { contains: type, mode: "insensitive" } }),
      };

      const [total, services] = await Promise.all([
        ctx.db.services.count({ where }),
        ctx.db.services.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: "desc" },
        }),
      ]);

      return {
        data: services,
        meta: buildPaginationMeta(total, page, pageSize),
      };
    }),
  getMyServices: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(5),
        search: z.string().optional(),
        availability: z.boolean().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const { page, pageSize, search, availability } = input;
        const skip = (page - 1) * pageSize;

        const searchWhere = buildSearchWhere(search);
        if (!ctx.session?.user?.id) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to view your cars",
          });
        }

        const owner = {
          vendeur: {
            userId: ctx.session.user.id,
          },
          ...searchWhere,
          ...(availability !== undefined && { availability }),
        };
        const total = await ctx.db.services.count({
          where: owner,
        });

        const services = await ctx.db.services.findMany({
          where: owner,
          skip,
          take: pageSize,
          include: {
            vendeur: true,
            demmandes: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        return {
          data: services,
          meta: buildPaginationMeta(total, page, pageSize),
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching cars",
          cause: error,
        });
      }
    }),

  create: protectedProcedure
    .input(serviceInputSchema)
    .mutation(async ({ ctx, input }) => {
      const vendeur = await ctx.db.vendeur.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (!vendeur) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Seller account not found",
        });
      }

      return ctx.db.services.create({
        data: {
          vendeurId: vendeur.id,
          nom: input.nom,
          description: input.description,
          prix: input.prix,
          types: input.types,
          tags: input.tags,
          imageUrl: input.imageUrl ?? null,
        },
      });
    }),

  update: protectedProcedure
    .input(serviceUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const vendeur = await ctx.db.vendeur.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (!vendeur) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const service = await ctx.db.services.findUnique({
        where: { id },
      });

      if (!service || service.vendeurId !== vendeur.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Product not found or unauthorized",
        });
      }

      return ctx.db.services.update({
        where: { id },
        data,
      });
    }),

  // Delete product
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const vendeur = await ctx.db.vendeur.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (!vendeur) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      // Verify product belongs to seller
      const service = await ctx.db.services.findUnique({
        where: { id: input.id },
      });

      if (!service || service.vendeurId !== vendeur.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Product not found or unauthorized",
        });
      }

      return ctx.db.services.delete({
        where: { id: input.id },
      });
    }),
});
