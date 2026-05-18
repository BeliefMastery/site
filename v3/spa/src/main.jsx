import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import "./styles/tokens.css";
import "./styles/global.css";

try {
  sessionStorage.removeItem("bm_v3app_bounce");
} catch {
  /* ignore */
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
