"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const options = {
  chart: { type: "radialBar", toolbar: { show: false } }, label: ["QR Codes"]
};

export default function ProductPieChart({ className }) {
  return (
    <Card className={`p-2 ${ className }`}>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Chart options={options} series={[70]} type="radialBar" height={300} />
      </CardContent>
    </Card>
  );
}
