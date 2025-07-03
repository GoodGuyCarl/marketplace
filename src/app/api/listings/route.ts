import supabase from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = searchParams.get("page") || "1";
        const limit = searchParams.get("limit") || "10";

        if (searchParams.has("category")) {
            const category = searchParams.get("category");
            if (!category) {
                return new Response(JSON.stringify({ error: "Category is required." }), {
                    status: 400,
                });
            }

            console.log(
                `Fetching listings for category: ${category}, page: ${page}, limit: ${limit}`
            );
            const listings = await supabase
                .from("listings")
                .select("*")
                .eq("category", category)
                .range((parseInt(page) - 1) * parseInt(limit), parseInt(page) * parseInt(limit) - 1)
                .order("created_at", { ascending: false });
            const { data, error } = listings;
            if (error) {
                return new Response(JSON.stringify({ error: error.message }), { status: 500 });
            }
            console.log(`Fetched ${data.length} listings for category: ${category}`);
            return new Response(JSON.stringify(data), {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }

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
    } catch (err) {
        console.error("Error fetching listings:", err);
        return new Response(JSON.stringify({ error: "An unexpected error occurred." }), {
            status: 500,
        });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, description, price, category, seller_email, image_url, location } = body;
        if (!title || !price || !category || !seller_email) {
            return new Response(JSON.stringify({ error: "Missing required fields." }), {
                status: 400,
            });
        }
        const { data, error } = await supabase
            .from("listings")
            .insert([
                {
                    title,
                    description,
                    price,
                    category,
                    seller_email,
                    image_url,
                    location,
                },
            ])
            .single();
        if (error) {
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
            });
        }
        return new Response(JSON.stringify(data), {
            status: 201,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (err) {
        console.error("Error creating listing:", err);
        return new Response(JSON.stringify({ error: "An unexpected error occurred." }), {
            status: 500,
        });
    }
}
