import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";


const app = document.getElementById("app");
console.log(app);
createRoot(app).render(
  <React.StrictMode>
    
      <App />
    
  </React.StrictMode>,
);
