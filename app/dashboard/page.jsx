"use client";

import SalesChart from "../../components/SalesChart";
import { LucideTableCellsSplit, MoonIcon } from "lucide-react";
import React from "react";
import DashboardCards from "../../components/DashboardCards";
import ProductPieChart from "../../components/ProductPieChart";
import SideBarComponent from "../../components/SideBarComponent";

const series = [
    { name: "year 1", data: [1000, 2400, 1350, 1050, 1849, 1900] },
    { name: "year 2", data: [1200, 1789, 1400, 1378, 2070, 1789] }
];

const options = {
    chart: { toolbar: { show: false } },
    xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
        labels: { style: { colors: '#fff' } }
    },
    yaxis: { labels: { style: { colors: '#fff' } } },
    stroke: { curve: "smooth" },
    dataLabels: { enabled: false }
};

const productData = [20, 35, 25, 15, 30];
const labelList = ['Slice', 'Parle-G', 'MarieGold', 'Sprite', 'Oreo']
const pieOptions = {
    chart: {
        type: 'pie',
    },
    labels: labelList,
    colors: ['#FF4560', '#008FFB', '#00E396', '#FEB019', '#775DD0'],
    legend: {
        position: 'bottom',
        labels: {
            colors: '#ffffff'
        }
    },
    tooltip: {
        style: {
            fontSize: '12px',
            color: '#000'
        }
    }
};

const topProducts = [...[
    { name: "Parle-G", amount: 1287 },
    { name: "Sprite", amount: 4000 },
    { name: "Slice", amount: 3900 }
]].sort((a, b) => b.amount - a.amount);

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-900 text-white flex">
            {/* Sidebar */}
            <SideBarComponent />
            <main className="ml-64 p-10 flex-1">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-lg font-semibold">Dashboard</h1>
                        <MoonIcon className="text-white cursor-pointer" size={24} />
                    </div>

                    {/* Dashboard Cards */}
                    <div className="w-full my-4">
                        <DashboardCards />
                    </div>

                    {/* Sales and Product Charts */}
                    <div className="grid grid-cols-3 gap-4">
                            <SalesChart 
                                className="col-span-2 row-span-4 border-none shadow" 
                                series={series} 
                                options={options} 
                                type={'area'} 
                                title={"Products Manufactured"}
                            />
                            <ProductPieChart className="col-span-1 row-span-4 border-none shadow"
                                series={productData}
                                options={pieOptions}
                                type={'pie'}  />
                    </div>

                    {/* Top Scanned Products Table */}
                    <div className="mt-4 bg-white rounded-lg shadow p-4">
                        <h2 className="text-gray-800 font-medium text-lg mb-2">
                            Top Scanned Products
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse">
                                <thead>
                                    <tr className="border-b bg-gray-100">
                                        <th className="p-3 text-left text-sm font-semibold text-gray-700">
                                            Product Name
                                        </th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-700">
                                            Amount Scanned
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topProducts.map((p, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="p-3 text-sm text-gray-700">
                                                {p.name}
                                            </td>
                                            <td className="p-3 text-sm text-gray-700">
                                                {p.amount}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
