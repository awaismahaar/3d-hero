import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import RootLayout from "./RootLayout.tsx";
import "./styles/transitions.css";
import NewApp from "./components/NewApp.tsx";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <NewApp /> */}
    {/* <BrowserRouter>
      <RootLayout />
    </BrowserRouter> */}
    <App />
  </StrictMode>,
);
