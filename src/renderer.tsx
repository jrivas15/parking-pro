import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/global.css";

const app = document.getElementById("app");
console.log(app)
createRoot(app).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
