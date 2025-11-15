import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";

import Index from "@/pages/Index";
import BillingList from "@/pages/BillingList";
import BillingForm from "@/pages/BillingForm";
import BillingView from "@/pages/BillingView";
import BillingEdit from "@/pages/BillingEdit";   // ✅ NEW
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

        {/* Browser Router Wrapper */}
        <BrowserRouter>
          <Routes>

            {/* ---------- PUBLIC ROUTES ---------- */}
            <Route path="/login" element={<Login />} />

            {/* ---------- PROTECTED ROUTES ---------- */}

            {/* Dashboard Home */}
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

            {/* Billing List */}
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

            {/* Add New Bill */}
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

            {/* View Bill */}
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

            {/* ✅ EDIT BILL */}
            <Route
              path="/billing/edit/:id"
              element={
                <ProtectedRoute>
                  <SidebarLayout>
                    <BillingEdit />
                  </SidebarLayout>
                </ProtectedRoute>
              }
            />

            {/* Expense Report */}
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

            {/* Profit Dashboard */}
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

            {/* Invoice Form */}
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

            {/* Not Found */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
