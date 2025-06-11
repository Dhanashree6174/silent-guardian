import React, { useEffect, useState } from "react";
import { Mic, Camera, Plus, Activity, ChevronLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Link } from "react-router-dom";

const SafeApps = () => {
  const [cameraSafeApps, setCameraSafeApps] = useState([]);
  const [micSafeApps, setMicSafeApps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [micEditMode, setMicEditMode] = useState(false);
  const [camEditMode, setCamEditMode] = useState(false);
  const [newMicSafeApp, setNewMicSafeApp] = useState("");
  const [newCamSafeApp, setNewCamSafeApp] = useState("");

  useEffect(() => {
    const fetchSafeApps = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/safe-apps");
        setMicSafeApps(res.data.mic_apps || []);
        setCameraSafeApps(res.data.camera_apps || []);

        console.log("Safe apps loaded:", res.data);
      } catch (error) {
        console.error("Failed to load safe apps", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSafeApps();
  }, []);

  const modifySafeApps = () => {
    console.log("Modify safe apps button");
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

  const handleAddApp = async (type) => {
    const newApp = type === "mic" ? newMicSafeApp : newCamSafeApp;

    if (!newApp.trim()) return;

    try {
      const updatedList =
        type === "mic" ? [...micSafeApps, newApp] : [...cameraSafeApps, newApp];

      await axios.post("http://127.0.0.1:8000/update-safe-apps", {
        mic_apps: type === "mic" ? updatedList : micSafeApps,
        camera_apps: type === "camera" ? updatedList : cameraSafeApps,
      });

      if (type === "mic") {
        setMicSafeApps(updatedList);
        setNewMicSafeApp("");
      } else {
        setCameraSafeApps(updatedList);
        setNewCamSafeApp("");
      }
    } catch (error) {
      console.error("Error updating safe apps: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="m-3 flex justify-start items-center">
        <Link to="/" className="flex items-center space-x-1">
          <ChevronLeft className="w-5 h-5" />
          <span>Return to dashboard</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10 mx-5">
        {/* Microphone Safe Apps */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Mic className="w-5 h-5 text-blue-500" />
              <span>Microphone Safe Apps</span>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto"
                onClick={() => setMicEditMode(!micEditMode)}
              >
                {micEditMode ? "Cancel" : "Edit"}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {micSafeApps.length === 0 ? (
              <div className="text-center py-8">
                <Mic className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">
                  No microphone safe apps selected
                </p>
              </div>
            ) : (
              <div className="space-y-2 mb-4">
                {micSafeApps.map((app, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="font-medium text-sm">{app}</span>
                  </div>
                ))}
              </div>
            )}
            {micEditMode && (
              <div className="flex items-center space-x-2">
                <Input
                  value={newMicSafeApp}
                  onChange={(e) => setNewMicSafeApp(e.target.value)}
                  placeholder="Add microphone safe app"
                />
                <Button variant="outline" onClick={() => handleAddApp("mic")}>
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Camera Safe Apps */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Camera className="w-5 h-5 text-blue-500" />
              <span>Camera Safe Apps</span>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto"
                onClick={() => setCamEditMode(!camEditMode)}
              >
                {camEditMode ? "Cancel" : "Edit"}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cameraSafeApps.length === 0 ? (
              <div className="text-center py-8">
                <Mic className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">
                  No camera safe apps selected
                </p>
              </div>
            ) : (
              <div className="space-y-2 mb-4">
                {cameraSafeApps.map((app, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="font-medium text-sm">{app}</span>
                  </div>
                ))}
              </div>
            )}
            {camEditMode && (
              <div className="flex items-center space-x-2">
                <Input
                  value={newCamSafeApp}
                  onChange={(e) => setNewCamSafeApp(e.target.value)}
                  placeholder="Add camera safe app"
                />
                <Button
                  variant="outline"
                  onClick={() => handleAddApp("camera")}
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SafeApps;
