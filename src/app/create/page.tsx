"use client";

import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function CreateListing() {
    return (
        <article className="flex flex-col items-center p-4 flex-1 min-h-[calc(100vh-65px)]">
            <h1 className="text-2xl font-bold mb-4">Choose listing type</h1>
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-3xl">
                <Link href="/create/item" className="cursor-pointer">
                    <div className="border rounded hover:shadow-lg transition-shadow duration-300 p-4 flex flex-col items-center text-center">
                        <Skeleton className="h-24 w-24 mb-4 rounded-full" />
                        <h2 className="text-lg font-semibold">Item for sale</h2>
                        <p className="text-sm text-gray-500">
                            Create a single listing for one or more items to sell.
                        </p>
                    </div>
                </Link>
                <Link
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    className="opacity-50 pointer-events-none"
                    tabIndex={-1}
                    aria-disabled="true"
                >
                    <div className="border rounded transition duration-500 hover:shadow-lg p-4 flex flex-col items-center text-center">
                        <Skeleton className="h-24 w-24 mb-4 rounded-full bg-primary" />
                        <h2 className="text-lg font-semibold">Vehicle for sale</h2>
                        <p className="text-sm text-gray-500">
                            Sell a car, truck, or other type of vehicle.
                        </p>
                    </div>
                </Link>
                <Link
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    className="opacity-50 pointer-events-none"
                    tabIndex={-1}
                    aria-disabled="true"
                >
                    <div className="border rounded transition duration-500 hover:shadow-lg p-4 flex flex-col items-center text-center">
                        <Skeleton className="h-24 w-24 mb-4 rounded-full bg-secondary" />
                        <h2 className="text-lg font-semibold">Home for sale or rent</h2>
                        <p className="text-sm text-gray-500">
                            List a house or apartment for sale or rent.
                        </p>
                    </div>
                </Link>
            </section>
        </article>
    );
}
