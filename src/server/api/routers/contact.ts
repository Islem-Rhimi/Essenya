// src/server/trpc/routers/contact.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { buildPaginationMeta, paginate } from "../utils/pagination";

export const contactRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(50).default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({ code: "FORBIDDEN" });

      const { page, pageSize } = input;
      const { skip, take } = paginate(page, pageSize);

      const [total, contacts] = await Promise.all([
        ctx.db.contact.count(),
        ctx.db.contact.findMany({
          skip,
          take,
          include: { user: true },
          orderBy: { date: "desc" },
        }),
      ]);

      return {
        data: contacts,
        meta: buildPaginationMeta(total, page, pageSize),
      };
    }),

  create: protectedProcedure
    .input(z.object({ objectif: z.string(), message: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.contact.create({
        data: { ...input, userId: ctx.session.user.id },
      });
    }),
});
