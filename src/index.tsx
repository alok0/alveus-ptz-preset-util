import React from "react";
import { App } from "./App";
import "./index.css";
import { createRoot } from "react-dom/client";

createRoot(document.body).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
