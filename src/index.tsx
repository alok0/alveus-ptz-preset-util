import React from "react";
import { App } from "./App";
import "./index.css";
import { createRoot } from "react-dom/client";
import { useHashLocation } from "wouter/use-hash-location";
import { Router } from "wouter";

createRoot(document.body).render(
  <React.StrictMode>
    <Router hook={useHashLocation}>
      <App />
    </Router>
  </React.StrictMode>,
);
