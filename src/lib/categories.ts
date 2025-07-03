import {
    Smartphone,
    Shirt,
    Home,
    Dumbbell,
    Gamepad2,
    Wrench,
    Heart,
    Book,
    Palette,
    Music,
    PawPrint,
    LucideIcon,
} from "lucide-react";

export interface Category {
    name: string;
    value: string;
    href: string;
    icon: LucideIcon;
}

export const categories: Category[] = [
    {
        name: "Electronics",
        value: "electronics",
        href: "/categories/electronics",
        icon: Smartphone,
    },
    { name: "Fashion", value: "fashion", href: "/categories/fashion", icon: Shirt },
    { name: "Home & Garden", value: "home-garden", href: "/categories/home-garden", icon: Home },
    {
        name: "Sports & Outdoors",
        value: "sports-outdoors",
        href: "/categories/sports-outdoors",
        icon: Dumbbell,
    },
    { name: "Toys & Games", value: "toys-games", href: "/categories/toys-games", icon: Gamepad2 },
    { name: "Automotive", value: "automotive", href: "/categories/automotive", icon: Wrench },
    {
        name: "Health & Beauty",
        value: "health-beauty",
        href: "/categories/health-beauty",
        icon: Heart,
    },
    { name: "Books & Media", value: "books-media", href: "/categories/books-media", icon: Book },
    {
        name: "Collectibles & Art",
        value: "collectibles-art",
        href: "/categories/collectibles-art",
        icon: Palette,
    },
    {
        name: "Music & Instruments",
        value: "music-instruments",
        href: "/categories/music-instruments",
        icon: Music,
    },
    {
        name: "Pets & Animals",
        value: "pets-animals",
        href: "/categories/pets-animals",
        icon: PawPrint,
    },
];

// Helper function to get category by name
export const getCategoryByName = (name: string): Category | undefined => {
    return categories.find((category) => category.name === name);
};

// Helper function to get category by href
export const getCategoryByHref = (href: string): Category | undefined => {
    return categories.find((category) => category.href === href);
};
