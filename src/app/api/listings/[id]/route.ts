import { NextRequest } from "next/server";
import supabase from "@/lib/supabase";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const { data, error } = await supabase.from("listings").select("*").eq("id", id).single();

    if (error) {
        console.error("Error fetching listing:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch listing" }), { status: 500 });
    }

    return new Response(JSON.stringify(data), { status: 200 });
}