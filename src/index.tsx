import { render } from "preact";
import React from "react";
import { App } from "./App";
import "./index.css";

const el = document.createElement("div");
document.body.replaceChildren(el);

render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  el,
);
