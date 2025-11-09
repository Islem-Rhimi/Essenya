// src/server/trpc/routers/evenement.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { eventInputSchema } from "~/validations/events/eventInputSchema";
import { TRPCError } from "@trpc/server";

export const evenementRouter = createTRPCRouter({
  // NEW: Public procedure to get all events
  getAllEvents: publicProcedure.query(async ({ ctx }) => {
    const events = await ctx.db.evenement.findMany({
      where: {
        date: {
          gte: new Date(), // Only future events
        },
      },
      include: {
        vendeur: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { date: "asc" },
    });
    return { data: events };
  }),

  getMyEvents: protectedProcedure.query(async ({ ctx }) => {
    const vendeur = await ctx.db.vendeur.findUnique({
      where: { userId: ctx.session.user.id },
    });
    if (!vendeur) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Seller account not found",
      });
    }
    const events = await ctx.db.evenement.findMany({
      where: { vendeurId: vendeur.id },
      orderBy: { date: "asc" },
    });
    return { data: events };
  }),

  create: protectedProcedure
    .input(eventInputSchema.omit({ id: true }))
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
      // FIXED: Combine date and time into a single DateTime
      const dateTime = new Date(`${input.date}T${input.time}:00`);

      return ctx.db.evenement.create({
        data: {
          vendeurId: vendeur.id,
          title: input.title,
          localisation: input.localisation,
          description: input.description ?? null,
          image: input.image ?? null,
          date: dateTime,
          color: input.color,
        },
      });
    }),

  update: protectedProcedure
    .input(eventInputSchema)
    .mutation(async ({ ctx, input }) => {
      if (!input.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Event ID is required",
        });
      }
      // FIXED: Combine date and time into a single DateTime
      const dateTime = new Date(`${input.date}T${input.time}:00`);

      return ctx.db.evenement.update({
        where: { id: input.id },
        data: {
          title: input.title,
          localisation: input.localisation,
          description: input.description ?? null,
          image: input.image ?? null,
          date: dateTime,
          color: input.color,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
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
      const event = await ctx.db.evenement.findUnique({
        where: { id: input.id },
        select: { vendeurId: true },
      });
      if (!event || event.vendeurId !== vendeur.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only delete your own events",
        });
      }
      return ctx.db.evenement.delete({
        where: { id: input.id },
      });
    }),
});
