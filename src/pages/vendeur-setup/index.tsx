// components/onboarding/VendeurSetupWizard.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Store, MapPin, Camera, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "~/utils/api";
import {
  venduerInputSchema,
  type venduerInputSchemaType,
} from "~/validations/vendeurInputSchema";
import { toast } from "sonner";

export default function VendeurSetupWizard() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const utils = api.useUtils();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<venduerInputSchemaType>({
    resolver: zodResolver(venduerInputSchema),
    defaultValues: { images: "" },
  });

  const createMutation = api.vendeur.create.useMutation({
    onSuccess: async () => {
      toast.success("Concessionnaire créé avec succès!");
      await utils.vendeur.invalidate();
      void router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la création");
    },
  });
  const progress = (step / 4) * 100;

  const onSubmit = (data: venduerInputSchemaType) => {
    createMutation.mutate({
      nomBoutique: data.nomBoutique,
      adresse: data.adresse,
      description: data.description ?? undefined,
      images: data.images ?? undefined,
    });
  };

  return (
    <div className="from-background to-muted/30 flex min-h-screen items-center justify-center bg-gradient-to-br p-6">
      <Card className="w-full max-w-2xl border-0 shadow-2xl">
        <CardHeader className="pb-8 text-center">
          <div className="bg-primary/10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
            <Store className="text-primary h-10 w-10" />
          </div>
          <CardTitle className="text-3xl font-bold">
            Créez votre boutique
          </CardTitle>
          <CardDescription className="mt-3 text-lg">
            4 étapes simples pour lancer votre activité
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Progress */}
          <div className="relative">
            <Progress value={progress} className="h-3" />
            <div className="absolute -top-10 left-1/2 -translate-x-1/2">
              <span className="bg-background px-3 text-sm font-medium">
                Étape {step} sur 4
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* STEP 1 */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500">
                <div className="text-center">
                  <h3 className="mb-2 text-2xl font-semibold">
                    Nom de votre boutique
                  </h3>
                  <p className="text-muted-foreground">
                    Choisissez un nom accrocheur
                  </p>
                </div>
                <div className="space-y-4">
                  <Label htmlFor="nomBoutique" className="text-base">
                    <Store className="mr-2 inline h-4 w-4" />
                    Nom commercial
                  </Label>
                  <Input
                    id="nomBoutique"
                    placeholder="Ex: Bijoux d'Oran"
                    className="h-12 text-lg"
                    {...register("nomBoutique")}
                  />
                  {errors.nomBoutique && (
                    <p className="text-destructive text-sm">
                      {errors.nomBoutique.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500">
                <div className="text-center">
                  <h3 className="mb-2 text-2xl font-semibold">
                    Où êtes-vous situé ?
                  </h3>
                  <p className="text-muted-foreground">
                    Adresse exacte pour les livraisons
                  </p>
                </div>
                <div className="space-y-4">
                  <Label htmlFor="adresse" className="text-base">
                    <MapPin className="mr-2 inline h-4 w-4" />
                    Adresse complète
                  </Label>
                  <Textarea
                    id="adresse"
                    placeholder="123 Rue Principale, Alger Centre, 16000 Alger"
                    className="min-h-32 resize-none"
                    {...register("adresse")}
                  />
                  {errors.adresse && (
                    <p className="text-destructive text-sm">
                      {errors.adresse.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500">
                <div className="text-center">
                  <h3 className="mb-2 text-2xl font-semibold">
                    Parlez-nous de vous
                  </h3>
                  <p className="text-muted-foreground">
                    Présentez votre activité
                  </p>
                </div>
                <div className="space-y-4">
                  <Label htmlFor="description" className="text-base">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Je suis artisan bijoutier depuis 15 ans..."
                    className="min-h-40 resize-none"
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="text-destructive text-sm">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-500">
                <div className="text-center">
                  <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
                  <h3 className="mb-2 text-2xl font-semibold">
                    Presque fini !
                  </h3>
                  <p className="text-muted-foreground">
                    Ajoutez une photo de couverture
                  </p>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="images" className="text-base">
                    <Camera className="mr-2 inline h-4 w-4" />
                    Lien image (Cloudinary, ImgBB, etc.)
                  </Label>
                  <Input
                    id="images"
                    placeholder="https://res.cloudinary.com/..."
                    className="h-12"
                    {...register("images")}
                  />
                  <p className="text-muted-foreground text-xs">
                    Optionnel • Vous pourrez changer plus tard
                  </p>
                </div>

                <div className="bg-primary/5 border-primary/20 rounded-xl border p-6">
                  <h4 className="mb-3 font-semibold">
                    Votre boutique sera prête avec :
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="text-primary h-4 w-4" />
                      <span>{watch("nomBoutique") || "Nom de boutique"}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="text-primary h-4 w-4" />
                      <span>
                        Livraisons à{" "}
                        {watch("adresse")?.split(",")[0] ?? "votre ville"}
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="text-primary h-4 w-4" />
                      <span>Produits & événements</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* NAVIGATION */}
            <div className="flex justify-between border-t pt-8">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
              >
                Précédent
              </Button>

              {step < 4 ? (
                <Button
                  type="button"
                  size="lg"
                  className="px-8"
                  onClick={() => setStep(step + 1)}
                >
                  Suivant
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="lg"
                  className="gap-3 px-10"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Création..."
                  ) : (
                    <>
                      Lancer ma boutique
                      <CheckCircle className="h-5 w-5" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
