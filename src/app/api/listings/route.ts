import supabase from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = searchParams.get("page") || "1";
        const limit = searchParams.get("limit") || "10";

        console.log(`Fetching listings for page ${page} with limit ${limit}`);

        const listings = await supabase
            .from("listings")
            .select("*")
            .range((parseInt(page) - 1) * parseInt(limit), parseInt(page) * parseInt(limit) - 1)
            .order("created_at", { ascending: false });

        const { data, error } = listings;
        if (error) {
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "An unexpected error occurred." }), {
            status: 500,
        });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log(JSON.stringify(body, null, 2));
    } catch (error) {
        return new Response(JSON.stringify({ error: "An unexpected error occurred." }), {
            status: 500,
        });
    }
}