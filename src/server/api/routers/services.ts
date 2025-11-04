// src/server/trpc/routers/services.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import type { Prisma } from "@prisma/client";
import { paginate, buildPaginationMeta } from "../utils/pagination";

const buildSearchWhere = (search?: string): Prisma.ServicesWhereInput => {
  if (!search) return {};
  return {
    OR: [
      { nom: { contains: search, mode: "insensitive" } },
      { type: { contains: search, mode: "insensitive" } },
    ],
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
});
