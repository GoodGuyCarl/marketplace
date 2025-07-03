import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("image") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        if (!file.type.startsWith("image/")) {
            return NextResponse.json({ error: "File must be an image" }, { status: 400 });
        }

        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { error: "Image size must be less than 5MB" },
                { status: 400 }
            );
        }

        // Generate unique filename
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        // Upload to Supabase storage
        const { error: uploadError } = await supabase.storage
            .from("listing-images")
            .upload(fileName, file);

        if (uploadError) {
            console.error("Upload error:", uploadError);

            // Handle specific storage errors
            let errorMessage = "Failed to upload image. Please try again.";
            if (uploadError.message.includes("Bucket not found")) {
                errorMessage = "Storage not configured. Please contact support.";
            } else if (uploadError.message.includes("file size")) {
                errorMessage = "Image file is too large. Please use a smaller image.";
            } else if (uploadError.message.includes("duplicate")) {
                errorMessage = "An image with this name already exists. Please try again.";
            }

            return NextResponse.json({ error: errorMessage }, { status: 500 });
        }

        // Get public URL for the uploaded image
        const {
            data: { publicUrl },
        } = supabase.storage.from("listing-images").getPublicUrl(fileName);

        return NextResponse.json({
            success: true,
            imageUrl: publicUrl,
            fileName: fileName,
        });
    } catch (error) {
        console.error("Upload API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
