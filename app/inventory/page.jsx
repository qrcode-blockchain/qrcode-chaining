"use client";

import SalesChart from "@/components/SalesChart";
import { MoonIcon, Settings } from "lucide-react";
import React, { useState, useEffect } from "react";
import ProductPieChart from "@/components/ProductPieChart";
import SideBarComponent from "@/components/SideBarComponent";
import { Table, TableBody, TableCell, TableRow, TableHeader, TableHead } from "@/components/ui/table";

export default function Inventory() {
    const [products, setProducts] = useState([]);
    const [shippedUnits, setShippedUnits] = useState({});

    useEffect(() => {
        fetch("/api/products/summary")
            .then((res) => res.json())
            .then((response) => {
                const data = response.data
                setProducts(data);

                let shippedData = {};
                data.forEach((p) => {
                    shippedData[p._id] = Math.round((Math.random() * 20));
                });
                setShippedUnits(shippedData);
            })
            .catch((error) => console.error("Error fetching product summary:", error));
    }, []);

    return (
    <div className="min-h-screen bg-gray-900 text-white">            
            <SideBarComponent />
            <main className="ml-64 p-10">
                <div className="flex flex-col h-full w-full">
                    <div className="flex items-center justify-between mt-2">
                    <span className="text-md text-white">Inventory</span>
                        <div className="flex flex-row mx-3 gap-2">
                            <MoonIcon className="text-white bg-none rounded-full" size={24}/>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 w-full gap-2 pr-2">
                        <SalesChart className="col-span-2 row-span-4 border-none shadow" />
                        <ProductPieChart className="col-span-1 row-span-4 border-none shadow" />
                    </div>
                    <div className="mt-2 w-full bg-blue-900/30 p-2 rounded-lg shadow-lg border border-blue-400/20 hover:shadow-xl transition-all text-white">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product Name</TableHead>
                                    <TableHead>Units Produced</TableHead>
                                    <TableHead>Units Shipped</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Value</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((p, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{ p._id }</TableCell>
                                        <TableCell>{ p.totalAmount }</TableCell>
                                        <TableCell>{ shippedUnits[p._id] }</TableCell>
                                        <TableCell>{ p.price }</TableCell>
                                        <TableCell>{ p.price * (p.totalAmount - shippedUnits[p._id]) }</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </main>
        </div>
    );
}