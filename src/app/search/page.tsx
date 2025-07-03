"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Store } from "lucide-react";
import Link from "next/link";
import { Listing } from "@/lib/types/Listing";
import Image from "next/image";

function SearchPageContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const [results, setResults] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (query.length >= 3) {
            performSearch(query);
        }
    }, [query]);

    const performSearch = async (searchQuery: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `/api/search?q=${encodeURIComponent(searchQuery)}&limit=50`
            );
            if (response.ok) {
                const data = await response.json();
                setResults(data);
            } else {
                setError("Failed to search listings");
            }
        } catch (err) {
            setError("An error occurred while searching");
            console.error("Search error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    if (query.length < 3) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center">
                    <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h1 className="text-2xl font-bold mb-2">Search Marketplace</h1>
                    <p className="text-muted-foreground">
                        Enter at least 3 characters to search for items
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Search Results</h1>
                <p className="text-muted-foreground">
                    {isLoading ? "Searching..." : `Results for "${query}"`}
                </p>
            </div>

            {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
                    <p className="text-destructive">{error}</p>
                </div>
            )}

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-muted rounded-lg h-48 mb-3"></div>
                            <div className="bg-muted rounded h-4 mb-2"></div>
                            <div className="bg-muted rounded h-4 w-2/3"></div>
                        </div>
                    ))}
                </div>
            ) : results.length > 0 ? (
                <>
                    <p className="text-sm text-muted-foreground mb-4">
                        Found {results.length} result{results.length !== 1 ? "s" : ""}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {results.map((item) => (
                            <Link
                                key={item.id}
                                href={`/listings/${item.id}`}
                                className="group block bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <div className="aspect-square relative overflow-hidden">
                                    {item.image_url ? (
                                        <Image
                                            src={item.image_url}
                                            alt={item.title}
                                            width={300}
                                            height={300}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-muted flex items-center justify-center">
                                            <Store className="h-12 w-12 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold truncate mb-1 group-hover:text-primary transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-lg font-bold text-primary mb-2">
                                        ${item.price}
                                    </p>
                                    {item.location && (
                                        <p className="text-sm text-muted-foreground">
                                            {item.location}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </>
            ) : !isLoading ? (
                <div className="text-center py-12">
                    <Store className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h2 className="text-xl font-semibold mb-2">No results found</h2>
                    <p className="text-muted-foreground mb-4">
                        No items found for &quot;{query}&quot;. Try searching with different keywords.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Browse all listings
                    </Link>
                </div>
            ) : null}
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center">
                    <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50 animate-pulse" />
                    <h1 className="text-2xl font-bold mb-2">Loading...</h1>
                    <p className="text-muted-foreground">Preparing search page</p>
                </div>
            </div>
        }>
            <SearchPageContent />
        </Suspense>
    );
}
