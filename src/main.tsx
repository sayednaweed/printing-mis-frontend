import { createRoot } from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "./context/theme-provider.tsx";
import { Suspense } from "react";
import React from "react";
import { GlobalStateProvider } from "./context/GlobalStateContext.tsx";
import NastranSpinner from "./components/custom-ui/spinner/NastranSpinner.tsx";
import AppLoader from "./AppLoader.tsx";
const LazyApp = React.lazy(() => import("@/App.tsx"));

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    <Suspense
      fallback={
        <div className="h-screen bg-secondary flex justify-center items-center">
          <NastranSpinner />
        </div>
      }
    >
      <GlobalStateProvider>
        <AppLoader />

        <LazyApp />
      </GlobalStateProvider>
    </Suspense>
  </ThemeProvider>
);
