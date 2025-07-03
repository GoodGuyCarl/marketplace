"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Bell, Mail, X, Loader2, Store } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "../theme-toggle";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

interface SearchResult {
    id: string;
    title: string;
    price: number;
    image_url?: string;
    location?: string;
    category: string;
    description?: string;
}

export default function Header() {
    const pathname = usePathname();
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const mobileSearchInputRef = useRef<HTMLInputElement>(null);

    // Debounced search function
    const performSearch = async (query: string) => {
        if (query.length < 3) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=8`);
            if (response.ok) {
                const results = await response.json();
                setSearchResults(results);
            } else {
                console.error("Search failed:", response.statusText);
                setSearchResults([]);
            }
        } catch (error) {
            console.error("Search error:", error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    // Handle search input changes with debouncing
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Clear previous timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Set new timeout for debouncing (500ms delay)
        searchTimeoutRef.current = setTimeout(() => {
            performSearch(query);
        }, 500);
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape") {
            closeMobileSearch();
        }
    };

    // Open mobile search
    const openMobileSearch = () => {
        setShowMobileSearch(true);
        // Focus the input after the modal opens
        setTimeout(() => {
            mobileSearchInputRef.current?.focus();
        }, 100);
    };

    // Close mobile search
    const closeMobileSearch = () => {
        setShowMobileSearch(false);
        setSearchQuery("");
        setSearchResults([]);
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
    };

    // Clear search
    const clearSearch = () => {
        setSearchQuery("");
        setSearchResults([]);
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
    };

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    // Prevent body scroll when mobile search is open
    useEffect(() => {
        if (showMobileSearch) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [showMobileSearch]);

    return (
        <>
            <header className="flex flex-col">
                <nav className="flex items-center justify-between px-4 pt-4 md:p-4 bg-background md:border-b md:border-border">
                    <Link className="text-2xl font-bold" href="/">
                        Marketplace
                    </Link>
                    <section className="flex md:hidden items-center space-x-4">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="/path/to/avatar.jpg" alt="User Avatar" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <Search className="h-6 w-6 cursor-pointer" onClick={openMobileSearch} />
                    </section>
                    <section className="hidden md:flex items-center space-x-4">
                        <ModeToggle />
                        <Button variant="ghost" size="sm" className="cursor-pointer">
                            <Mail />
                        </Button>
                        <Button variant="ghost" size="sm" className="cursor-pointer">
                            <Bell />
                        </Button>
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="/path/to/avatar.jpg" alt="User Avatar" />
                            <AvatarFallback>CS</AvatarFallback>
                        </Avatar>
                    </section>
                </nav>
                <nav className="md:hidden flex items-center justify-start px-2 py-0.5 bg-background">
                    <Link href="/create">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={
                                pathname.startsWith("/create") ? "rounded-full bg-accent" : ""
                            }
                        >
                            Sell
                        </Button>
                    </Link>
                    <Link href="/">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={pathname === "/" ? "rounded-full bg-accent" : ""}
                        >
                            For you
                        </Button>
                    </Link>
                </nav>
            </header>

            {/* Mobile Search Modal */}
            {showMobileSearch && (
                <div className="fixed inset-0 z-50 md:hidden">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/50" onClick={closeMobileSearch} />

                    {/* Search Modal */}
                    <div className="relative bg-background h-full flex flex-col">
                        {/* Search Header */}
                        <div className="flex items-center px-4 py-3 border-b border-border">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    ref={mobileSearchInputRef}
                                    type="search"
                                    placeholder="Search Marketplace"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onKeyDown={handleKeyDown}
                                    className="w-full pl-10 pr-10 py-2 h-10 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                                {/* Loading spinner or clear button */}
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    {isSearching ? (
                                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                                    ) : searchQuery ? (
                                        <button
                                            onClick={clearSearch}
                                            className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors"
                                            aria-label="Clear search"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    ) : null}
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={closeMobileSearch}
                                className="ml-2 p-2"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Search Results */}
                        <div className="flex-1 overflow-y-auto">
                            {searchQuery.length >= 3 ? (
                                searchResults.length > 0 ? (
                                    <div className="p-4">
                                        <div className="text-sm text-muted-foreground mb-4">
                                            {searchResults.length} result
                                            {searchResults.length !== 1 ? "s" : ""} found
                                        </div>
                                        <div className="space-y-3">
                                            {searchResults.map((item: SearchResult) => (
                                                <Link
                                                    key={item.id}
                                                    href={`/listings/${item.id}`}
                                                    onClick={closeMobileSearch}
                                                    className="block p-3 hover:bg-muted rounded-lg transition-colors border border-border"
                                                >
                                                    <div className="flex items-start space-x-3">
                                                        {item.image_url ? (
                                                            <Image
                                                                src={item.image_url}
                                                                alt={item.title}
                                                                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                                                width={64}
                                                                height={64}
                                                            />
                                                        ) : (
                                                            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                                                                <Store className="h-8 w-8 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-base font-medium line-clamp-2">
                                                                {item.title}
                                                            </h4>
                                                            <p className="text-lg text-primary font-semibold">
                                                                ${item.price}
                                                            </p>
                                                            {item.location && (
                                                                <p className="text-sm text-muted-foreground">
                                                                    {item.location}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                        {searchResults.length >= 8 && (
                                            <div className="mt-4 pt-4 border-t border-border">
                                                <Link
                                                    href={`/search?q=${encodeURIComponent(
                                                        searchQuery
                                                    )}`}
                                                    onClick={closeMobileSearch}
                                                    className="block p-3 text-center text-primary hover:bg-muted rounded-lg transition-colors border border-border"
                                                >
                                                    View all results for &quot;{searchQuery}&quot;
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                ) : !isSearching ? (
                                    <div className="p-8 text-center text-muted-foreground">
                                        <Store className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                        <p className="text-lg">
                                            No items found for &quot;{searchQuery}&quot;
                                        </p>
                                        <p className="text-sm mt-2">
                                            Try searching with different keywords
                                        </p>
                                    </div>
                                ) : null
                            ) : searchQuery.length > 0 ? (
                                <div className="p-8 text-center text-muted-foreground">
                                    <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg">Type at least 3 characters to search</p>
                                </div>
                            ) : (
                                <div className="p-8 text-center text-muted-foreground">
                                    <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg">Search Marketplace</p>
                                    <p className="text-sm mt-2">
                                        Find items by title, description, or category
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
