"use client";

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Camera, X } from "lucide-react";
import { useState } from "react";
import { categories } from "@/lib/categories";
import { Button } from "@/components/ui/button";

interface FormData {
    title: string;
    description: string;
    price: string;
    category: string;
    location: string;
    image: File | null;
    email: string;
}

function humanizeSlug(slug: string): string {
    let humanized = slug
        .replace(/-/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/\b(home)\s*(garden|outdoor|indoor)\b/gi, "Home & Garden")
        .replace(/\b(health)\s*(beauty|wellness)\b/gi, "Health & Beauty")
        .replace(/\b(sports)\s*(outdoor|recreation)\b/gi, "Sports & Outdoors")
        .replace(/\b(toys)\s*(games|gaming)\b/gi, "Toys & Games")
        .replace(/\b(books)\s*(media|movies|music)\b/gi, "Books & Media")
        .replace(/\b(collectibles)\s*(art|antiques)\b/gi, "Collectibles & Art")
        .replace(/\b(music)\s*(instruments|instrument)\b/gi, "Music & Instruments")
        .replace(/\b(pets)\s*(animals|animal)\b/gi, "Pets & Animals");

    if (!humanized.includes("&")) {
        humanized = humanized
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    }

    return humanized;
}

export default function CreateItemListing() {
    const [formData, setFormData] = useState<FormData>({
        title: "",
        description: "",
        price: "",
        category: "",
        location: "",
        image: null,
        email: "",
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const updateFormData = (field: keyof FormData, value: string | File | null) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        if (field === "image" && value instanceof File) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(value);
        } else if (field === "image" && value === null) {
            setImagePreview(null);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            const file = files[0];
            // Check if it's an image file
            if (file.type.startsWith("image/")) {
                updateFormData("image", file);
            } else {
                alert("Please drop an image file");
            }
        }
    };

    return (
        <article className="max-w-7xl mx-auto px-4">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <form className="flex flex-col px-4">
                    <p className="text-sm mb-2">Photos</p>
                    <div
                        className={`border-dashed border-2 rounded-lg h-48 flex items-center justify-center cursor-pointer relative overflow-hidden transition-colors ${
                            isDragOver
                                ? "border-primary bg-primary/5"
                                : "border-border hover:bg-muted/50"
                        }`}
                        onClick={() => document.getElementById("file-input")?.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {imagePreview ? (
                            <div className="relative w-full h-full">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover rounded"
                                />
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        updateFormData("image", null);
                                    }}
                                    className="absolute top-2 right-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full p-1 shadow-lg transition-colors"
                                    aria-label="Remove image"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <Camera className="w-8 h-8 text-muted-foreground mb-2" />
                                <p className="text-foreground">
                                    {isDragOver ? "Drop image here" : "Add photos"}
                                </p>
                                <p className="text-muted-foreground text-xs mt-1">
                                    Drag & drop or click to browse
                                </p>
                                <p className="text-muted-foreground text-xs">
                                    JPEG, PNG, or WebP (max 5MB)
                                </p>
                            </div>
                        )}
                        <input
                            id="file-input"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                updateFormData("image", file);
                            }}
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium mb-1 text-foreground">
                            Title<span className="text-destructive">*</span>
                        </label>
                        <Input
                            type="text"
                            value={formData.title}
                            onChange={(e) => updateFormData("title", e.target.value)}
                            placeholder="What are you selling?"
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium mb-1 text-foreground">
                            Category<span className="text-destructive">*</span>
                        </label>
                        <Select
                            value={formData.category}
                            onValueChange={(value) => updateFormData("category", value)}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.value} value={category.value}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium mb-1 text-foreground">
                            Description
                        </label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => updateFormData("description", e.target.value)}
                            placeholder="Describe your item..."
                            className="resize-none h-32"
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium mb-1 text-foreground">
                            Price<span className="text-destructive">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                                $
                            </span>
                            <Input
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => updateFormData("price", e.target.value)}
                                placeholder="0.00"
                                className="pl-8"
                                required
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium mb-1 text-foreground">
                            Location
                        </label>
                        <Input
                            type="text"
                            value={formData.location}
                            onChange={(e) => updateFormData("location", e.target.value)}
                            placeholder="City, State"
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium mb-1 text-foreground">
                            Contact email<span className="text-destructive">*</span>
                        </label>
                        <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateFormData("email", e.target.value)}
                            placeholder="Your email address"
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <Button type="submit" className="w-full">Create Listing</Button>
                    </div>
                </form>
                <div className="flex flex-col px-4">
                    <p className="text-sm mb-2 text-foreground">Preview</p>
                    <div className="border border-border rounded-lg h-full bg-muted/20 flex items-center justify-center overflow-hidden">
                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt="Listing preview"
                                className="w-full h-full object-cover rounded"
                            />
                        ) : (
                            <p className="text-muted-foreground">Image preview will appear here</p>
                        )}
                    </div>
                    <h2 className="text-lg font-semibold mt-4 text-foreground">
                        {formData.title || "Title"}
                    </h2>
                    <h4 className="text-md font-medium text-primary mt-1">
                        {formData.price ? `$${parseFloat(formData.price).toFixed(2)}` : "Price"}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-2">
                        {formData.description || "Description of the item..."}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                        📍 {formData.location || "City, State"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Category:{" "}
                        {formData.category ? humanizeSlug(formData.category) : "Select a category"}
                    </p>
                    <div className="mt-4 pt-3 border-t border-border">
                        <h4 className="text-sm font-semibold text-foreground">Contact</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                            ✉️ {formData.email || "email@example.com"}
                        </p>
                    </div>
                </div>
            </section>
        </article>
    );
}
