"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

//change for staging 
export default function SalesChart({ className, series, type, options, title }) {
    return (
        <Card className={`${ className } bg-blue-900/30 p-4 rounded-lg shadow-lg border border-blue-400/20 hover:shadow-xl transition-all text-white`}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <Chart options={options} series={series} type={type} height={300} />
            </CardContent>
        </Card>
    );
}
