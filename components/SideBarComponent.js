"use client";

import React from "react";
import Link from "next/link";
import { BoxIcon, QrCodeIcon, PieChartIcon } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const services = [
    { link: "/Dashboard", title: "Dashboard", icon: PieChartIcon },
    { link: "/Products_Form", title: "QR Code Generator", icon: QrCodeIcon }
];

export default function SideBarComponent() {
    return (
        <Card className="rounded-none border-t-0">
            <CardHeader>
                <div className="flex gap-2 items-center">
                    <BoxIcon className="w-8 h-8 text-blue-600"/><span>Services</span>
                </div>
            </CardHeader>
            <CardContent>
                {services.map((s, index) => (
                    <div key={index} className="flex flex-row w-full">
                        <div className="w-full bg-white text-black flex items-center gap-2 p-2 hover:bg-gray-200 rounded">
                            <s.icon className="w-5 h-5 text-blue-600" />
                            <Link href={s.link}>{s.title}</Link>
                        </div>
                    </div>
                ))}
            </CardContent>
            <CardFooter></CardFooter>
        </Card>
    );
}