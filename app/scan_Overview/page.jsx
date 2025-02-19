"use client";

import { MoonIcon, Settings } from "lucide-react";
import React, { useState, useEffect } from "react";
import SalesChart from "@/components/SalesChart";
import ProductPieChart from "@/components/ProductPieChart";
import SideBarComponent from "@/components/SideBarComponent";
import { Table, TableBody, TableCell, TableRow, TableHeader, TableHead } from "@/components/ui/table";

const topProducts = [{name: 'Parle-G', amount: 1287},{name: 'Sprite', amount: 4000}, {name: 'Slice', amount: 3900}]
topProducts.sort((a,b) => (a.amount - b.amount)).reverse();

const series = [
    {
      data: [
        {
          x: "New Delhi",
          y: 218,
        },
        {
          x: "Kolkata",
          y: 149,
        },
        {
          x: "Mumbai",
          y: 184,
        },
        {
          x: "Ahmedabad",
          y: 55,
        },
        {
          x: "Bangaluru",
          y: 84,
        },
        {
          x: "Pune",
          y: 31,
        },
        {
          x: "Chennai",
          y: 70,
        }
      ],
    },
  ]

const options = {
    chart: {
      height: 350,
      type: "treemap",
    }, 
    tooltip: {
        theme: "dark",
        style: {
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            color: "#ffffff", 
        },
        marker: {
            fillColors: ["#0000ff"], 
        }
    },
    colors: ["#008FFB", "#00E396", "#FEB019", "#FF4560"],
}

const options2 = {
    chart: { type: "line", toolbar: { show: false } }, 
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'], labels: { style: { colors: '#fff' } }},
    yaxis: { labels: { style: { colors: '#fff' }}},
    legend: {
        position: 'bottom',
    }
};

const series2 = [
    {
        name: "Sales",
        data: [1000, 2400, 1350, 1050, 1849, 1900]
    }
];

export default function Scans() {
    return (
        <div className="min-h-screen bg-gray-900 text-white">            
            <SideBarComponent />
            <main className="ml-64 p-10">
                <div className="flex flex-col h-full w-full">
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-md text-white">Scans</span>
                        <div className="flex flex-row mx-3 gap-2">
                            <MoonIcon className="text-white bg-none rounded-full" size={24}/>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 w-full gap-2 pr-2">
                        <SalesChart className="col-span-2 row-span-4 border-none shadow text-black" series={series} options={options} type={'treemap'} title={"Places Scanned"}/>
                        <ProductPieChart className="col-span-1 row-span-4 border-none shadow" series={series2} options={options2} type={'line'}/>
                    </div>
                    <div className="mt-2 w-fullbg-blue-900/30 p-2 rounded-lg shadow-lg border border-blue-400/20 hover:shadow-xl transition-all text-white">
                        <Table>
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
            </main>
        </div>

    );
}