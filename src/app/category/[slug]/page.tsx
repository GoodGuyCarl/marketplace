"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Listing {
    id: string;
    title: string;
    description?: string;
    price: number;
    category: string;
    seller_email: string;
    image_url?: string;
    location?: string;
    created_at?: string;
    updated_at?: string;
}

const fetchListingsByCategory = async (category: string): Promise<Listing[] | null> => {
    try {
        const response = await fetch(`/api/listings?category=${category}`);
        if (!response.ok) {
            throw new Error("Failed to fetch listings");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching listings:", error);
        return null;
    }
};

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

export default function CategoryPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const categoryName = humanizeSlug(slug);

    useEffect(() => {
        const fetchData = async () => {
            if (!slug) return;

            setIsLoading(true);
            setError(null);

            try {
                const data = await fetchListingsByCategory(slug);
                if (data) {
                    setListings(data);
                    console.log("Fetched data for category:", data);
                } else {
                    setError("No listings found");
                }
            } catch (err) {
                setError("Failed to fetch listings");
                console.error("Error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    if (isLoading) {
        return (
            <div>
                <h1 className="text-2xl font-bold mb-4">{categoryName}</h1>
                <p>Loading listings...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <h1 className="text-2xl font-bold mb-4">{categoryName}</h1>
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">{categoryName}</h1>
            <p className="text-gray-600 mb-6">
                Displaying {listings.length} products for {categoryName}
            </p>

            {listings.length > 0 ? (
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {listings.map((listing) => (
                        <article
                            key={listing.id}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            {listing.image_url && (
                                <img
                                    src={listing.image_url}
                                    alt={listing.title}
                                    className="w-full h-48 object-cover rounded mb-3"
                                />
                            )}
                            <h3 className="font-semibold text-lg mb-2">{listing.title}</h3>
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                {listing.description}
                            </p>
                            <p className="text-lg font-bold text-green-600">${listing.price}</p>
                            {listing.location && (
                                <p className="text-sm text-gray-500 mt-1">{listing.location}</p>
                            )}
                        </article>
                    ))}
                </section>
            ) : (
                <div>
                    <p className="text-gray-500">No listings found for this category.</p>
                    <Link href="/create" className="text-blue-500 hover:underline">
                        Create a listing
                    </Link>
                </div>
            )}
        </div>
    );
}
