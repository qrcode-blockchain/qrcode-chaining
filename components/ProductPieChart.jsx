"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
//change for staging purposes
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function ProductPieChart({ className, options, series, type }) {
  return (
    <Card className={`bg-blue-900/30 p-2 rounded-lg shadow-lg border border-blue-400/20 hover:shadow-xl transition-all text-white ${ className }`}>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Chart options={options} series={series} type={type} height={290} />
      </CardContent>
    </Card>
  );
}
