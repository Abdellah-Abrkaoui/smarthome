import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "./supabase/supabaseClient.js";
import { AuthProvider } from "./contexts/AuthContext.jsx";

// NEW IMPORT

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CssVarsProvider>
      <SessionContextProvider supabaseClient={supabase}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </SessionContextProvider>
    </CssVarsProvider>
  </StrictMode>
);
