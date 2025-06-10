// Reactc JS entry point --> renderer.jsx (changed extension from .js to .jsx)

import React, { useEffect, useState } from "react";
import axios from "axios";
import SafeAppsButton from "./SafeAppsButton";
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
  }); // useState({}) gave Uncaught TypeError: Cannot read properties of undefined (reading 'map') error, using this useState() fixed it!

  useEffect(() => {
    // Fetch active devices data from FastAPI
    axios
      .get("http://127.0.0.1:8000/active-devices")
      .then((response) => {
        setMicData(
          Array.isArray(response.data.mic_apps) ? response.data.mic_apps : []
        );
        setCameraData(
          Array.isArray(response.data.camera_apps)
            ? response.data.camera_apps
            : []
        );
      })
      .catch((error) => console.error("Error fetching active devices:", error));

    // Fetch logs from FastAPI
    // axios
    //   .get("http://127.0.0.1:8000/logs")
    //   .then((response) => {
    //     setLogs(response.data.logs);
    //   })
    //   .catch((error) => console.error("Error fetching logs:", error));

    // Fetch running apps for the pie chart data
    axios
      .get("http://127.0.0.1:8000/running-apps")
      .then((response) => {
        // Sample pie data based on how you want to visualize app access
        const appCounts = response.data.running_apps.reduce((acc, app) => {
          acc[app] = (acc[app] || 0) + 1;
          return acc;
        }, {});

        setPieData({
          labels: Object.keys(appCounts),
          datasets: [
            {
              data: Object.values(appCounts),
              backgroundColor: [
                "#FF5733",
                "#33FF57",
                "#3357FF",
                "#F3FF33",
                "#33FFF3",
              ],
            },
          ],
        });
      })
      .catch((error) => console.error("Error fetching running apps:", error));
  }, []);
  console.log("micData:", micData);
  console.log("cameraData:", cameraData);
  // console.log("logs:", logs);
  console.log("pieData:", pieData);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="active-devices">
        <h2>Active Devices</h2>
        <div>
          <h3>Microphone Access:</h3>
          <ul>
            {micData.map((app, index) => (
              <li key={index}>{app}</li>
            ))}
            {/* || [] to prevent mapping on undefined micData */}
          </ul>
        </div>

        <div>
          <h3>Camera Access:</h3>
          {cameraData.length === 0 ? (
            <p>No camera apps detected.</p>
          ) : (
            <ul>
              {cameraData.map((app, index) => (
                <li key={index}>{app}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* <div className="logs">
        <h2>Logs</h2>
        <ul>
          {logs.map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
      </div> */}

      <div className="pie-chart">
        <h2>App Access Pie Chart</h2>
        <Pie data={pieData} />
      </div>

      <SafeAppsButton/>
    </div>
  );
};

export default Dashboard;

// const fetchRunningApps = async () => {
//   fetch("http://127.0.0.1:8000/running-apps")
//     .then((res) => res.json())
//     .then((data) => {
//       const ul = document.getElementById("appList");
//       data.running_apps.forEach((app) => {
//         const li = document.createElement("li");
//         li.textContent = app;
//         ul.appendChild(li);
//       });
//     });
// };

// fetchRunningApps();

// const fetchAudioUsageData = async () => {
//   try{
//     const res = await fetch("http://127.0.0.1:8000/active-devices");
//     const data = await res.json();
//     const activeVoiceAppsList = document.getElementById("activeVoiceApps");
//     activeVoiceAppsList.innerHTML = "";

//     data.mic_apps.forEach((app) => {
//       const li = document.createElement("li");
//       li.textContent = app;
//       activeVoiceAppsList.appendChild(li);

//       if (data.suspicious.includes(app)) {
//         new Notification("⚠️ Suspicious Mic Access", {
//           body: `${app} is using the mic!`,
//         });
//       }
//     });

//     const camStatus = document.getElementById("cam-status");
//     if(data.camera_active){
//       // if(data.camera_apps){
//       //   console.log("camera using apps : ", camera_apps);
//       //   camStatus.textContent = `🟥 Camera is in use by: ${data.camera_apps.join(", ")}!`;
//       // }
//       // else{
//       //   console.log("No apps to show");
//       //   camStatus.textContent = "🟥 Camera is in use!"
//       // }
//       camStatus.textContent = "🟥 Camera is in use!"
//       new Notification("📸 Camera Alert", {
//         body: `Camera is currently active!`,
//       });
//     } else{
//       camStatus.textContent = "🟩 Camera is idle."
//     }
//   } catch(err){
//     console.error("Error fetching device status: ", err);
//   }
// };

// fetchAudioUsageData();

// // setInterval(fetchAudioUsageData, 3000);