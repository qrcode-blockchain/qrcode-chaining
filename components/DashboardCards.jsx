"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { QrCode, Package, Scan, IndianRupee } from "lucide-react";

const NumberAnimation = ({ initialValue, finalValue }) => {
    const [count, setCount] = useState(initialValue);
    const duration = 1000;
    const frameRate = 30;

    useEffect(() => {
        let startValue = initialValue;
        const totalFrames = (duration / 1000) * frameRate;
        const step = Math.ceil((finalValue - initialValue) / totalFrames);

        const interval = setInterval(() => {
            startValue = Math.min(finalValue, startValue + step);
            setCount(startValue);
            if (startValue >= finalValue) {
                clearInterval(interval);
            }
        }, 1000 / frameRate);

        return () => clearInterval(interval);
    }, [initialValue, finalValue]);

    return (<div className="text-right bg-none">
        <span className="text-lg font-semibold">{count.toLocaleString()}</span>
    </div>);
};
export default function DashboardCards() {
    const cards = [
        { title: "QR Codes Generated", value: 10000, Icon: QrCode },
        { title: "Types of Products", value: 250, Icon: Package },
        { title: "QR Codes Scanned", value: 14000, Icon: Scan },
        { title: "Revenue", value: 1400, Icon: IndianRupee },
    ];

    return (
        <div className="grid grid-cols-4 gap-1 w-full">
            { cards.map(({ title, value, Icon }, index) => (
                <Card key={index} className="w-full max-w-[300px] p-2 rounded-2xl shadow-lg">
                    <CardContent className="flex flex-col gap-2 p-0 ">
                        <p className="text-md uppercase opacity-80">{ title }</p>
                        <div className="flex items-center justify-between">
                            <NumberAnimation initialValue={0} finalValue={ value } />
                            <Icon size={32} />
                        </div>
                        <p className="text-sm text-green-300">
                            +3.48% <span className="opacity-70 text-gray-400">Since last month</span>
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};