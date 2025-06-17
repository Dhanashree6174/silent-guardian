import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, ChartBarBig } from "lucide-react";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement // Without registering BarElement, the Bar chart will fail to render or throw a runtime warning
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
    // tooltip: {
    //   backgroundColor: "hsl(var(--popover))",
    //   titleColor: "hsl(var(--popover-foreground))",
    //   bodyColor: "hsl(var(--popover-foreground))",
    //   borderColor: "hsl(var(--border))",
    //   borderWidth: 1,
    // },
  },
};

const processMicLogs = (logLines) => {
  // const lines = logText.split("\n"); // logText is already an array of strings as returned by backend

  const counts = {};

  logLines.forEach((line) => {
    if (line.includes("accessed microphone")) {
      const parts = line.split(" - ");
      if (parts.length >= 2) {
        const app = parts[1].replace(" accessed microphone", "").trim();
        counts[app] = (counts[app] || 0) + 1;
      }
    }
  });

  return counts;
};

export const MicUsagePieChart = ({ micData, micSafeApps }) => {
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
  }, []);

  if(!pieData) return <p> Loading chart...</p>;

  return (
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <PieChart className="w-5 h-5 text-purple-500" />
            <span>Mic Usage Distribution</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pieData.labels && pieData.labels.length > 0 ? (
            <div className="h-64 flex justify-center items-center">
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
  );
};

export const MicAccessBarChart = () => {
  const [barData, setBarData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchLogs = async () => {
      const response = await axios.get("http://127.0.0.1:8000/logs");
      const logText = response.data.logs;

      // console.log("logs: ", logText)

      const counts = processMicLogs(logText);

      setBarData({
        labels: Object.keys(counts),
        datasets: [
          {
            label: "Mic Accesses",
            data: Object.values(counts),
            backgroundColor: "#3b82f6",
            borderWidth: 2,
            borderColor: "hsl(var(--background))",
          },
        ],
      });
    };

    fetchLogs();
  }, []);

  if(!barData) return <p> Loading chart...</p>;

  return(
    <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <ChartBarBig className="w-5 h-5 text-purple-500" />
            <span>Mic Access Frequency Distribution</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {barData.labels && barData.labels.length > 0 ? (
            <div className="h-64 flex justify-center items-center">
              <Bar data={barData} options={chartOptions}/>
            </div>
          ) : (
            <div className="text-center py-8">
              <ChartBarBig className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No mic access logs found</p>
            </div>
          )}
        </CardContent>
      </Card>
  )
}
