"use client";

import supabase from "@/lib/supabase";
import Link from "next/dist/client/link";
import { useEffect, useState } from "react";

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
            }
        });
    }, []);

    return (
        <>
            <h4 className="text-2xl font-bold mb-4">Today's picks</h4>
            {isLoading ? (
                <h1>Loading...</h1>

            ) : (
                <section className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {listings.length > 0 && listings.map((listing) => (
                        <article key={listing.id} className="border rounded-lg p-4">
                            <h5 className="font-semibold">{listing.title}</h5>
                            <p className="text-sm text-gray-500">{listing.description}</p>
                        </article>
                    ))}
                    {listings.length === 0 && (
                        <div className="col-span-full">
                            <p className="text-gray-500">No listings available at the moment.</p>
                            <Link href="/create" className="text-blue-500 hover:underline">
                                Create a listing
                            </Link>
                        </div>
                    )}
                </section>
            )}
        </>
    );
}