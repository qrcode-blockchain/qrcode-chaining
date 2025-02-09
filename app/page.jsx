import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
    return (
    <div className="container">
        <div className="flex flex-col items-center">
            <Button asChild>
                <Link href='/Dashboard'>Dashboard</Link>
            </Button>
            <Button asChild>
                <Link href="/Products_Form">Product Form</Link>
            </Button>
        </div>
    </div>
    )
}