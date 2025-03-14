"use client";

import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function SalesChart({ className, series, type, options, title }) {
    return (
        <div className={`${className} bg-blue-900/30 p-4 rounded-lg shadow-lg border border-blue-400/20 hover:shadow-xl transition-all text-white`}>
            <div className="mb-2">
                <h2 className="text-lg font-semibold">{title}</h2>
            </div>
            <div>
                <Chart options={options} series={series} type={type} height={300} />
            </div>
        </div>
    );
}
