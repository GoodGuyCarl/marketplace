import supabase from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get("q");
        const limit = searchParams.get("limit") || "10";

        if (!query || query.length < 3) {
            return new Response(
                JSON.stringify({ error: "Query must be at least 3 characters long." }),
                {
                    status: 400,
                }
            );
        }

        console.log(`Searching for: ${query}`);

        // Search in title and description fields
        const { data, error } = await supabase
            .from("listings")
            .select("*")
            .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
            .limit(parseInt(limit))
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Search error:", error);
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Unexpected search error:", error);
        return new Response(JSON.stringify({ error: "An unexpected error occurred." }), {
            status: 500,
        });
    }
}
