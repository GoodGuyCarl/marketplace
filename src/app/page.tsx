"use client";

import supabase from "@/lib/supabase";
import Link from "next/dist/client/link";
import { useEffect, useState } from "react";
import { Listing } from "@/lib/types/Listing";
import Image from "next/image";

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [listings, setListings] = useState<Listing[]>([]);

    const fetchListings = async (): Promise<Listing[] | null> => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase.from("listings").select("*");
            if (error) throw error;
            return data as Listing[];
        } catch (error) {
            console.error("Error fetching listings:", error);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchListings().then((data) => {
            if (data) {
                setListings(data);
            } else {
                console.error("Failed to fetch listings");
            }
        });
        const channel = supabase
            .channel("listings")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "listings" },
                (payload) => {
                    console.log("New listing added:", payload);
                    setListings((prevListings) => [payload.new as Listing, ...prevListings]);
                }
            )
            .subscribe();
        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <article className="max-w-7xl mx-auto">
            <h4 className="text-base md:text-2xl px-5 font-bold md:mb-4">Today&apos;s picks</h4>
            {isLoading ? (
                <section className="grid grid-cols-2 sm:grid-cols-3 gap-0.5 lg:grid-cols-5 md:gap-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div
                            key={index}
                            className="md:border md:rounded-lg py-2 md:p-4 animate-pulse"
                        >
                            <div className="w-full h-48 bg-gray-300 md:rounded mb-3"></div>
                            <div className="h-4 bg-gray-300 rounded mb-1 w-3/4"></div>
                            <div className="h-6 bg-gray-300 rounded mb-2 w-full hidden md:block"></div>
                            <div className="hidden md:block space-y-2 mb-2">
                                <div className="h-3 bg-gray-300 rounded w-full"></div>
                                <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                            </div>
                            <div className="h-6 bg-gray-300 rounded w-1/3 hidden md:block"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/2 mt-1 hidden md:block"></div>
                        </div>
                    ))}
                </section>
            ) : (
                <section className="grid grid-cols-2 sm:grid-cols-3 gap-0.5 lg:grid-cols-5 md:gap-4">
                    {listings.length > 0 ? (
                        listings.map((listing) => (
                            <Link
                                href={`/listings/${listing.id}`}
                                passHref
                                key={listing.id}
                                className="md:border md:rounded-lg py-2 md:p-4 hover:shadow-md transition-shadow"
                            >
                                {listing.image_url && (
                                    <Image
                                        src={listing.image_url}
                                        alt={listing.title}
                                        className="w-full h-48 object-cover md:rounded mb-3"
                                        width={200}
                                        height={200}
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
            )}
        </article>
    );
}
