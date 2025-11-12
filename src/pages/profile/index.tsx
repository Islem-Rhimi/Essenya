"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "@/utils/api";
import {
  User,
  Store,
  ShoppingBag,
  Settings,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit,
  Loader2,
  Package,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";
import { MainLayout } from "~/layouts";
import EditProfileModal from "~/components/blocs/profile/EditProfileModal";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch user profile with vendor data
  const { data: profile, isLoading } = api.profile.getProfile.useQuery(
    undefined,
    {
      enabled: status === "authenticated",
    },
  );

  // Fetch user's orders
  const { data: ordersData } = api.commande.myOrders.useQuery(
    { page: 1, pageSize: 5 },
    { enabled: status === "authenticated" },
  );

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!session || !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">
              Veuillez vous connecter pour voir votre profil.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasVendorProfile = !!profile.vendeurProfile;
  const orders = ordersData?.data ?? [];

  const getStatusBadge = (statut: string) => {
    const statusConfig = {
      EN_ATTENTE: {
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
        label: "En attente",
      },
      CONFIRMEE: {
        color: "bg-blue-100 text-blue-800",
        icon: CheckCircle2,
        label: "Confirmée",
      },
      EN_COURS: {
        color: "bg-purple-100 text-purple-800",
        icon: Package,
        label: "En cours",
      },
      LIVREE: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle2,
        label: "Livrée",
      },
      ANNULEE: {
        color: "bg-red-100 text-red-800",
        icon: XCircle,
        label: "Annulée",
      },
    };

    const config =
      statusConfig[statut as keyof typeof statusConfig] ??
      statusConfig.EN_ATTENTE;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col items-start gap-6 md:flex-row">
              {/* Avatar */}
              <Avatar className="h-24 w-24 border-4 border-green-100">
                <AvatarImage
                  src={profile.image ?? undefined}
                  alt={profile.name ?? "User"}
                />
                <AvatarFallback className="bg-green-600 text-2xl text-white">
                  {profile.name?.charAt(0).toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold">
                      {profile.name ?? "Utilisateur"}
                    </h1>
                    <p className="text-muted-foreground mt-1 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {profile.email}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                  </Button>
                </div>

                <div className="mt-4 flex flex-wrap gap-4">
                  {profile.numTel && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="text-muted-foreground h-4 w-4" />
                      <span>{profile.numTel}</span>
                    </div>
                  )}
                  {profile.dateOfBirth && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="text-muted-foreground h-4 w-4" />
                      <span>
                        {format(new Date(profile.dateOfBirth), "dd MMMM yyyy", {
                          locale: fr,
                        })}
                      </span>
                    </div>
                  )}
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <User className="h-3 w-3" />
                    {profile.role}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vendor Profile Card (if exists) */}
        {hasVendorProfile && (
          <div className="mb-6 px-24">
            <Card>
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <Store className="h-5 w-5" />
                  Profil Vendeur
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Left Column - Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-muted-foreground text-xs font-semibold uppercase">
                        Nom de la ferme
                      </label>
                      <h3 className="mt-1 text-xl font-semibold">
                        {profile.vendeurProfile?.nomBoutique ?? ""}
                      </h3>
                    </div>

                    <div>
                      <label className="text-muted-foreground text-xs font-semibold uppercase">
                        Localisation
                      </label>
                      <p className="mt-1 flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                        <span className="text-sm">
                          {profile.vendeurProfile?.adresse}
                        </span>
                      </p>
                    </div>

                    {profile.vendeurProfile?.description && (
                      <div>
                        <label className="text-muted-foreground text-xs font-semibold uppercase">
                          À propos
                        </label>
                        <p className="mt-1 line-clamp-3 text-sm">
                          {profile.vendeurProfile.description}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 pt-2">
                      {profile.vendeurProfile?.tourism && (
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          🏖️ Agrotourisme
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        <Calendar className="mr-1 h-3 w-3" />
                        Membre depuis{" "}
                        {format(
                          new Date(profile.vendeurProfile?.createdAt ?? ""),
                          "MMMM yyyy",
                          { locale: fr },
                        )}
                      </Badge>
                    </div>
                  </div>

                  {/* Right Column - Image */}
                  {profile.vendeurProfile?.images && (
                    <div className="order-first md:order-last">
                      <label className="text-muted-foreground text-xs font-semibold uppercase">
                        Photo de la ferme
                      </label>
                      <div className="relative mt-2 flex h-48 w-64 justify-center overflow-hidden rounded-lg border">
                        <Image
                          src={profile.vendeurProfile.images}
                          alt={profile.vendeurProfile.nomBoutique}
                          width={300}
                          height={250}
                          priority
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">
              <User className="mr-2 h-4 w-4" />
              Aperçu
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Mes Commandes ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Total Commandes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orders.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    En Cours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {orders.filter((o) => o.statut === "EN_COURS").length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Livrées</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {orders.filter((o) => o.statut === "LIVREE").length}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Informations du Compte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label>Nom complet</Label>
                    <p className="font-medium">
                      {profile.name ?? "Non renseigné"}
                    </p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="font-medium">{profile.email}</p>
                  </div>
                  <div>
                    <Label>Téléphone</Label>
                    <p className="font-medium">
                      {profile.numTel ?? "Non renseigné"}
                    </p>
                  </div>
                  <div>
                    <Label>Date de naissance</Label>
                    <p className="font-medium">
                      {profile.dateOfBirth
                        ? format(new Date(profile.dateOfBirth), "dd/MM/yyyy")
                        : "Non renseigné"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            {orders.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <ShoppingBag className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                  <p className="text-muted-foreground">
                    Vous n&apos;avez pas encore passé de commande.
                  </p>
                </CardContent>
              </Card>
            ) : (
              orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          Commande #{order.id.slice(-8).toUpperCase()}
                        </CardTitle>
                        <CardDescription>
                          {format(
                            new Date(order.date),
                            "dd MMMM yyyy à HH:mm",
                            {
                              locale: fr,
                            },
                          )}
                        </CardDescription>
                      </div>
                      {getStatusBadge(order.statut)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        {order.produit.imageUrl && (
                          <div className="relative h-16 w-16 overflow-hidden rounded-md">
                            <Image
                              src={order.produit.imageUrl}
                              alt={order.produit.nom}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold">{order.produit.nom}</h4>
                          <p className="text-muted-foreground text-sm">
                            Quantité: {order.quantite} {order.produit.unite}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">
                            {order.paiement?.montant} Dinar
                          </p>
                        </div>
                      </div>
                      <Separator />
                      <div className="text-sm">
                        <p className="text-muted-foreground">
                          Adresse de livraison:
                        </p>
                        <p className="font-medium">{order.adresseLivraison}</p>
                      </div>
                      {order.notes && (
                        <div className="text-sm">
                          <p className="text-muted-foreground">Notes:</p>
                          <p className="font-medium">{order.notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres du Compte</CardTitle>
                <CardDescription>
                  Gérez vos informations personnelles et préférences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Fonctionnalité à venir...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Profile Modal */}
        {profile && (
          <EditProfileModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            profile={profile}
          />
        )}
      </div>
    </MainLayout>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-muted-foreground mb-1 text-sm">{children}</p>;
}
