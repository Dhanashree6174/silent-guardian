import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "lucide-react";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "bottom",
      labels: {
        padding: 20,
        usePointStyle: true,
      },
    },
    tooltip: {
      backgroundColor: "hsl(var(--popover))",
      titleColor: "hsl(var(--popover-foreground))",
      bodyColor: "hsl(var(--popover-foreground))",
      borderColor: "hsl(var(--border))",
      borderWidth: 1,
    },
  },
};

const MicUsagePieChart = ({ micData, micSafeApps }) => {
  const [pieData, setPieData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    // setting Pie data
    // console.log("micData: ", micData);
    if (micData.length === 0) {
      setPieData({
        labels: [],
        datasets: [],
      });
    } else {
      let safeMicAppCount = 0;
      let unsafeMicAppCount = 0;

      micData.forEach((app) => {
        if (micSafeApps.includes(app)) {
          safeMicAppCount++;
        } else {
          unsafeMicAppCount++;
        }
      });

      setPieData({
        labels: ["Safe Apps", "Unsafe Apps"],
        datasets: [
          {
            data: [safeMicAppCount, unsafeMicAppCount],
            backgroundColor: ["#10b981", "#ef4444"],
            borderWidth: 2,
            borderColor: "hsl(var(--background))",
          },
        ],
      });
    }
    // console.log("Pie data being passed:", pieData);
  });

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <PieChart className="w-5 h-5 text-purple-500" />
            <span>Mic Usage Distribution</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pieData.labels && pieData.labels.length > 0 ? (
            <div className="h-64">
              <Pie data={pieData} options={chartOptions} />
            </div>
          ) : (
            <div className="text-center py-8">
              <PieChart className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No mic usage data found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default MicUsagePieChart;
