"use client";

import React from "react";
import { BoxIcon, QrCodeIcon, PieChartIcon } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const services = [
    { link: "#", title: "Dashboard", icon: PieChartIcon },
    { link: "#", title: "QR Code Generator", icon: QrCodeIcon }
];

export default function SideBarComponent() {
    return (
        <Card className="rounded-none">
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
                            <a href={s.link}>{s.title}</a>
                        </div>
                    </div>
                ))}
            </CardContent>
            <CardFooter></CardFooter>
        </Card>
    );
}