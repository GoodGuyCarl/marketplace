"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Listing } from "@/lib/types/Listing";
import { humanizeSlug } from "@/lib/utils";

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
            <article className="max-w-7xl mx-auto px-4">
                <h1 className="text-2xl font-bold mb-4">{categoryName}</h1>
                <p>Loading listings...</p>
            </article>
        );
    }

    if (error) {
        return (
            <article className="max-w-7xl mx-auto px-4">
                <h1 className="text-2xl font-bold mb-4">{categoryName}</h1>
                <p className="text-red-500">Error: {error}</p>
            </article>
        );
    }

    return (
        <article className="max-w-7xl mx-auto px-4">
            <h1 className="text-2xl font-bold mb-4">{categoryName}</h1>
            <p className="text-gray-600 mb-6">
                Displaying {listings.length} products for {categoryName}
            </p>
            <section className="grid grid-cols-2 sm:grid-cols-3 gap-0.5 lg:grid-cols-5 md:gap-4">
                {listings.length > 0 ? (
                    listings.map((listing) => (
                        <Link
                            href={`/listings/${listing.id}`}
                            key={listing.id}
                            className="md:border md:rounded-lg py-2 md:p-4 hover:shadow-md transition-shadow"
                        >
                            {listing.image_url && (
                                <img
                                    src={listing.image_url}
                                    alt={listing.title}
                                    className="w-full h-48 object-cover md:rounded mb-3"
                                />
                            )}
                            <span className="md:hidden text-xs pl-1 pr-2 mb-1 line-clamp-1">
                                ${listing.price} &#x2022; {listing.title}
                            </span>
                            <h3 className="font-semibold text-sm hidden md:block md:text-lg mb-2">
                                {listing.title}
                            </h3>
                            <p className="hidden md:block text-gray-600 text-xs md:text-sm mb-2 line-clamp-2">
                                {listing.description}
                            </p>
                            <p className="text-lg font-bold hidden md:block text-green-600">
                                ${listing.price}
                            </p>
                            {listing.location && (
                                <p className="hidden md:block text-sm text-gray-500 mt-1">
                                    {listing.location}
                                </p>
                            )}
                        </Link>
                    ))
                ) : (
                    <div>
                        <p className="text-gray-500">No listings found for this category.</p>
                        <Link href="/create" className="text-blue-500 hover:underline">
                            Create a listing
                        </Link>
                    </div>
                )}
            </section>
        </article>
    );
}
