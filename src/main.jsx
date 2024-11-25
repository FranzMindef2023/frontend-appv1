import React from "react";
import AppProvider from '@/context/AppProvider';
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
import { MaterialTailwindControllerProvider } from "@/context";
import "../css/tailwind.css";
import { NextUIProvider } from "@nextui-org/react";


ReactDOM.createRoot(document.getElementById("root")).render(
  <AppProvider>
    <NextUIProvider>
      <React.StrictMode>
        <BrowserRouter>
          <ThemeProvider>
            <MaterialTailwindControllerProvider>
              <App />
            </MaterialTailwindControllerProvider>
          </ThemeProvider>
        </BrowserRouter>
      </React.StrictMode>
    </NextUIProvider>
  </AppProvider>
);
