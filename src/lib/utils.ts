import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(price);
};

export const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return "now";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours}h ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays}d ago`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
        return `${diffInWeeks}w ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo ago`;
};

export const humanizeSlug = (slug: string): string => {
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
