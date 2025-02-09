"use client";

import React from "react";
import Link from "next/link";
import { QrCodeIcon, PieChartIcon, QrCode } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const services = [
    { link: "/Dashboard", title: "Dashboard", icon: PieChartIcon },
    { link: "/Products_Form", title: "QR Code Generator", icon: QrCodeIcon }
];

export default function SideBarComponent() {
    return (
        <Card className="m-3 shadow">
            <CardHeader>
                <div className="flex gap-2 items-center">
                    <QrCode className="w-8 h-8 text-blue-600"/><span>QR Chain</span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-row w-full">
                    <div className="w-full bg-white text-black flex items-center gap-2 p-2 hover:bg-gray-200 rounded">
                        <PieChartIcon className="w-5 h-5 text-blue-600" />
                        <Link href="/Dashboard">Dashboard</Link>
                    </div>
                </div>
                <div className="flex flex-row w-full">
                    <div className="w-full bg-white text-black flex items-center gap-2 p-2 hover:bg-gray-200 rounded">
                        <QrCodeIcon className="w-5 h-5 text-blue-600" />
                        <Link href="/Products_Form">QR Code Generator</Link>
                    </div>
                </div>
            </CardContent>
            <CardFooter></CardFooter>
        </Card>
    );
}