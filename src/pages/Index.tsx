import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Wrench } from "lucide-react";
import Dashboard from "@/components/Dashboard";
import PartsTable from "@/components/PartsTable";
import AddPartDialog from "@/components/AddPartDialog";

interface SparePart {
  id: string;
  part_number: string;
  part_name: string;
  category: string;
  manufacturer: string | null;
  description: string | null;
  price: number;
  cost_price: number | null;
  stock_quantity: number;
  minimum_stock: number;
  unit: string;
  location: string | null;
}

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-gray-900">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[70vh] bg-white text-gray-900 px-4 border-b border-gray-200">
        <img
          src="/ezzy-logo.png"
          alt="Ezzy Auto Parts Logo"
          className="w-48 md:w-64 lg:w-72 mb-6"
        />
        <h1 className="text-4xl md:text-5xl font-bold text-center">
          Welcome to Ezzy Auto Parts
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mt-3 text-center max-w-xl">
          Reliable spare parts for every vehicle — quality you can trust.
        </p>
      </section>

      {/* Dashboard Section */}
      <main className="container mx-auto px-6 py-8 space-y-8">
        <Dashboard />
      </main>
    </div>
  );
};

export default Index;
