import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";

import Index from "@/pages/Index";
import BillingList from "@/pages/BillingList";
import BillingForm from "@/pages/BillingForm";
import BillingView from "@/pages/BillingView";
import ExpenseReport from "@/pages/ExpenseReport";
import ProfitDashboard from "@/pages/ProfitDashboard";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import InvoiceForm from "@/pages/InvoiceForm";

import ProtectedRoute from "@/components/ProtectedRoute";
import SidebarLayout from "@/components/SidebarLayout";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" richColors closeButton />

        {/* ✅ BrowserRouter must wrap EVERYTHING */}
        <BrowserRouter>
          <Routes>

            {/* ------ PUBLIC ROUTES ------- */}
            <Route path="/login" element={<Login />} />

            {/* ------ PROTECTED ROUTES ------- */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <SidebarLayout>
                    <Index />
                  </SidebarLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/billing"
              element={
                <ProtectedRoute>
                  <SidebarLayout>
                    <BillingList />
                  </SidebarLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/billing/new"
              element={
                <ProtectedRoute>
                  <SidebarLayout>
                    <BillingForm />
                  </SidebarLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/billing/:id"
              element={
                <ProtectedRoute>
                  <SidebarLayout>
                    <BillingView />
                  </SidebarLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/expense-report"
              element={
                <ProtectedRoute>
                  <SidebarLayout>
                    <ExpenseReport />
                  </SidebarLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profit"
              element={
                <ProtectedRoute>
                  <SidebarLayout>
                    <ProfitDashboard />
                  </SidebarLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/invoice"
              element={
                <ProtectedRoute>
                  <SidebarLayout>
                    <InvoiceForm />
                  </SidebarLayout>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />

          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

