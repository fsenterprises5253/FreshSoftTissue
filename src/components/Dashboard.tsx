import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import PartsTable from "./PartsTable";
import AddPartDialog from "./AddPartDialog";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom"; // ✅ Added navigation

interface SparePart {
  id: string;
  gsm_number: string;
  category: string;
  manufacturer: string | null;
  price: number;
  cost_price: number | null;
  stock_quantity: number;
  minimum_stock: number;
  unit: string;
  location: string | null;
}

const Dashboard = () => {
  const [parts, setParts] = useState<SparePart[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate(); // ✅ Navigation hook

  // Fetch all parts
  const fetchParts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("spare_parts").select("*");

    if (error) {
      console.error("Error fetching Stock Data:", error);
    } else {
      setParts(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchParts();
  }, []);
  

  // --------------------------
  // 📌 Updated Calculations
  // --------------------------

  const totalParts = parts.length;

  const inventoryValue = parts.reduce(
    (sum, p) => sum + (p.cost_price || 0) * p.stock_quantity,
    0
  );

  // ✅ Correct Profit Formula
  const totalProfit = parts.reduce((sum, p) => {
    const cost = p.cost_price || 0;
    const sell = p.price || 0;
    const profitPerItem = sell - cost;
    return sum + profitPerItem * p.stock_quantity;
  }, 0);

  const lowStockParts = parts.filter((p) => p.stock_quantity < p.minimum_stock);
  const lowStockCount = lowStockParts.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Stock Inventory</h1>
        <AddPartDialog onPartAdded={fetchParts} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {/* Total Stock */}
        <Card>
          <CardHeader>
            <CardTitle>Total Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalParts}</p>
            <p className="text-muted-foreground">Current stock count</p>
          </CardContent>
        </Card>

        {/* Inventory Value */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₹{inventoryValue.toFixed(2)}</p>
            <p className="text-muted-foreground">Total stock value</p>
          </CardContent>
        </Card>

        {/* 🔥 Profit (Clickable) */}
        <div
          className="cursor-pointer hover:shadow-lg transition rounded-lg"
          onClick={() => navigate("/profit")} // ✅ Navigate to profit page
        >
          <Card className="border border-transparent hover:border-green-500 transition">
            <CardHeader>
              <CardTitle>Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                ₹{totalProfit.toFixed(2)}
              </p>
              <p className="text-muted-foreground">Total profit</p>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alert */}
        <Dialog>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:shadow-md transition">
              <CardHeader className="flex items-center space-x-2">
                <AlertTriangle className="text-yellow-500 w-5 h-5" />
                <CardTitle>Low Stock Alert</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{lowStockCount}</p>
                <p className="text-muted-foreground">Items need reorder</p>
              </CardContent>
            </Card>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Low Stock Items</DialogTitle>
            </DialogHeader>

            {loading ? (
              <p className="text-center py-6 text-gray-600">Loading...</p>
            ) : lowStockParts.length === 0 ? (
              <p className="text-center py-6 text-gray-500">
                All items are sufficiently stocked.
              </p>
            ) : (
              <table className="w-full text-left border-t border-gray-200">
                <thead>
                  <tr className="text-gray-700 font-medium">
                    <th className="py-2 px-3">GSM Number</th>
                    <th className="py-2 px-3">Category</th>
                    <th className="py-2 px-3 text-center">Stock</th>
                    <th className="py-2 px-3 text-center">Min Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockParts.map((part) => (
                    <tr
                      key={part.id}
                      className={`border-t border-gray-100 hover:bg-gray-50 ${
                        part.stock_quantity <= part.minimum_stock / 2
                          ? "bg-red-50"
                          : ""
                      }`}
                    >
                      <td className="py-2 px-3 font-medium">
                        {part.gsm_number}
                      </td>
                      <td className="py-2 px-3">{part.category}</td>
                      <td className="py-2 px-3 text-center">
                        {part.stock_quantity}
                      </td>
                      <td className="py-2 px-3 text-center">
                        {part.minimum_stock}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Parts Table */}
      {!loading && (
        <div>
          <h2 className="text-xl font-semibold mt-8 mb-4">All Stock Data</h2>
          <PartsTable parts={parts} onUpdate={fetchParts} />
        </div>
      )}

      {loading && (
        <p className="text-center text-muted-foreground mt-4">
          Loading data...
        </p>
      )}
    </div>
  );
};

export default Dashboard;
