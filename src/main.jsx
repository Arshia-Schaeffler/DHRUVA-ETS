import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";

// Import LoaderProvider and GlobalLoader
import { LoaderProvider } from "./context/LoaderContext";
import GlobalLoader from "./components/common/GlobalLoader";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LoaderProvider>
      <BrowserRouter>
        <App />
        <GlobalLoader /> {/* This displays the loading spinner */}
      </BrowserRouter>
    </LoaderProvider>
  </StrictMode>
);
