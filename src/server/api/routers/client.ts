// src/server/trpc/routers/client.ts
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const clientRouter = createTRPCRouter({
  myProfile: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.client.findUnique({
      where: { userId: ctx.session.user.id },
      include: { user: true },
    });
  }),
});
