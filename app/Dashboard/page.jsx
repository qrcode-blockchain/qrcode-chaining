"use client";

import SalesChart from "@/components/SalesChart";
import React, { useState, useEffect } from "react";
import ProductPieChart from "@/components/ProductPieChart"
import SideBarComponent from "@/components/SideBarComponent";
import { QrCodeIcon, Package2Icon, ScanIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow, TableHeader, TableHead } from "@/components/ui/table";

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
        <span className="text-2xl">{count.toLocaleString()}</span>
    </div>);
};
const topProducts = [{name: 'Parle-G', amount: 1287},{name: 'Sprite', amount: 4000}, {name: 'Slice', amount: 3900}]
topProducts.sort((a,b) => (a.amount - b.amount)).reverse();

export default function Home() {
    return (
        <div className="flex flex-col w-screen h-screen bg-blue-50">
            <div className="bg-blue-600 z-10 h-1/3 absolute w-full"></div>
            <div className="flex flex-grow z-20 w-full h-full">
                <SideBarComponent />
                <div className="grid grid-rows-[1fr,1fr,1fr,1fr,1fr,1fr] grid-cols-3 gap-4 flex-1 p-4">
                    <div className="col-span-3 grid grid-cols-4 gap-4 row-span-1">
                        <Card className="bg-white border-none shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <QrCodeIcon className="w-7 h-7 mr-3 bg-blue-600 text-white rounded-md" /> Total QR Codes Generated
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <NumberAnimation initialValue={0} finalValue={10000}/>
                            </CardContent>
                        </Card>
                        <Card className="bg-white border-none shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Package2Icon className="w-7 h-7 mr-3 bg-blue-600 text-white rounded-md" /> Types of Products
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <NumberAnimation initialValue={0} finalValue={250} />
                            </CardContent>
                        </Card>
                        <Card className="bg-white border-none shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <ScanIcon className="w-7 h-7 mr-3 bg-blue-600 text-white rounded-md" /> QR Codes Scanned
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <NumberAnimation initialValue={0} finalValue={14000} />
                            </CardContent>
                        </Card>
                        <Card className="bg-white border-none shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <ScanIcon className="w-7 h-7 mr-3 bg-blue-600 text-white rounded-md" /> Revenue
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <NumberAnimation initialValue={0} finalValue={1400} />
                            </CardContent>
                        </Card>
                    </div>

                    <SalesChart className="col-span-2 row-span-4 border-none shadow" />
                    <ProductPieChart className="col-span-1 row-span-4 border-none shadow" />

                    <div className="col-span-3 bg-white rounded-md">
                        <Table className=''>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product Name</TableHead>
                                    <TableHead>Amount Scanned</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {topProducts.map((p, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{ p.name }</TableCell>
                                        <TableCell>{ p.amount }</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
}