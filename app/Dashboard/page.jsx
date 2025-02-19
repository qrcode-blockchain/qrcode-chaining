"use client";

import SalesChart from "@/components/SalesChart";
import { MoonIcon, Settings } from "lucide-react";
import React, { useState, useEffect } from "react";
import DashboardCards from "@/components/DashboardCards";
import ProductPieChart from "@/components/ProductPieChart";
import SideBarComponent from "@/components/SideBarComponent";
import { Table, TableBody, TableCell, TableRow, TableHeader, TableHead } from "@/components/ui/table";

const topProducts = [{name: 'Parle-G', amount: 1287},{name: 'Sprite', amount: 4000}, {name: 'Slice', amount: 3900}]
topProducts.sort((a,b) => (a.amount - b.amount)).reverse();

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-900 text-white">            
            <SideBarComponent />
            <main className="ml-64 p-10">
                <div className="flex flex-col h-full w-full">
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-md text-white">Dashboard</span>
                        <div className="flex flex-row mx-3 gap-2">
                            <MoonIcon className="text-white bg-none rounded-full" size={24}/>
                        </div>
                    </div>
                    <div className="w-full my-2">
                        <DashboardCards />
                    </div>
                    <div className="grid grid-cols-3 w-full gap-2 pr-2 mb-2">
                        <SalesChart className="col-span-2 row-span-4 border-none shadow" />
                        <ProductPieChart className="col-span-1 row-span-4 border-none shadow" />
                    </div>
                    <div className="bg-blue-900/30 p-4 rounded-lg shadow-lg border border-blue-400/20 hover:shadow-xl transition-all text-white">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product Name</TableHead>
                                    <TableHead>Amount Scanned</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {topProducts.map((p, index) => (
                                    <TableRow key={index}  className="text-gray">
                                        <TableCell>{ p.name }</TableCell>
                                        <TableCell>{ p.amount }</TableCell>
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