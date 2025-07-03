"use client";

import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Bell, Mail } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "../theme-toggle";
import { usePathname } from "next/navigation";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "../ui/drawer";
import { categories } from "@/lib/categories";

export default function Header() {
    const pathname = usePathname();
    return (
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
                    <Search className="h-6 w-6 cursor-pointer" />
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
                        className={pathname.startsWith("/create") ? "rounded-full bg-accent" : ""}
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
                <Drawer>
                    <DrawerTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={
                                pathname.startsWith("/category") ? "rounded-full bg-accent" : ""
                            }
                        >
                            Categories
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <div className="mx-auto w-full max-w-sm">
                            <DrawerHeader className="text-center">
                                <DrawerTitle>Categories</DrawerTitle>
                                <DrawerDescription>Browse products by category</DrawerDescription>
                            </DrawerHeader>
                            <div className="p-4 pb-8 space-y-2">
                                {categories.map((category, index) => (
                                    <Link key={index} href={`/category/${category.value}`}>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-left h-12 px-4 hover:bg-accent rounded-lg transition-colors"
                                        >
                                            {category.name}
                                        </Button>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </DrawerContent>
                </Drawer>
            </nav>
        </header>
    );
}
