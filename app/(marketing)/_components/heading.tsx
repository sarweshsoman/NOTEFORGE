"use client";
import { useConvexAuth } from "convex/react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Spinner } from "@/components/spinner";
import { SignInButton } from "@clerk/clerk-react";
import Link from "next/link";

export const Heading = () => {
    const { isAuthenticated, isLoading } = useConvexAuth();

    return (

        <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
                Ideas Documents Plans <span className="underline">Noteforge</span>
            </h1>
            <h3>
                This is where you can write everything that comes to your mind
            </h3>
            {isLoading && (
                <div className="w-full flex items-center justify-center">
                    <Spinner size="lg" />
                </div>
            )}
            {isAuthenticated && !isLoading && (
                <Button asChild>
                    <Link href="/documents">
                        Enter Noteforge
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                </Button>
            )}
            {!isAuthenticated && !isLoading && (
                <SignInButton mode="modal">
                    <Button>
                        Sign In
                    </Button>
                </SignInButton>           
            )}
        </div>
    );
};
