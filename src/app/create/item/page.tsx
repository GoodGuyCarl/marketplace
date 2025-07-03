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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Camera, X, AlertCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { categories } from "@/lib/categories";
import { Button } from "@/components/ui/button";
import { humanizeSlug } from "@/lib/utils";

interface FormData {
    title: string;
    description: string;
    price: string;
    category: string;
    location: string;
    image: File | null;
    email: string;
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertType, setAlertType] = useState<"default" | "destructive">("default");

    useEffect(() => {
        if (alertMessage && alertType === "default") {
            const timer = setTimeout(() => {
                setAlertMessage(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [alertMessage, alertType]);

    const updateFormData = (field: keyof FormData, value: string | File | null) => {
        if (alertMessage) {
            setAlertMessage(null);
        }

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
                setAlertMessage("Please drop an image file");
                setAlertType("destructive");
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Clear any previous alerts
        setAlertMessage(null);
        setIsSubmitting(true);

        // Validate required fields
        if (!formData.title || !formData.category || !formData.price || !formData.email) {
            setAlertMessage("Please fill in all required fields.");
            setAlertType("destructive");
            setIsSubmitting(false);
            return;
        }

        try {
            let imageUrl = null;

            // Upload image if exists
            if (formData.image) {
                const uploadFormData = new FormData();
                uploadFormData.append("image", formData.image);

                const uploadResponse = await fetch("/api/upload", {
                    method: "POST",
                    body: uploadFormData,
                });

                if (!uploadResponse.ok) {
                    const uploadError = await uploadResponse.json();
                    throw new Error(uploadError.error || "Failed to upload image");
                }

                const uploadResult = await uploadResponse.json();
                imageUrl = uploadResult.imageUrl;
            }

            // Submit listing data to API
            const listingData = {
                title: formData.title,
                description: formData.description,
                price: parseFloat(formData.price),
                category: formData.category,
                seller_email: formData.email,
                image_url: imageUrl,
                location: formData.location || null,
            };

            const response = await fetch("/api/listings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(listingData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create listing");
            }

            const result = await response.json();
            console.log("Listing created:", result);

            setAlertMessage("Listing created successfully!");
            setAlertType("default");

            // Reset form after successful submission
            setFormData({
                title: "",
                description: "",
                price: "",
                category: "",
                location: "",
                image: null,
                email: "",
            });
            setImagePreview(null);
        } catch (error) {
            console.error("Error creating listing:", error);
            setAlertMessage(
                `Failed to create listing: ${
                    error instanceof Error ? error.message : "Please try again."
                }`
            );
            setAlertType("destructive");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <article className="max-w-7xl mx-auto px-4">
                <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <form className="flex flex-col px-4" onSubmit={handleSubmit}>
                        <p className="text-sm mb-2">Photos</p>
                        <div
                            className={`border-dashed border-2 rounded-lg h-48 flex items-center justify-center cursor-pointer relative overflow-hidden transition-colors ${
                                isSubmitting
                                    ? "border-muted bg-muted/20 cursor-not-allowed"
                                    : isDragOver
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:bg-muted/50"
                            }`}
                            onClick={() =>
                                !isSubmitting && document.getElementById("file-input")?.click()
                            }
                            onDragOver={!isSubmitting ? handleDragOver : undefined}
                            onDragLeave={!isSubmitting ? handleDragLeave : undefined}
                            onDrop={!isSubmitting ? handleDrop : undefined}
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
                                disabled={isSubmitting}
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
                                disabled={isSubmitting}
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
                                disabled={isSubmitting}
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
                                disabled={isSubmitting}
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
                                    disabled={isSubmitting}
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
                                disabled={isSubmitting}
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
                                disabled={isSubmitting}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating Listing...
                                    </>
                                ) : (
                                    "Create Listing"
                                )}
                            </Button>
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
                                <p className="text-muted-foreground">
                                    Image preview will appear here
                                </p>
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
                            {formData.category
                                ? humanizeSlug(formData.category)
                                : "Select a category"}
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

            {/* Toast Alert */}
            {alertMessage && (
                <div
                    className="fixed bottom-4 left-4 right-4 sm:right-auto z-50 max-w-sm sm:max-w-md toast-enter"
                    style={{
                        animation: "slideInFromLeft 0.3s ease-out",
                    }}
                >
                    <Alert
                        variant={alertType}
                        className="shadow-xl border-2 relative pr-10 backdrop-blur-sm w-full"
                    >
                        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <AlertDescription className="pr-2 text-sm leading-relaxed">
                            {alertMessage}
                        </AlertDescription>
                        <button
                            onClick={() => setAlertMessage(null)}
                            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 p-1 hover:bg-muted/50"
                            aria-label="Close alert"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </Alert>
                </div>
            )}
        </>
    );
}
