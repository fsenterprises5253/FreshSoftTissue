// src/pages/ProfitDashboard.tsx
import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

interface SparePart {
  id: string;
  gsm_number: string;
  category: string | null;
  price: number;
  cost_price: number | null;
  stock_quantity: number;
}

const ProfitDashboard: React.FC = () => {
  const [parts, setParts] = useState<SparePart[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [filterCategory, setFilterCategory] = useState("");
  const [filterGsm, setFilterGsm] = useState("");

  useEffect(() => {
    loadParts();
  }, []);

  const loadParts = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("spare_parts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setParts(data || []);
    } catch (err) {
      toast.error("Failed to load inventory data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------
  // FILTERING
  // --------------------------
  const filteredParts = useMemo(() => {
    return parts.filter((p) => {
      if (filterCategory && p.category !== filterCategory) return false;
      if (filterGsm && p.gsm_number !== filterGsm) return false;
      return true;
    });
  }, [parts, filterCategory, filterGsm]);

  // --------------------------
  // LEDGER - INVENTORY BASED
  // --------------------------
  const ledger = useMemo(() => {
    return filteredParts.map((p) => {
      const cost = p.cost_price || 0;
      const sell = p.price || 0;
      const profitPerPiece = sell - cost;
      const totalProfit = profitPerPiece * p.stock_quantity;

      return {
        id: p.id,
        gsm: p.gsm_number,
        category: p.category,
        price: sell,
        cost,
        profitPerPiece,
        stock: p.stock_quantity,
        totalProfit,
      };
    });
  }, [filteredParts]);

  // --------------------------
  // SUMMARY CALCULATIONS
  // --------------------------
  const totalProfit = ledger.reduce((sum, r) => sum + r.totalProfit, 0);
  const totalExpense = ledger.reduce((sum, r) => sum + r.cost * r.stock, 0);

  const netProfit = ledger.reduce((sum, r) => sum + r.price * r.stock, 0);

  const sumProfitPerPiece = ledger.reduce((sum, r) => sum + r.profitPerPiece, 0);

  // --------------------------
  // MONTHLY CHART (STATIC BASED ON INVENTORY)
  // --------------------------
  const chartData = [
    {
      label: "Inventory",
      profit: totalProfit,
      expense: totalExpense,
      net: netProfit,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📈 Profit Dashboard</h1>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

        <Card>
          <CardHeader>
            <CardTitle>Total Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              ₹{totalExpense.toFixed(2)}
            </p>
            <p className="text-muted-foreground">Total Items purchased Value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-700">
              ₹{totalProfit.toFixed(2)}
            </p>
            <p className="text-muted-foreground">Profit Excluding Selling Price</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-600">
              ₹{netProfit.toFixed(2)}
            </p>
            <p className="text-muted-foreground">Selling price * Quantity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profit Per Piece</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-400">
              ₹{sumProfitPerPiece.toFixed(2)}
            </p>
            <p className="text-muted-foreground">Sum of all items</p>
          </CardContent>
        </Card>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="text-sm">Category</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">All</option>
            {[...new Set(parts.map((p) => p.category))].map(
              (c) =>
                c && (
                  <option key={c} value={c}>
                    {c}
                  </option>
                )
            )}
          </select>
        </div>

        <div>
          <label className="text-sm">GSM</label>
          <select
            value={filterGsm}
            onChange={(e) => setFilterGsm(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">All</option>
            {parts.map((p) => (
              <option key={p.id} value={p.gsm_number}>
                {p.gsm_number}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Profit / Expense</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="profit" fill="#1d4ed8" name="Profit" />
                <Bar dataKey="expense" fill="#dc2626" name="Cost" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Net Profit Trend</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="net"
                  stroke="#0ea5e9"
                  name="Net Profit"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* PROFIT LEDGER */}
      <Card>
        <CardHeader>
          <CardTitle>Profit Ledger</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-2">GSM</th>
                <th className="p-2">Category</th>
                <th className="p-2">Cost</th>
                <th className="p-2">Sell Price</th>
                <th className="p-2">Profit / Piece</th>
                <th className="p-2">Stock</th>
                <th className="p-2">Total Profit</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map((r) => (
                <tr key={r.id} className="border-b">
                  <td className="p-2">{r.gsm}</td>
                  <td className="p-2">{r.category}</td>
                  <td className="p-2">₹{r.cost.toFixed(2)}</td>
                  <td className="p-2">₹{r.price.toFixed(2)}</td>
                  <td className="p-2 text-blue-600">
                    ₹{r.profitPerPiece.toFixed(2)}
                  </td>
                  <td className="p-2">{r.stock}</td>
                  <td className="p-2 font-semibold">
                    ₹{r.totalProfit.toFixed(2)}
                  </td>
                </tr>
              ))}

              {ledger.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="p-4 text-center text-muted-foreground"
                  >
                    No matching records.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfitDashboard;
