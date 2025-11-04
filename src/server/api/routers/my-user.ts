// src/server/trpc/routers/user.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import type { Prisma } from "@prisma/client";
import { buildPaginationMeta, paginate } from "../utils/pagination";

const buildSearchWhere = (search?: string): Prisma.UserWhereInput => {
  if (!search) return {};
  return {
    OR: [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ],
  };
};

export const userRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(50).default(10),
        search: z.string().optional(),
        role: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({ code: "FORBIDDEN" });

      const { page, pageSize, search, role } = input;
      const { skip, take } = paginate(page, pageSize);
      const where: Prisma.UserWhereInput = {
        ...buildSearchWhere(search),
        ...(role && { role }),
      };

      const [total, users] = await Promise.all([
        ctx.db.user.count({ where }),
        ctx.db.user.findMany({
          where,
          skip,
          take,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        }),
      ]);

      return { data: users, meta: buildPaginationMeta(total, page, pageSize) };
    }),

  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      include: { clientProfile: true, vendeurProfile: true },
    });
  }),
});
