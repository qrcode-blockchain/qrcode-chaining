"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const options = {
  chart: { type: "pie", toolbar: { show: false } }, 
  labels: ["Sprite", "Slice", "Parle-G", "GoodDay", "Marie-gold"],
  legend: {
    position: 'bottom',
  }
};

export default function ProductPieChart({ className }) {
  return (
    <Card className={`bg-blue-900/30 p-2 rounded-lg shadow-lg border border-blue-400/20 hover:shadow-xl transition-all text-white ${ className }`}>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Chart options={options} series={[1000, 2400, 1350, 1050, 1849]} type="pie" height={290} />
      </CardContent>
    </Card>
  );
}
