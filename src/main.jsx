import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";

// Correct import path

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CssVarsProvider>
      <App />
    </CssVarsProvider>
  </StrictMode>
);
