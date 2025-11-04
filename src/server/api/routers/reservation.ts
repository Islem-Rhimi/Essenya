// src/server/trpc/routers/reservation.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { paginate, buildPaginationMeta } from "../utils/pagination";

export const reservationRouter = createTRPCRouter({
  myBookings: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize } = input;
      const { skip, take } = paginate(page, pageSize);
      const where = { userId: ctx.session.user.id };

      const [total, bookings] = await Promise.all([
        ctx.db.reservation.count({ where }),
        ctx.db.reservation.findMany({
          where,
          skip,
          take,
          include: { evenement: true },
          orderBy: { date: "desc" },
        }),
      ]);

      return { data: bookings, meta: buildPaginationMeta(total, page, pageSize) };
    }),

  create: protectedProcedure
    .input(z.object({ evenementId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.reservation.create({
        data: { evenementId: input.evenementId, userId: ctx.session.user.id, statut: "EN_ATTENTE" },
      });
    }),
});