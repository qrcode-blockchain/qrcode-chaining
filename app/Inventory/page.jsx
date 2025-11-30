"use client";

import SalesChart from "../../components/SalesChart";
import { MoonIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import SideBarComponent from "../../components/SideBarComponent";
const API = process.env.NEXT_API;
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

export default function Inventory() {
    const [products, setProducts] = useState([]);
    const [shippedUnits, setShippedUnits] = useState({});

    useEffect(() => {
        fetch("${API}/api/products/summary")
            .then((res) => res.json())
            .then((response) => {
                const data = response.data;
                setProducts(data);

                let shippedData = {};
                data.forEach((p) => {
                    shippedData[p._id] = Math.round(Math.random() * p.totalAmount);
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
                    
                    {/* Header Section */}
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-md text-white">Inventory</span>
                        <div className="flex flex-row mx-3 gap-2">
                            <MoonIcon className="text-white bg-none rounded-full" size={24} />
                        </div>
                    </div>

                    {/* Chart Section */}
                    <div className="grid grid-cols-3 w-full gap-2 pr-2">
                        <SalesChart 
                            className="col-span-3 row-span-4 border-none shadow" 
                            series={series} 
                            options={options} 
                            type={'area'} 
                            title={"Products Manufactured"}
                        />
                    </div>

                    {/* Table Section */}
                    <div className="mt-4 bg-blue-900/30 p-4 rounded-lg shadow-lg border border-blue-400/20 hover:shadow-xl transition-all text-white">
                        <h2 className="text-lg font-semibold mb-2">Product Summary</h2>
                        <div className="w-full overflow-x-auto">
                            <div className="min-w-full bg-gray-800 rounded-md">
                                {/* Table Header */}
                                <div className="grid grid-cols-5 py-2 px-4 bg-gray-700 border-b border-gray-600 font-semibold">
                                    <div className="text-left">Product Name</div>
                                    <div className="text-left">Units Produced</div>
                                    <div className="text-left">Units Shipped</div>
                                    <div className="text-left">Price</div>
                                    <div className="text-left">Value</div>
                                </div>

                                {/* Table Body */}
                                {products.map((p, index) => (
                                    <div key={index} className="grid grid-cols-5 py-2 px-4 border-b border-gray-700">
                                        <div>{p._id}</div>
                                        <div>{p.totalAmount}</div>
                                        <div>{shippedUnits[p._id]}</div>
                                        <div>{p.price}</div>
                                        <div>{p.price * (p.totalAmount - shippedUnits[p._id])}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
