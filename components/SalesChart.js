"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const options = {
  chart: { type: "bar", toolbar: { show: false } },
  xaxis: { categories: ["Sprite", "Slice", "Parle-G", "GoodDay", "Marie-gold"] },
};

const series = [{ name: "Units Manufactured", data: [1000, 2400, 1350, 1050, 1849] }];

export default function SalesChart({ className }) {
  return (
    <Card className={`p-2 ${ className }`}>
      <CardHeader>
        <CardTitle>Product Manufactured</CardTitle>
      </CardHeader>
      <CardContent>
        <Chart options={options} series={series} type="bar" height={300} />
      </CardContent>
    </Card>
  );
}
