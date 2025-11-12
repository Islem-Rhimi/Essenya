"use client";

import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/utils/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, User, Store, Upload, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { toast } from "sonner";
import {
  userProfileSchema,
  vendorProfileSchema,
  type UserProfileFormData,
  type VendorProfileFormData,
} from "~/validations/userProfileSchema";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    name: string | null;
    email: string;
    numTel: string | null;
    dateOfBirth: Date | null;
    vendeurProfile: {
      nomBoutique: string;
      adresse: string;
      description: string | null;
      images: string | null;
      tourism: boolean;
    } | null;
  };
}

export default function EditProfileModal({
  isOpen,
  onClose,
  profile,
}: EditProfileModalProps) {
  const utils = api.useUtils();
  const [uploadedUrl, setUploadedUrl] = useState<string>(
    profile.vendeurProfile?.images ?? "",
  );
  const [isUploading, setIsUploading] = useState(false);

  // User Profile Form
  const userForm = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: profile.name ?? "",
      numTel: profile.numTel ?? "",
      dateOfBirth: profile.dateOfBirth
        ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
        : "",
    },
  });

  // Vendor Profile Form
  const vendorForm = useForm<VendorProfileFormData>({
    resolver: zodResolver(vendorProfileSchema),
    defaultValues: {
      nomBoutique: profile.vendeurProfile?.nomBoutique ?? "",
      adresse: profile.vendeurProfile?.adresse ?? "",
      description: profile.vendeurProfile?.description ?? "",
      images: profile.vendeurProfile?.images ?? "",
      tourism: profile.vendeurProfile?.tourism ?? false,
    },
  });

  // Reset forms when profile changes
  useEffect(() => {
    userForm.reset({
      name: profile.name ?? "",
      numTel: profile.numTel ?? "",
      dateOfBirth: profile.dateOfBirth
        ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
        : "",
    });

    vendorForm.reset({
      nomBoutique: profile.vendeurProfile?.nomBoutique ?? "",
      adresse: profile.vendeurProfile?.adresse ?? "",
      description: profile.vendeurProfile?.description ?? "",
      images: profile.vendeurProfile?.images ?? "",
      tourism: profile.vendeurProfile?.tourism ?? false,
    });

    setUploadedUrl(profile.vendeurProfile?.images ?? "");
  }, [profile, userForm, vendorForm]);

  const updateProfileMutation = api.profile.updateProfile.useMutation({
    onSuccess: async () => {
      toast.success("Profil mis à jour avec succès!");
      await utils.profile.getProfile.invalidate();
      onClose();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const updateVendorMutation = api.profile.updateVendorProfile.useMutation({
    onSuccess: async () => {
      toast.success("Profil vendeur mis à jour avec succès!");
      await utils.profile.getProfile.invalidate();
      onClose();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles?.length) {
      const file = acceptedFiles[0];
      if (!file) return;
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!response.ok) throw new Error("Upload failed");
        const data = (await response.json()) as { url: string };
        setUploadedUrl(data.url);
        vendorForm.setValue("images", data.url, { shouldValidate: true });
        toast.success("Image chargée avec succès!");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const onUserSubmit: SubmitHandler<UserProfileFormData> = async (data) => {
    await updateProfileMutation.mutateAsync({
      name: data.name || undefined,
      numTel: data.numTel ?? undefined,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
    });
  };

  const onVendorSubmit: SubmitHandler<VendorProfileFormData> = async (data) => {
    await updateVendorMutation.mutateAsync({
      nomBoutique: data.nomBoutique || undefined,
      adresse: data.adresse || undefined,
      description: data.description ?? undefined,
      images: uploadedUrl || undefined,
      tourism: data.tourism,
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(o) => {
        onClose();
        if (!o) {
          userForm.reset();
          vendorForm.reset();
          setUploadedUrl("");
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier le profil</DialogTitle>
          <DialogDescription>
            Mettez à jour vos informations personnelles
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user">
              <User className="mr-2 h-4 w-4" />
              Profil Utilisateur
            </TabsTrigger>
            {profile.vendeurProfile && (
              <TabsTrigger value="vendor">
                <Store className="mr-2 h-4 w-4" />
                Profil Vendeur
              </TabsTrigger>
            )}
          </TabsList>

          {/* User Profile Tab */}
          <TabsContent value="user">
            <form
              onSubmit={userForm.handleSubmit(onUserSubmit)}
              className="space-y-4"
            >
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nom complet <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  {...userForm.register("name")}
                  placeholder="Votre nom complet"
                />
                {userForm.formState.errors.name && (
                  <p className="text-sm text-red-500">
                    {userForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              {/* Email (read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={profile.email}
                  disabled
                  className="bg-gray-100 dark:bg-gray-800"
                />
                <p className="text-muted-foreground text-xs">
                  L&apos;email ne peut pas être modifié
                </p>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="numTel">Numéro de téléphone</Label>
                <Input
                  id="numTel"
                  type="tel"
                  {...userForm.register("numTel")}
                  placeholder="+216 XX XXX XXX"
                />
                {userForm.formState.errors.numTel && (
                  <p className="text-sm text-red-500">
                    {userForm.formState.errors.numTel.message}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date de naissance</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...userForm.register("dateOfBirth")}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={userForm.formState.isSubmitting}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={userForm.formState.isSubmitting}
                >
                  {userForm.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    "Enregistrer"
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* Vendor Profile Tab */}
          {profile.vendeurProfile && (
            <TabsContent value="vendor">
              <form
                onSubmit={vendorForm.handleSubmit(onVendorSubmit)}
                className="space-y-4"
              >
                {/* Image Upload */}
                <div className="space-y-3">
                  <Label>Photo de la ferme</Label>
                  <div
                    className="hover:border-primary/50 cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all"
                    onClick={(e) => {
                      if (!isUploading) {
                        e.currentTarget
                          .querySelector<HTMLInputElement>('input[type="file"]')
                          ?.click();
                      }
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      void onDrop(Array.from(e.dataTransfer.files));
                    }}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {uploadedUrl ? (
                      <div className="space-y-4">
                        <Image
                          src={uploadedUrl}
                          height={200}
                          width={460}
                          alt="Ferme"
                          className="mx-auto max-h-64 rounded-lg shadow-xl"
                        />
                        <div className="flex justify-center gap-2">
                          <Badge variant="default" className="gap-1">
                            <Check className="h-3 w-3" />
                            Chargée
                          </Badge>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setUploadedUrl("");
                              vendorForm.setValue("images", "");
                            }}
                          >
                            Changer
                          </Button>
                        </div>
                      </div>
                    ) : isUploading ? (
                      <div className="space-y-4">
                        <Loader2 className="text-primary mx-auto h-12 w-12 animate-spin" />
                        <p className="text-sm">Upload en cours...</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="text-muted-foreground mx-auto h-12 w-12" />
                        <p className="text-sm">
                          Glissez ou{" "}
                          <span className="text-primary underline">
                            cliquez
                          </span>
                        </p>
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files) {
                              void onDrop(Array.from(e.target.files));
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Farm Name */}
                <div className="space-y-2">
                  <Label htmlFor="nomBoutique">
                    Nom de la ferme <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nomBoutique"
                    {...vendorForm.register("nomBoutique")}
                    placeholder="Nom de votre ferme"
                  />
                  {vendorForm.formState.errors.nomBoutique && (
                    <p className="text-sm text-red-500">
                      {vendorForm.formState.errors.nomBoutique.message}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="adresse">
                    Localisation <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="adresse"
                    {...vendorForm.register("adresse")}
                    placeholder="Localisation de la ferme"
                  />
                  {vendorForm.formState.errors.adresse && (
                    <p className="text-sm text-red-500">
                      {vendorForm.formState.errors.adresse.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">À propos</Label>
                  <Textarea
                    id="description"
                    {...vendorForm.register("description")}
                    placeholder="Décrivez votre ferme..."
                    rows={4}
                  />
                  <p className="text-muted-foreground text-xs">
                    {vendorForm.watch("description")?.length ?? 0}/1000
                    caractères
                  </p>
                  {vendorForm.formState.errors.description && (
                    <p className="text-sm text-red-500">
                      {vendorForm.formState.errors.description.message}
                    </p>
                  )}
                </div>

                {/* Tourism Toggle */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="tourism">Agrotourisme</Label>
                    <p className="text-muted-foreground text-xs">
                      Activez si votre ferme propose des activités touristiques
                    </p>
                  </div>
                  <Switch
                    id="tourism"
                    checked={vendorForm.watch("tourism")}
                    onCheckedChange={(checked) =>
                      vendorForm.setValue("tourism", checked as boolean, {
                        shouldValidate: true,
                      })
                    }
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                    disabled={vendorForm.formState.isSubmitting || isUploading}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={vendorForm.formState.isSubmitting || isUploading}
                  >
                    {vendorForm.formState.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      "Enregistrer"
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
