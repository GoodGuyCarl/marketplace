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
    ShoppingBasket,
    Smartphone,
    Store,
    Tablets,
    ToyBrick,
    Volleyball,
    Wrench,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();

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
            <form className="mb-4 relative">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="search"
                        placeholder="Search Marketplace"
                        className="w-full pl-10 pr-4 py-2 h-9 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>
            </form>
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
