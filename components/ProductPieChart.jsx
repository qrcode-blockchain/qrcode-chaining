"use client";

import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function ProductPieChart({ className, options, series, type }) {
    return (
        <div className={`bg-blue-900/30 p-2 rounded-lg shadow-lg border border-blue-400/20 hover:shadow-xl transition-all text-white ${className}`}>
            <div className="mb-2">
                <h2 className="text-lg font-semibold">Sales Overview</h2>
            </div>
            <div>
                <Chart options={options} series={series} type={type} height={290} />
            </div>
        </div>
    );
}
