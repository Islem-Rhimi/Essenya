// src/server/trpc/routers/evenement.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { eventInputSchema } from "~/validations/events/eventInputSchema";
import { TRPCError } from "@trpc/server";

export const evenementRouter = createTRPCRouter({
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
      return ctx.db.evenement.create({
        data: {
          vendeurId: vendeur.id,
          title: input.title,
          description: input.description ?? null,
          date: new Date(input.date),
          color: input.color ?? "#D4AF37",
        },
      });
    }),

  update: protectedProcedure
    .input(eventInputSchema)
    .mutation(async ({ ctx, input }) => {
      if (!input.id) {
        throw new Error("ID is required for update");
      }

      return ctx.db.evenement.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description ?? null,
          date: new Date(input.date),
          color: input.color ?? "#D4AF37",
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
      // First: VERIFY the event belongs to this vendeur
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

      // Now delete safely
      return ctx.db.evenement.delete({
        where: { id: input.id }, // ONLY id allowed here
      });
    }),
});
