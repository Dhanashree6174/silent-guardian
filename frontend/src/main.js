// electron main process

const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: { nodeIntegration: true, contextIsolation: true },
  });

  // win.loadFile("index.html");
  win.loadFile(path.join(__dirname, '../public/index.html'));
  // win.loadFile(path.join(__dirname, '../frontend/src/index.html'));
}

app.whenReady().then(createWindow);

// npm install chart.js react-chartjs-2 axios
// chart.js: For creating the pie chart.
// react-chartjs-2: React wrapper for Chart.js.
// axios: For making API calls to the FastAPI backend.

// why ../public/index.html althought its in src folder in project directory?
// During development (vite dev):
// Vite serves /src/index.html as the entry file in dev mode.
// During production build (vite build):
// Vite takes src/index.html, compiles all JS (like renderer.jsx) into /public/assets/..., and places a final index.html in /public.