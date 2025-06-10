import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';

// Register chart components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const Dashboard = () => {
  const [micData, setMicData] = useState([]);
  const [cameraData, setCameraData] = useState([]);
  const [logs, setLogs] = useState([]);
  const [pieData, setPieData] = useState({});

  useEffect(() => {
    // Fetch active devices data from FastAPI
    axios.get('http://localhost:8000/active-devices')
      .then((response) => {
        setMicData(response.data.mic_apps);
        setCameraData(response.data.camera_apps);
      })
      .catch((error) => console.error('Error fetching active devices:', error));

    // Fetch logs from FastAPI
    axios.get('http://localhost:8000/logs')
      .then((response) => {
        setLogs(response.data.logs);
      })
      .catch((error) => console.error('Error fetching logs:', error));

    // Fetch running apps for the pie chart data
    axios.get('http://localhost:8000/running-apps')
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
              backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#33FFF3'],
            },
          ],
        });
      })
      .catch((error) => console.error('Error fetching running apps:', error));
  }, []);

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
          </ul>
        </div>

        <div>
          <h3>Camera Access:</h3>
          <ul>
            {cameraData.length === 0 ? <p>No camera apps detected.</p> : (
              <ul>
                {cameraData.map((app, index) => (
                  <li key={index}>{app}</li>
                ))}
              </ul>
            )}
          </ul>
        </div>
      </div>

      <div className="logs">
        <h2>Logs</h2>
        <ul>
          {logs.map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
      </div>

      <div className="pie-chart">
        <h2>App Access Pie Chart</h2>
        <Pie data={pieData} />
      </div>
    </div>
  );
};

export default Dashboard;
