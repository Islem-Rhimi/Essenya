"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
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
import { Card } from "@/components/ui/card";
import { X, Upload, Plus } from "lucide-react";
import type { ServiceFormData, ServiceFormErrors } from "./service-form";

interface AddServiceModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ServiceFormData) => void;
}

const categories = [
  { value: "vegetables", label: "Vegetables" },
  { value: "fruits", label: "Fruits" },
  { value: "grains", label: "Grains" },
  { value: "dairy", label: "Dairy" },
  { value: "meat", label: "Meat" },
  { value: "herbs", label: "Herbs & Spices" },
];

const units = [
  { value: "per lb", label: "per lb" },
  { value: "per kg", label: "per kg" },
  { value: "per dozen", label: "per dozen" },
  { value: "per piece", label: "per piece" },
  { value: "per bunch", label: "per bunch" },
  { value: "per bag", label: "per bag" },
  { value: "per box", label: "per box" },
];

const statusOptions = [
  { value: "in-stock", label: "In Stock" },
  { value: "out-of-stock", label: "Out of Stock" },
  { value: "limited", label: "Limited Stock" },
];

const predefinedTags = [
  "Organic",
  "Fresh",
  "Local",
  "Premium",
  "Grains",
  "Seasonal",
  "Free-Range",
  "Grass-Fed",
  "Non-GMO",
  "Pesticide-Free",
];

export function AddserviceModal({
  open,
  onClose,
  onSubmit,
}: AddServiceModalProps) {
  const [formData, setFormData] = useState<ServiceFormData>({
    name: "",
    description: "",
    price: "",
    unit: "",
    farmer: "",
    location: "",
    category: "",
    tags: [],
    status: "",
    image: null,
    inventory: "",
  });

  const [errors, setErrors] = useState<ServiceFormErrors>({});
  const [newTag, setNewTag] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ServiceFormErrors = {};

    if (!formData.name.trim()) newErrors.name = "service name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.price.trim()) newErrors.price = "Price is required";
    if (!formData.unit) newErrors.unit = "Unit is required";
    if (!formData.farmer.trim()) newErrors.farmer = "Farmer name is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.status) newErrors.status = "Status is required";
    if (!formData.inventory.trim())
      newErrors.inventory = "Inventory is required";

    // Price validation
    if (formData.price && isNaN(Number(formData.price))) {
      newErrors.price = "Price must be a valid number";
    }

    // Inventory validation
    if (formData.inventory && isNaN(Number(formData.inventory))) {
      newErrors.inventory = "Inventory must be a valid number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      unit: "",
      farmer: "",
      location: "",
      category: "",
      tags: [],
      status: "",
      image: null,
      inventory: "",
    });
    setErrors({});
    setNewTag("");
    onClose();
  };

  const handleInputChange = (field: keyof ServiceFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddTag = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag.trim()],
      }));
    }
    setNewTag("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setFormData((prev) => ({ ...prev, image: file }));
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        setFormData((prev) => ({ ...prev, image: file }));
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Add New service
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* service Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image">service Image</Label>
            <Card
              className={`border-2 border-dashed p-6 text-center transition-colors ${
                dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {formData.image ? (
                <div className="space-y-2">
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Preview"
                    className="mx-auto h-32 w-32 rounded-lg object-cover"
                  />
                  <p className="text-sm text-gray-600">{formData.image.name}</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, image: null }))
                    }
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">
                      Drag and drop an image here, or{" "}
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer text-blue-600 hover:text-blue-500"
                      >
                        browse
                      </label>
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* service Name */}
            <div className="space-y-2">
              <Label htmlFor="name">service Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Organic Tomatoes"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger
                  className={errors.category ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your service..."
              rows={3}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="0.00"
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price}</p>
              )}
            </div>

            {/* Unit */}
            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => handleInputChange("unit", value)}
              >
                <SelectTrigger className={errors.unit ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.unit && (
                <p className="text-sm text-red-500">{errors.unit}</p>
              )}
            </div>

            {/* Inventory */}
            <div className="space-y-2">
              <Label htmlFor="inventory">Inventory *</Label>
              <Input
                id="inventory"
                type="number"
                min="0"
                value={formData.inventory}
                onChange={(e) => handleInputChange("inventory", e.target.value)}
                placeholder="0"
                className={errors.inventory ? "border-red-500" : ""}
              />
              {errors.inventory && (
                <p className="text-sm text-red-500">{errors.inventory}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Farmer */}
            <div className="space-y-2">
              <Label htmlFor="farmer">Farmer/Producer *</Label>
              <Input
                id="farmer"
                value={formData.farmer}
                onChange={(e) => handleInputChange("farmer", e.target.value)}
                placeholder="e.g., Green Valley Farm"
                className={errors.farmer ? "border-red-500" : ""}
              />
              {errors.farmer && (
                <p className="text-sm text-red-500">{errors.farmer}</p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="e.g., California"
                className={errors.location ? "border-red-500" : ""}
              />
              {errors.location && (
                <p className="text-sm text-red-500">{errors.location}</p>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange("status", value)}
            >
              <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status}</p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="space-y-3">
              {/* Current Tags */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-gray-200"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Add New Tag */}
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag(newTag);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleAddTag(newTag)}
                  disabled={!newTag.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Predefined Tags */}
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Quick add:</p>
                <div className="flex flex-wrap gap-2">
                  {predefinedTags
                    .filter((tag) => !formData.tags.includes(tag))
                    .map((tag) => (
                      <Button
                        key={tag}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddTag(tag)}
                        className="h-7 text-xs"
                      >
                        {tag}
                      </Button>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Add service
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
