import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "./index.css";

console.log("Attempting to mount React app");
ReactDOM.createRoot(document.getElementById("root")).render(
  <HashRouter>
    {/* <Dashboard /> */}
    <App/>
  </HashRouter> // HashRouter supports electron, BrowserRouter does not. It keeps routes in the URL fragment (#) and works well with Electron because it doesn’t trigger a real file request.
);
