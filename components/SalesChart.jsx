"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const options = {
    chart: { type: "area", toolbar: { show: false }},
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'], labels: { style: { colors: '#fff' } }},
    yaxis: { labels: { style: { colors: '#fff' }}},
    stroke: { curve: 'smooth' },
    dataLabels: { enabled: false }
};

const series = [
    { name: "year 1", data: [1000, 2400, 1350, 1050, 1849, 1900] },
    { name: 'year 2', data: [1200, 1789, 1400, 1378, 2070, 1789] }
];

export default function SalesChart({ className }) {
    return (
        <Card className={`${ className } bg-blue-900/30 p-4 rounded-lg shadow-lg border border-blue-400/20 hover:shadow-xl transition-all text-white`}>
            <CardHeader>
                <CardTitle>Product Manufactured</CardTitle>
            </CardHeader>
            <CardContent>
                <Chart options={options} series={series} type="area" height={300} />
            </CardContent>
        </Card>
    );
}
