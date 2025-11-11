// src/server/trpc/routers/reservation.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { paginate } from "../utils/pagination";
import { TRPCError } from "@trpc/server";

// const buildSearchWhere = (search?: string) => {
//   if (!search) return {};

//   return {
//     OR: [
//       { nom: { contains: search, mode: "insensitive" as const } },
//       { description: { contains: search, mode: "insensitive" as const } },
//       { categorie: { contains: search, mode: "insensitive" as const } },
//       ...(isNaN(Number(search)) ? [] : [{ year: Number(search) }]),
//     ],
//   };
// };

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

export const reservationRouter = createTRPCRouter({
  myBookings: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(50).default(10),
        search: z.string().optional(),
      }),
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

      return {
        data: bookings,
        meta: buildPaginationMeta(total, page, pageSize),
      };
    }),

  getReservationByEventId: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(50).default(10),
        eventId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize } = input;
      const { skip, take } = paginate(page, pageSize);
      const where = { evenementId: input.eventId };

      const [total, bookings] = await Promise.all([
        ctx.db.reservation.count({ where }),
        ctx.db.reservation.findMany({
          where,
          skip,
          take,
          include: { user: true },
          orderBy: { date: "desc" },
        }),
      ]);

      return {
        data: bookings,
        meta: buildPaginationMeta(total, page, pageSize),
      };
    }),

  create: protectedProcedure
    .input(z.object({ evenementId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.reservation.create({
        data: { evenementId: input.evenementId, userId: ctx.session.user.id },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const reservation = await ctx.db.reservation.findUnique({
        where: { id: input.id },
      });

      if (!reservation || reservation.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Product not found or unauthorized",
        });
      }

      return ctx.db.reservation.delete({
        where: { id: input.id },
      });
    }),
  updateStatus: protectedProcedure
    .input(
      z.object({
        reservationId: z.string(),
        status: z.enum(["En attente", "Accepté", "Refusé"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { reservationId, status } = input;
      const vendeur = await ctx.db.vendeur.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (!vendeur) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      // Make sure the reservation exists
      const reservation = await ctx.db.reservation.findUnique({
        where: { id: reservationId },
        include: { evenement: true },
      });

      if (!reservation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Réservation introuvable",
        });
      }

      // Ensure the current user is the event owner before updating
      if (reservation.evenement.vendeurId !== vendeur.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Vous n êtes pas autorisé à modifier cette réservation",
        });
      }

      return ctx.db.reservation.update({
        where: { id: reservationId },
        data: { statut: status },
      });
    }),
});
