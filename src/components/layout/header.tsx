import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Bell, Mail } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "../theme-toggle";

export default function Header() {
    return (
        <header className="flex flex-col">
            <nav className="flex items-center justify-between px-4 pt-4 md:p-4 bg-background md:border-b md:border-border">
                <Link className="text-2xl font-bold" href="/">Marketplace</Link>
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
            <nav className="md:hidden flex items-center justify-start px-2 bg-background">
                <Link href="/create" className="">
                    <Button variant="ghost" size="sm" className="">
                        Sell
                    </Button>
                </Link>
            </nav>
        </header>
    );
}
