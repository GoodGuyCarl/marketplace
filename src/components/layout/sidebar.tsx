"use client";

import {
    Book,
    Dog,
    Fence,
    KeyboardMusic,
    Palette,
    Plus,
    Search,
    Shirt,
    Smartphone,
    Store,
    Tablets,
    ToyBrick,
    Volleyball,
    Wrench,
    Loader2,
    X,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface SearchResult {
    id: string;
    title: string;
    price: number;
    image_url?: string;
    location?: string;
    category: string;
    description?: string;
}

export default function Sidebar() {
    const pathname = usePathname();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    // Debounced search function
    const performSearch = async (query: string) => {
        if (query.length < 3) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        setIsSearching(true);
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=8`);
            if (response.ok) {
                const results = await response.json();
                setSearchResults(results);
                setShowResults(true);
            } else {
                console.error("Search failed:", response.statusText);
                setSearchResults([]);
                setShowResults(false);
            }
        } catch (error) {
            console.error("Search error:", error);
            setSearchResults([]);
            setShowResults(false);
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
            setShowResults(false);
        }
    };

    // Clear search
    const clearSearch = () => {
        setSearchQuery("");
        setSearchResults([]);
        setShowResults(false);
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
    };

    // Hide search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    const categories = [
        {
            name: "Electronics",
            href: "/category/electronics",
            icon: <Smartphone className="h-6 w-6" />,
        },
        { name: "Fashion", href: "/category/fashion", icon: <Shirt className="h-6 w-6" /> },
        {
            name: "Home & Garden",
            href: "/category/home-garden",
            icon: <Fence className="h-6 w-6" />,
        },
        {
            name: "Sports & Outdoors",
            href: "/category/sports-outdoors",
            icon: <Volleyball className="h-6 w-6" />,
        },
        {
            name: "Toys & Games",
            href: "/category/toys-games",
            icon: <ToyBrick className="h-6 w-6" />,
        },
        { name: "Automotive", href: "/category/automotive", icon: <Wrench className="h-6 w-6" /> },
        {
            name: "Health & Beauty",
            href: "/category/health-beauty",
            icon: <Tablets className="h-6 w-6" />,
        },
        {
            name: "Books & Media",
            href: "/category/books-media",
            icon: <Book className="h-6 w-6" />,
        },
        {
            name: "Collectibles & Art",
            href: "/category/collectibles-art",
            icon: <Palette className="h-6 w-6" />,
        },
        {
            name: "Music & Instruments",
            href: "/category/music-instruments",
            icon: <KeyboardMusic className="h-6 w-6" />,
        },
        {
            name: "Pets & Animals",
            href: "/category/pets-animals",
            icon: <Dog className="h-6 w-6" />,
        },
    ];

    return (
        <aside className="hidden md:block w-80 bg-background border-r border-border p-4 overflow-y-scroll h-[calc(100vh-65px)]">
            <div className="mb-4 relative" ref={searchContainerRef}>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="search"
                        placeholder="Search Marketplace"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => searchQuery.length >= 3 && setShowResults(true)}
                        className="w-full pl-10 pr-10 py-2 h-9 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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

                {/* Search Results Dropdown */}
                {showResults && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                        {searchResults.length > 0 ? (
                            <div className="p-2">
                                <div className="text-xs text-muted-foreground mb-2 px-2">
                                    {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                                </div>
                                {searchResults.map((item: SearchResult) => (
                                    <Link
                                        key={item.id}
                                        href={`/listings/${item.id}`}
                                        onClick={() => setShowResults(false)}
                                        className="block p-3 hover:bg-muted rounded-lg transition-colors"
                                    >
                                        <div className="flex items-start space-x-3">
                                            {item.image_url ? (
                                                <Image
                                                    src={item.image_url}
                                                    alt={item.title}
                                                    width={48}
                                                    height={48}
                                                    className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <Store className="h-6 w-6 text-muted-foreground" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-medium truncate">{item.title}</h4>
                                                <p className="text-sm text-primary font-semibold">${item.price}</p>
                                                {item.location && (
                                                    <p className="text-xs text-muted-foreground">{item.location}</p>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                                {searchResults.length >= 8 && (
                                    <div className="mt-2 pt-2 border-t border-border">
                                        <Link
                                            href={`/search?q=${encodeURIComponent(searchQuery)}`}
                                            onClick={() => setShowResults(false)}
                                            className="block p-2 text-center text-sm text-primary hover:bg-muted rounded-lg transition-colors"
                                        >
                                            View all results for &quot;{searchQuery}&quot;
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ) : searchQuery.length >= 3 && !isSearching ? (
                            <div className="p-4 text-center text-muted-foreground">
                                <Store className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No items found for &quot;{searchQuery}&quot;</p>
                                <p className="text-xs mt-1">Try searching with different keywords</p>
                            </div>
                        ) : searchQuery.length > 0 && searchQuery.length < 3 ? (
                            <div className="p-4 text-center text-muted-foreground">
                                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Type at least 3 characters to search</p>
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
            <section className="space-y-2">
                <Link
                    href="/"
                    className={`${
                        pathname === "/" ? "bg-muted" : ""
                    } flex items-center text-base font-medium space-x-2 hover:bg-muted hover:scale-105 transition duration-500 rounded p-2`}
                >
                    <span className="p-2.5 rounded-4xl bg-primary text-white">
                        <Store className="h-6 w-6" />
                    </span>
                    <span>Browse marketplace</span>
                </Link>
                <Link href="/create">
                    <Button className="w-full cursor-pointer" variant="default" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Create new listing
                    </Button>
                </Link>
            </section>
            <section className="mt-6 space-y-2">
                <h2 className="text-lg font-semibold mb-2">Categories</h2>
                {categories.map((category, index) => (
                    <Link
                        key={index}
                        href={category.href}
                        className={`${
                            pathname === category.href ? "bg-muted" : ""
                        } flex items-center text-base font-medium space-x-2 hover:bg-muted hover:scale-105 transition duration-500 rounded p-2`}
                    >
                        <span className="p-2.5 rounded-4xl bg-primary text-white">
                            {category.icon}
                        </span>
                        <span>{category.name}</span>
                    </Link>
                ))}
            </section>
        </aside>
    );
}
