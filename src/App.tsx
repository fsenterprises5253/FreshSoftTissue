import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* Global toast + notifications */}
      <Toaster />
      <Sonner />

      {/* Router */}
      <BrowserRouter>
        <div className="min-h-screen bg-background text-gray-900">
          <Routes>
            {/* Home / Hero + Dashboard */}
            <Route path="/" element={<Index />} />

            {/* Future routes can be added here */}
            {/* <Route path="/dashboard" element={<DashboardPage />} /> */}

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
