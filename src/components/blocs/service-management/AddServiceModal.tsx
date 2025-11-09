// components/vendeur/AddserviceModal.tsx
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
import { Badge } from "@/components/ui/badge";
import { X, Upload, Loader2, Check } from "lucide-react";
import { api } from "~/utils/api";
import {
  predefinedTags,
  serviceInputSchema,
  type serviceInputSchemaType,
} from "~/validations/service/serviceInputSchema";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface AddServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddServiceModal({ open, onOpenChange }: AddServiceModalProps) {
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const utils = api.useUtils();
  const createMutation = api.services.create.useMutation({
    onSuccess: async () => {
      console.log("✅ service created successfully!");
      await utils.services.getMyServices.invalidate();
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
  } = useForm<serviceInputSchemaType>({
    resolver: zodResolver(serviceInputSchema),
    defaultValues: {
      nom: "",
      description: "",
      prix: "",
      types: "",
      tags: [],
      imageUrl: "",
    },
  });
  const selectedType = watch("types");
  const tags = watch("tags") || [];
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

  const onSubmit: SubmitHandler<serviceInputSchemaType> = async (data) => {
    console.log("📝 Form submitted with data:", data);
    console.log("📝 Form errors:", errors);
    console.log("📝 Current form values:", currentValues);

    // Validate manually
    const validation = serviceInputSchema.safeParse(data);
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
            Nouveau service
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations du service ci-dessous.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7 p-6">
          {/* IMAGE UPLOAD */}
          <div className="space-y-3">
            <Label>Photo du service *</Label>
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
                    alt="service"
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
          </div>

          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea
              {...register("description")}
              rows={4}
              placeholder="Description du service..."
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
          </div>
          <Select
            value={selectedType}
            onValueChange={(value) => setValue("types", value)}
          >
            <SelectTrigger className="w-full sm:w-auto">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Services">All Services</SelectItem>
              <SelectItem value="Machines">Machines</SelectItem>
              <SelectItem value="Labor">Labor</SelectItem>
              <SelectItem value="Veterinary">Veterinary</SelectItem>
            </SelectContent>
          </Select>

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

          {/* DEBUG INFO - Remove in serviceion */}
          {process.env.NODE_ENV === "development" && (
            <div className="bg-muted rounded-lg p-4 text-xs">
              <p className="mb-2 font-semibold">Debug Info:</p>
              <p>Image URL: {currentValues.imageUrl ?? "Not set"}</p>
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
                "Publier le service"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
