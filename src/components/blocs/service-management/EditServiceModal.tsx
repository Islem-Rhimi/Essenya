// components/vendeur/EditProductModal.tsx
"use client";

import { useState, useEffect } from "react";
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
import Image from "next/image";
import type { Services } from "@prisma/client";
import { toast } from "sonner";
import { predefinedTags } from "~/validations/service/serviceInputSchema";
import {
  serviceUpdateSchema,
  type serviceUpdateSchemaType,
} from "~/validations/service/serviceUpdateSchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface EditServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Services;
}

export function EditServiceModal({
  open,
  onOpenChange,
  service,
}: EditServiceModalProps) {
  const [uploadedUrl, setUploadedUrl] = useState<string>(
    service.imageUrl ?? "",
  );
  const [isUploading, setIsUploading] = useState(false);
  const utils = api.useUtils();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<serviceUpdateSchemaType>({
    resolver: zodResolver(serviceUpdateSchema),
    defaultValues: {
      id: service.id,
      nom: service.nom,
      types: service.types,
      tags: service.tags,
      description: service.description,
      prix: service.prix,
      imageUrl: service.imageUrl ?? "",
    },
  });

  const updateMutation = api.services.update.useMutation({
    onSuccess: async () => {
      toast.success("Service modifié avec succès!");
      await utils.services.getMyServices.invalidate();
      onOpenChange(false);
    },
    onError: (error) => {
      alert(`Erreur: ${error.message}`);
    },
  });

  const selectedType = watch("types");
  const tags = watch("tags") || [];

  useEffect(() => {
    if (!service) return;

    reset({
      id: service.id,
      nom: service.nom,
      types: service.types,
      tags: service.tags,
      description: service.description,
      prix: service.prix,
      imageUrl: service.imageUrl ?? "",
    });

    setUploadedUrl(service.imageUrl ?? "");
  }, [service, reset]);

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
        setValue("imageUrl", data.url, { shouldValidate: true });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const onSubmit: SubmitHandler<serviceUpdateSchemaType> = async (data) => {
    await updateMutation.mutateAsync(data);
  };

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
            Modifier le service
          </DialogTitle>
          <DialogDescription>
            Mettez à jour les informations de votre service.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7 p-6">
          {/* IMAGE */}
          <div className="space-y-3">
            <Label>Photo du service</Label>
            <div
              className="hover:border-primary/50 cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-all"
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
                    alt="service"
                    height={200}
                    width={460}
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
                    Glissez ou{" "}
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
                  />
                </div>
              )}
            </div>
          </div>

          {/* FORM FIELDS */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Nom *</Label>
              <Input {...register("nom")} />
              {errors.nom && (
                <p className="text-sm text-red-500">{errors.nom.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea {...register("description")} rows={4} />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Prix (dt) *</Label>
              <Input {...register("prix")} />
              {errors.prix && (
                <p className="text-sm text-red-500">{errors.prix.message}</p>
              )}
            </div>
          </div>

          {/* CATEGORY SELECT */}
          <div className="space-y-2">
            <Label>Catégorie *</Label>
            <Select
              value={selectedType}
              onValueChange={(value) => setValue("types", value)}
            >
              <SelectTrigger className="w-full sm:w-auto">
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Services">All Services</SelectItem>
                <SelectItem value="Machines">Machines</SelectItem>
                <SelectItem value="Labor">Labor</SelectItem>
                <SelectItem value="Veterinary">Veterinary</SelectItem>
              </SelectContent>
            </Select>
            {errors.types && (
              <p className="text-sm text-red-500">{errors.types.message}</p>
            )}
          </div>

          {/* TAGS */}
          <div className="space-y-4">
            <Label>Étiquettes</Label>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <Badge key={t} variant="secondary" className="gap-1 px-3 py-1">
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
            <Input
              placeholder="Ajouter une étiquette..."
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
            <div className="flex flex-wrap gap-2">
              {predefinedTags
                .filter((t) => !tags.includes(t))
                .map((t) => (
                  <Button
                    key={t}
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
              disabled={isSubmitting || isUploading}
              className="min-w-40"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Sauvegarder"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
