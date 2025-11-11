// components/vendeur/AddProductModal.tsx
"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Upload, Loader2, Check } from "lucide-react";
import { api } from "~/utils/api";
import {
  categories,
  predefinedTags,
  productInputSchema,
  units,
  type Categorie,
  type ProductInputSchemaType,
  type Statut,
  type Unite,
} from "~/validations/product/productInputSchema";
import Image from "next/image";

interface AddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddProductModal({ open, onOpenChange }: AddProductModalProps) {
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const utils = api.useUtils();

  const createMutation = api.produits.create.useMutation({
    onSuccess: async () => {
      await utils.produits.getMyProducts.invalidate();
      onOpenChange(false);
      reset();
      setUploadedUrl("");
    },
    onError: (error) => {
      console.error("❌ Create mutation error:", error);
      alert(`Erreur lors de la création: ${error.message}`);
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductInputSchemaType>({
    resolver: zodResolver(productInputSchema),
    defaultValues: {
      nom: "",
      description: "",
      prix: "",
      quantite: 10,
      unite: "par livre",
      localisation: "",
      categorie: "Légumes",
      tags: [],
      statut: "en-stock",
      imageUrl: "",
    },
  });

  const tags = watch("tags") ?? [];
  const currentValues = watch();

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

        if (!response.ok) {
          const errorData = (await response.json()) as { error?: string };
          throw new Error(
            errorData.error ?? `Upload failed with status ${response.status}`,
          );
        }

        const data = (await response.json()) as { url: string };
        console.log("✅ Image uploaded:", data.url);
        setUploadedUrl(data.url);
        setValue("imageUrl", data.url, {
          shouldValidate: true,
          shouldDirty: true,
        });
      } catch (error) {
        console.error("❌ Upload error:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Erreur inconnue";
        alert(`Erreur lors du téléchargement: ${errorMessage}`);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const onSubmit: SubmitHandler<ProductInputSchemaType> = async (data) => {
    console.log("📝 Form submitted with data:", data);
    console.log("📝 Form errors:", errors);
    console.log("📝 Current form values:", currentValues);

    // Validate manually
    const validation = productInputSchema.safeParse(data);
    if (!validation.success) {
      console.error("❌ Validation failed:", validation.error.flatten());
      alert(
        "Erreur de validation: " +
          JSON.stringify(validation.error.flatten().fieldErrors, null, 2),
      );
      return;
    }

    console.log("✅ Validation passed, sending mutation...");

    try {
      const result = await createMutation.mutateAsync(data);
      console.log("✅ Mutation result:", result);
    } catch (error) {
      console.error("❌ Submit error:", error);
    }
  };

  // Log validation errors when they change
  console.log("Current validation errors:", errors);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) {
          reset();
          setUploadedUrl("");
        }
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto p-0">
        <DialogHeader className="bg-card border-b p-6 pb-4">
          <DialogTitle className="text-2xl font-bold">
            Nouveau Produit
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations du produit ci-dessous.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7 p-6">
          {/* IMAGE UPLOAD */}
          <div className="space-y-3">
            <Label>Photo du produit *</Label>
            <div
              className="hover:border-primary/50 cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-all"
              onClick={(e) => {
                if (!uploadedUrl && !isUploading) {
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
                    alt="Produit"
                    height={200}
                    width={460}
                    className="mx-auto max-h-64 rounded-lg shadow-xl"
                  />
                  <div className="flex justify-center gap-2">
                    <Badge variant="default" className="gap-1">
                      <Check className="h-3 w-3" />
                      Prête
                    </Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedUrl("");
                        setValue("imageUrl", "");
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
                  <Upload className="text-muted-foreground mx-auto h-14 w-14" />
                  <p className="text-sm">
                    Glissez votre image ici ou{" "}
                    <span className="text-primary underline">cliquez</span>
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
                    onClick={(e) => e.stopPropagation()}
                  />
                  <p className="text-muted-foreground text-xs">
                    Max 4 Mo • JPG, PNG
                  </p>
                </div>
              )}
            </div>
            {errors.imageUrl && (
              <p className="text-sm text-red-500">{errors.imageUrl.message}</p>
            )}
          </div>

          {/* REST OF FORM */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Nom *</Label>
              <Input {...register("nom")} placeholder="Tomates fraîches" />
              {errors.nom && (
                <p className="text-sm text-red-500">{errors.nom.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Catégorie *</Label>
              <Select
                onValueChange={(v) => {
                  console.log("Category selected:", v);
                  setValue("categorie", v as Categorie, {
                    shouldValidate: true,
                  });
                }}
                defaultValue="Légumes"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c, index) => (
                    <SelectItem key={index} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categorie && (
                <p className="text-sm text-red-500">
                  {errors.categorie.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea
              {...register("description")}
              rows={4}
              placeholder="Description du produit..."
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Prix (dt) *</Label>
              <Input type="text" {...register("prix")} placeholder="25" />
              {errors.prix && (
                <p className="text-sm text-red-500">{errors.prix.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Quantité *</Label>
              <Input {...register("quantite")} placeholder="10" />
              {errors.quantite && (
                <p className="text-sm text-red-500">
                  {errors.quantite.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Unité *</Label>
              <Select
                onValueChange={(v) => {
                  console.log("Unit selected:", v);
                  setValue("unite", v as Unite, { shouldValidate: true });
                }}
                defaultValue="par livre"
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map((u, index) => (
                    <SelectItem key={index} value={u.value}>
                      {u.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.unite && (
                <p className="text-sm text-red-500">{errors.unite.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Localisation *</Label>
              <Input
                {...register("localisation")}
                placeholder="Tunis, Médina"
              />
              {errors.localisation && (
                <p className="text-sm text-red-500">
                  {errors.localisation.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Statut *</Label>
            <Select
              onValueChange={(v) => {
                console.log("Status selected:", v);
                setValue("statut", v as Statut, { shouldValidate: true });
              }}
              defaultValue="en-stock"
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en-stock">En stock</SelectItem>
                <SelectItem value="limité">Stock limité</SelectItem>
                <SelectItem value="rupture">Rupture</SelectItem>
              </SelectContent>
            </Select>
            {errors.statut && (
              <p className="text-sm text-red-500">{errors.statut.message}</p>
            )}
          </div>

          {/* TAGS */}
          <div className="space-y-4">
            <Label>Étiquettes</Label>
            <div className="flex flex-wrap gap-2">
              {tags.map((t, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="gap-1 px-3 py-1"
                >
                  {t}
                  <Button
                    type="button"
                    className="hover:bg-destructive/20 ml-1 rounded-full"
                    onClick={() =>
                      setValue(
                        "tags",
                        tags.filter((x) => x !== t),
                      )
                    }
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Ajouter..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const val = e.currentTarget.value.trim();
                    if (val && !tags.includes(val)) {
                      setValue("tags", [...tags, val]);
                      e.currentTarget.value = "";
                    }
                  }
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {predefinedTags
                .filter((t) => !tags.includes(t))
                .map((t, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setValue("tags", [...tags, t])}
                  >
                    + {t}
                  </Button>
                ))}
            </div>
          </div>

          {/* DEBUG INFO - Remove in production */}
          {process.env.NODE_ENV === "development" && (
            <div className="bg-muted rounded-lg p-4 text-xs">
              <p className="mb-2 font-semibold">Debug Info:</p>
              <p>Image URL: {currentValues.imageUrl ?? "Not set"}</p>
              <p>Categorie: {currentValues.categorie}</p>
              <p>Unite: {currentValues.unite}</p>
              <p>Statut: {currentValues.statut}</p>
              <p>Has Errors: {Object.keys(errors).length > 0 ? "Yes" : "No"}</p>
              {Object.keys(errors).length > 0 && (
                <pre className="mt-2 text-red-500">
                  {JSON.stringify(errors, null, 2)}
                </pre>
              )}
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex justify-end gap-4 border-t pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting || isUploading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isUploading || !uploadedUrl}
              className="min-w-40"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  En cours...
                </>
              ) : (
                "Publier le produit"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
