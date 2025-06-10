import React, { useEffect, useState } from "react";
import axios from "axios";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // @ = /frontend/
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Mic, Camera, Shield, Activity, PieChart } from "lucide-react";

// Register chart components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale
);

const Dashboard = () => {
  const [micData, setMicData] = useState([]);
  const [cameraData, setCameraData] = useState([]);
  const [logs, setLogs] = useState([]);
  const [pieData, setPieData] = useState({
    labels: [],
    datasets: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch active devices data from FastAPI
        const activeDevicesResponse = await axios.get("http://127.0.0.1:8000/active-devices");
        setMicData(
          Array.isArray(activeDevicesResponse.data.mic_apps) ? activeDevicesResponse.data.mic_apps : []
        );
        setCameraData(
          Array.isArray(activeDevicesResponse.data.camera_apps)
            ? activeDevicesResponse.data.camera_apps
            : []
        );

        // Fetch running apps for the pie chart data
        const runningAppsResponse = await axios.get("http://127.0.0.1:8000/running-apps");
        const appCounts = runningAppsResponse.data.running_apps.reduce((acc, app) => {
          acc[app] = (acc[app] || 0) + 1;
          return acc;
        }, {});

        setPieData({
          labels: Object.keys(appCounts),
          datasets: [
            {
              data: Object.values(appCounts),
              backgroundColor: [
                "hsl(var(--primary))",
                "hsl(var(--secondary))",
                "hsl(var(--accent))",
                "hsl(var(--muted))",
                "hsl(var(--destructive))",
                "#10b981",
                "#f59e0b",
                "#ef4444",
                "#8b5cf6",
                "#06b6d4",
              ],
              borderWidth: 2,
              borderColor: "hsl(var(--background))",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to connect to the monitoring service. Please ensure the backend is running.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    
    // Set up polling every 1 min
    // const interval = setInterval(fetchData, 60000);
    // return () => clearInterval(interval);
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'hsl(var(--popover))',
        titleColor: 'hsl(var(--popover-foreground))',
        bodyColor: 'hsl(var(--popover-foreground))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Activity className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Privacy Monitor</h1>
              <p className="text-muted-foreground">Real-time device access tracking</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {error && (
          <Alert className="mb-6 border-destructive">
            <AlertDescription className="text-destructive">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Microphone Access Card */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Mic className="w-5 h-5 text-blue-500" />
                <span>Microphone Access</span>
                <Badge variant={micData.length > 0 ? "destructive" : "secondary"} className="ml-auto">
                  {micData.length} active
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {micData.length === 0 ? (
                <div className="text-center py-8">
                  <Mic className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No microphone access detected</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {micData.map((app, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="font-medium text-sm">{app}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Camera Access Card */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Camera className="w-5 h-5 text-green-500" />
                <span>Camera Access</span>
                <Badge variant={cameraData.length > 0 ? "destructive" : "secondary"} className="ml-auto">
                  {cameraData.length} active
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cameraData.length === 0 ? (
                <div className="text-center py-8">
                  <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No camera access detected</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {cameraData.map((app, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="font-medium text-sm">{app}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* App Distribution Chart */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <PieChart className="w-5 h-5 text-purple-500" />
                <span>App Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pieData.labels && pieData.labels.length > 0 ? (
                <div className="h-64 overflow-y-auto">
                  <Pie data={pieData} options={chartOptions}/>
                </div>
              ) : (
                <div className="text-center py-8">
                  <PieChart className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No running apps detected</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Status Bar */}
        <Card className="mt-6">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">Monitoring Active</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-sm text-muted-foreground">
                  Last updated: {new Date().toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>Total Apps: {(micData.length + cameraData.length)}</span>
                <Separator orientation="vertical" className="h-4" />
                <span>Privacy Level: {(micData.length + cameraData.length) === 0 ? 'Safe' : 'At Risk'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
