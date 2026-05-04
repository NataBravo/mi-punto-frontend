import { QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import { useEffect } from "react";
import { RouterProvider } from "react-router";

import { Toaster } from "@/components/ui/sonner";
import { TOKEN_STORAGE_KEY, setUnauthorizedHandler } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";

import { router } from "./routes";

export default function App() {
  useEffect(() => {
    setUnauthorizedHandler(() => {
      // El atomWithStorage también borra esta key al setear null;
      // limpiar acá cubre el caso fuera de un componente.
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    });
  }, []);

  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </JotaiProvider>
  );
}
