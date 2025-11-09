import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { productUpdateSchema } from "~/validations/product/productUpdateSchema";
import { productInputSchema } from "~/validations/product/productInputSchema";
import type { Prisma } from "@prisma/client";

const buildSearchWhere = (search?: string) => {
  if (!search) return {};

  return {
    OR: [
      { nom: { contains: search, mode: "insensitive" as const } },
      { description: { contains: search, mode: "insensitive" as const } },
      { categorie: { contains: search, mode: "insensitive" as const } },
      ...(isNaN(Number(search)) ? [] : [{ year: Number(search) }]),
    ],
  };
};

// Helper function to build pagination meta
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

export const produitsRouter = createTRPCRouter({
  getProducts: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(50).default(12),
        search: z.string().optional(),
        nom: z.string().optional(),
        categorie: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search, categorie } = input;
      const skip = (page - 1) * pageSize;

      // Build search
      const where: Prisma.ProduitsWhereInput = {
        ...(search && {
          OR: [
            { nom: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { categorie: { contains: search, mode: "insensitive" } },
          ],
        }),
        ...(categorie && { categorie }),
      };

      const [total, produits] = await Promise.all([
        ctx.db.produits.count({ where }),
        ctx.db.produits.findMany({
          where,
          skip,
          take: pageSize,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            nom: true,
            prix: true,
            unite: true,
            categorie: true,
            imageUrl: true,
            createdAt: true,
          },
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
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(50).default(12),
        search: z.string().optional(),
        nom: z.string().optional(),
        categorie: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search, categorie } = input;
      const skip = (page - 1) * pageSize;

      // Get vendeur
      const vendeur = await ctx.db.vendeur.findUnique({
        where: { userId: ctx.session.user.id },
        select: { id: true },
      });

      if (!vendeur) throw new TRPCError({ code: "FORBIDDEN" });

      // Build search
      const where: Prisma.ProduitsWhereInput = {
        vendeurId: vendeur.id,
        ...(search && {
          OR: [
            { nom: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { categorie: { contains: search, mode: "insensitive" } },
          ],
        }),
        ...(categorie && { categorie }),
      };

      const [total, produits] = await Promise.all([
        ctx.db.produits.count({ where }),
        ctx.db.produits.findMany({
          where,
          skip,
          take: pageSize,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            nom: true,
            prix: true,
            unite: true,
            categorie: true,
            imageUrl: true,
            createdAt: true,
          },
        }),
      ]);

      return {
        data: produits,
        meta: buildPaginationMeta(total, page, pageSize),
      };
    }),
  create: protectedProcedure
    .input(productInputSchema)
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

      return ctx.db.produits.create({
        data: {
          vendeurId: vendeur.id,
          nom: input.nom,
          description: input.description,
          prix: input.prix,
          quantite: input.quantite,
          unite: input.unite,
          localisation: input.localisation,
          categorie: input.categorie,
          tags: input.tags,
          statut: input.statut,
          imageUrl: input.imageUrl ?? null,
          inventaire: input.inventaire,
        },
      });
    }),

  // Get all products for current seller
  getMyProducts: protectedProcedure
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
        const total = await ctx.db.produits.count({
          where: owner,
        });

        const produits = await ctx.db.produits.findMany({
          where: owner,
          skip,
          take: pageSize,
          include: {
            vendeur: true,
            commandes: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        return {
          data: produits,
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

  // Update product
  update: protectedProcedure
    .input(productUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const vendeur = await ctx.db.vendeur.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (!vendeur) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      // Verify product belongs to seller
      const product = await ctx.db.produits.findUnique({
        where: { id },
      });

      if (!product || product.vendeurId !== vendeur.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Product not found or unauthorized",
        });
      }

      return ctx.db.produits.update({
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
      const product = await ctx.db.produits.findUnique({
        where: { id: input.id },
      });

      if (!product || product.vendeurId !== vendeur.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Product not found or unauthorized",
        });
      }

      return ctx.db.produits.delete({
        where: { id: input.id },
      });
    }),
});
