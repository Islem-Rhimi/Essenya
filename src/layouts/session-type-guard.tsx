import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "@/utils/api";
import type { Session } from "@prisma/client";

interface SessionTypeGuardProps {
  children: React.ReactNode;
}

export function SessionTypeGuard({ children }: SessionTypeGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Extract sessionType safely
  const sessionType = (session as unknown as Session)?.sessionType as
    | "CLIENT"
    | "VENDEUR"
    | undefined;

  const {
    data: Vendeur,
    isLoading: VendeuripLoading,
    isPending,
  } = api.vendeur.myShop.useQuery(undefined, {
    retry: false,
  });

  useEffect(() => {
    if (status === "loading" || VendeuripLoading || isPending) return;

    // No session → redirect to home
    if (!session) {
      void router.push("/");
      return;
    }

    if (sessionType === "VENDEUR") {
      if (!Vendeur) {
        void router.push("/vendeur-setup");
      }

      return;
    }
  }, [
    status,
    session,
    sessionType,
    Vendeur,
    VendeuripLoading,
    router,
    isPending,
  ]);

  // Loading state
  if (
    status === "loading" ||
    VendeuripLoading ||
    isPending ||
    (sessionType === "VENDEUR" && !sessionType)
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent"></div>
          <p className="text-yellow-500">Chargement...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
