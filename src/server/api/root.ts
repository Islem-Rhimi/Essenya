import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/my-user";
import { clientRouter } from "./routers/client";
import { vendeurRouter } from "./routers/vendeur";
import { contactRouter } from "./routers/contact";
import { servicesRouter } from "./routers/services";
import { demandeServiceRouter } from "./routers/demandeService";
import { produitsRouter } from "./routers/produits";
import { commandeRouter } from "./routers/commande";
import { paiementRouter } from "./routers/paiement";
import { evenementRouter } from "./routers/evenement";
import { reservationRouter } from "./routers/reservation";
import { sessionRouter } from "./routers/session";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  myUser: userRouter,
  client: clientRouter,
  vendeur: vendeurRouter,
  contact: contactRouter,
  services: servicesRouter,
  demandeService: demandeServiceRouter,
  produits: produitsRouter,
  commande: commandeRouter,
  paiement: paiementRouter,
  evenement: evenementRouter,
  reservation: reservationRouter,
  session: sessionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
