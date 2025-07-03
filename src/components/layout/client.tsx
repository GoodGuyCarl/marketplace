"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";

interface ClientLayoutProps {
    children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
    const pathname = usePathname();

    return (
        <>
            <Header />
            <div className="flex">
                {pathname !== "/create/item" && !pathname.startsWith("/listings/") && <Sidebar />}
                <main className="flex-1 pt-0.5 pb-6 md:p-6">{children}</main>
            </div>
        </>
    );
}
