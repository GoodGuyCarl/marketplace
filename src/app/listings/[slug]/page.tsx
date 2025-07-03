"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Listing } from "@/lib/types/Listing";
import { ArrowLeft, AlertCircle, X } from "lucide-react";
import Link from "next/link";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { formatPrice, formatTimeAgo, humanizeSlug } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";

interface FormData {
    buyer_email: string;
    message: string;
}

export default function ListingPage() {
    const params = useParams();
    const slug = params.slug as string | undefined;
    const [listing, setListing] = useState<Listing | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState<FormData>({
        buyer_email: "",
        message: "",
    });
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertType, setAlertType] = useState<"default" | "destructive">("default");

    useEffect(() => {
        if (alertMessage && alertType === "default") {
            const timer = setTimeout(() => {
                setAlertMessage(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [alertMessage, alertType]);

    useEffect(() => {
        if (!slug) return;

        const fetchListing = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/listings/${encodeURIComponent(slug)}`);
                const data = await response.json();
                setListing(data);
            } catch (error) {
                console.error("Error fetching listing:", error);
            } finally {
                setIsLoading(false);
            }
        };
        if (slug) {
            fetchListing();
        }
    }, [slug]);

    if (!slug) {
        return <div>Invalid listing URL</div>;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.buyer_email || !formData.message || !listing?.seller_email) {
            return;
        }

        try {
            const response = await fetch("/api/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    listing_id: listing?.id,
                    buyer_email: formData.buyer_email,
                    seller_email: listing?.seller_email,
                    message: formData.message,
                }),
            });

            if (!response.ok) {
                response.json().then((data) => {
                    console.error("Error sending message:", data);
                    setAlertMessage(data.error || "Failed to send message");
                    setAlertType("destructive");
                });
                return;
            }

            setAlertMessage("Message sent successfully!");
            setAlertType("default");
            setFormData({ buyer_email: "", message: "" });
        } catch (error) {
            console.error("Error sending message:", error);
            setAlertMessage("Failed to send message. Please try again later.");
            setAlertType("destructive");
        }
    };

    return (
        <>
            <article className="max-w-7xl mx-auto p-6">
                <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">
                    <ArrowLeft className="inline mr-2 h-4 w-4" />
                    Back to Marketplace
                </Link>
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <AspectRatio
                        ratio={9 / 16}
                        className="rounded-lg overflow-hidden bg-foreground/25 border border-border"
                    >
                        <Image
                            src={listing?.image_url || "https://placehold.co/600"}
                            alt={listing?.title || "Listing Image"}
                            className="w-full h-full object-contain object-center"
                            width={600}
                            height={900}
                        />
                    </AspectRatio>
                    <div className="flex flex-col">
                        {isLoading ? (
                            <>
                                <Skeleton className="h-8 w-3/4 mb-4 bg-foreground" />
                                <Skeleton className="h-6 w-1/2 mb-4 bg-foreground" />
                                <Skeleton className="h-4 w-2/3 mb-2 bg-foreground" />
                                <Skeleton className="h-4 w-1/3 mb-4 bg-foreground" />
                                <Skeleton className="h-4 w-1/4 mb-4 bg-foreground" />
                                <Skeleton className="h-6 w-1/3 mb-2 bg-foreground" />
                                <Skeleton className="h-20 w-full mb-4 bg-foreground" />
                                <Skeleton className="h-6 w-1/3 mb-2 bg-foreground" />
                                <Skeleton className="h-10 w-full mb-4 bg-foreground" />
                                <Skeleton className="h-20 w-full mb-4 bg-foreground" />
                                <Skeleton className="h-10 w-1/3 bg-foreground" />
                            </>
                        ) : (
                            <>
                                <h1 className="text-2xl font-bold mb-2">{listing?.title}</h1>
                                <p className="text-lg text-primary mb-4">
                                    {formatPrice(listing?.price || 0)}
                                </p>
                                <p className="text-sm mb-2">
                                    Listed {formatTimeAgo(new Date(listing?.created_at || 0))}
                                </p>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {listing?.location || "Location not specified"}
                                </p>
                                <p className="text-sm mb-4">
                                    Category: {humanizeSlug(listing?.category || "Uncategorized")}
                                </p>
                                <h5 className="text-lg font-semibold mb-2">Description</h5>
                                <p className="text-base mb-4">
                                    {listing?.description || "No description available."}
                                </p>
                                <h5 className="text-lg font-semibold mb-2">Seller Information</h5>
                                <p className="text-sm mb-2">
                                    {listing?.seller_email || "No email provided"}
                                </p>
                                <h5 className="text-lg font-semibold mb-2">Message Seller</h5>
                                <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
                                    <Label htmlFor="email" className="text-sm font-medium mb-1">
                                        Your Email
                                    </Label>
                                    <Input
                                        id="email"
                                        className="w-full"
                                        placeholder="your@email.com"
                                        value={formData.buyer_email}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                buyer_email: e.target.value,
                                            })
                                        }
                                    />
                                    <Label htmlFor="message" className="text-sm font-medium mb-1">
                                        Your Message
                                    </Label>
                                    <Textarea
                                        id="message"
                                        placeholder="Type your message here..."
                                        className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        value={formData.message}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                message: e.target.value,
                                            })
                                        }
                                    />
                                    <Button
                                        type="submit"
                                        className="cursor-pointer sbg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                                    >
                                        Send Message
                                    </Button>
                                </form>
                            </>
                        )}
                    </div>
                </section>
            </article>

            {/* Toast Alert */}
            {alertMessage && (
                <div
                    className="fixed bottom-4 left-4 right-4 sm:right-auto z-50 max-w-sm sm:max-w-md toast-enter"
                    style={{
                        animation: "slideInFromLeft 0.3s ease-out",
                    }}
                >
                    <Alert
                        variant={alertType}
                        className="shadow-xl border-2 relative pr-10 backdrop-blur-sm w-full"
                    >
                        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <AlertDescription className="pr-2 text-sm leading-relaxed">
                            {alertMessage}
                        </AlertDescription>
                        <button
                            onClick={() => setAlertMessage(null)}
                            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 p-1 hover:bg-muted/50"
                            aria-label="Close alert"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </Alert>
                </div>
            )}
        </>
    );
}
