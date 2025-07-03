import { NextRequest } from "next/server";
import supabase from "@/lib/supabase";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { listing_id, buyer_email, seller_email, message } = body;
        if (!message || !listing_id) {
            return new Response(JSON.stringify({ error: "Message and listing ID are required" }), {
                status: 400,
            });
        }

        const { data, error } = await supabase
            .from("messages")
            .insert([
                {
                    listing_id: listing_id,
                    message: message,
                    buyer_email: buyer_email,
                    seller_email: seller_email,
                },
            ])
            .select("*");

        if (error) {
            console.error("Error inserting message:", error);
            return new Response(JSON.stringify({ error: "Failed to send message" }), {
                status: 500,
            });
        }

        return new Response(JSON.stringify(data), { status: 201 });
    } catch (error) {
        console.error("Unexpected error:", error);
        return new Response(JSON.stringify({ error: "An unexpected error occurred" }), {
            status: 500,
        });
    }
}
