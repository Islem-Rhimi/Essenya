import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Store, ShoppingBag, ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AuthGuard from "~/layouts/auth-guard";
import { api } from "~/utils/api";

export default function SessionTypeSelection() {
  const router = useRouter();
  const { data: session, update } = useSession();

  const setSessionType = api.session.setSessionType.useMutation({
    onSuccess: async () => {
      await update();
      void router.push("/dashboard");
    },
  });
  return (
    <AuthGuard>
      <div className="from-background to-muted/50 flex min-h-screen items-center justify-center bg-gradient-to-br p-6">
        <div className="w-full max-w-4xl">
          {/* Logo + Title */}
          <div className="mb-12 text-center">
            <h1 className="from-primary to-primary/80 bg-gradient-to-r bg-clip-text text-5xl font-bold tracking-tighter text-transparent">
              Essenya
            </h1>
            <p className="text-muted-foreground mt-3 text-xl">
              Bienvenue, {session?.user?.name ?? "Utilisateur"}!
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* VENDEUR CARD */}
            <Card
              className="group hover:border-primary/50 bg-card/95 supports-[backdrop-filter]:bg-card/80 cursor-pointer border-2 backdrop-blur transition-all duration-300 hover:shadow-2xl"
              onClick={() => setSessionType.mutate({ sessionType: "CLIENT" })}
            >
              <CardHeader className="pb-8 text-center">
                <div className="bg-primary/10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full transition-transform group-hover:scale-110">
                  <Store className="text-primary h-10 w-10" />
                </div>
                <CardTitle className="text-2xl font-bold">
                  Je suis Vendeur
                </CardTitle>
                <CardDescription className="mt-3 text-base">
                  Gérez votre boutique, ajoutez des produits et organisez des
                  événements
                </CardDescription>
              </CardHeader>
              <CardContent className="border-t pt-6">
                <div className="text-primary flex items-center justify-center gap-3 font-medium">
                  <span>Accéder à mon tableau de bord</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                </div>
              </CardContent>
            </Card>

            {/* CLIENT CARD */}
            <Card
              className="group hover:border-primary/50 bg-card/95 supports-[backdrop-filter]:bg-card/80 cursor-pointer border-2 backdrop-blur transition-all duration-300 hover:shadow-2xl"
              onClick={() => setSessionType.mutate({ sessionType: "VENDEUR" })}
            >
              <CardHeader className="pb-8 text-center">
                <div className="bg-primary/10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full transition-transform group-hover:scale-110">
                  <ShoppingBag className="text-primary h-10 w-10" />
                </div>
                <CardTitle className="text-2xl font-bold">
                  Je suis Client
                </CardTitle>
                <CardDescription className="mt-3 text-base">
                  Découvrez les boutiques, réservez des événements et commandez
                </CardDescription>
              </CardHeader>
              <CardContent className="border-t pt-6">
                <div className="text-primary flex items-center justify-center gap-3 font-medium">
                  <span>Explorer les boutiques</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <p className="text-muted-foreground mt-12 text-center text-sm">
            Vous pouvez changer de rôle à tout moment dans les paramètres
          </p>
        </div>
      </div>
    </AuthGuard>
  );
}
