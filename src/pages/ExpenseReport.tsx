import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Pencil, Save, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ExpenseItem {
  id: string;
  item: string;
  qty: number;
  amount: number;
}

const ExpenseReport = () => {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [newItem, setNewItem] = useState("");
  const [newQty, setNewQty] = useState<number>(1);
  const [newAmount, setNewAmount] = useState<number | "">("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState("");
  const [editQty, setEditQty] = useState<number>(0);
  const [editAmount, setEditAmount] = useState<number>(0);

  // ✅ Fetch existing expenses
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const { data, error } = await (supabase as any)
      .from("expenses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch expenses");
      console.error(error);
    } else {
      setExpenses(data || []);
    }
  };

  // ✅ Add expense
  const addExpense = async () => {
  if (!newItem || !newAmount) {
    toast.error("Please fill all fields before adding.");
    return;
  }

  const { data, error } = await supabase
    .from("expenses")
    .insert([
      {
        item: newItem,
        qty: newQty,
        amount: Number(newAmount),
      },
    ])
    .select();

  if (error) {
    console.error("❌ Supabase Insert Error:", error);
    toast.error("Failed to add expense");
    return;
  }

  setExpenses((prev) => [data[0], ...prev]);
  setNewItem("");
  setNewQty(1);
  setNewAmount("");
  toast.success("✅ Expense added successfully!");
};

  // ✅ Delete expense
  const deleteExpense = async (id: string) => {
    const { error } = await (supabase as any).from("expenses").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete expense");
      console.error(error);
      return;
    }

    setExpenses((prev) => prev.filter((e) => e.id !== id));
    toast.success("Expense deleted.");
  };

  // ✅ Start editing
  const startEditing = (expense: ExpenseItem) => {
    setEditingId(expense.id);
    setEditItem(expense.item);
    setEditQty(expense.qty);
    setEditAmount(expense.amount);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditItem("");
    setEditQty(0);
    setEditAmount(0);
  };

  // ✅ Save edited expense
  const saveEdit = async () => {
    if (!editItem || !editAmount) {
      toast.error("All fields are required.");
      return;
    }

    const { error } = await (supabase as any)
      .from("expenses")
      .update({
        item: editItem,
        qty: editQty,
        amount: editAmount,
      })
      .eq("id", editingId);

    if (error) {
      toast.error("Failed to update expense");
      console.error(error);
      return;
    }

    toast.success("Expense updated successfully!");
    setEditingId(null);
    fetchExpenses();
  };

  const totalAmount = expenses.reduce(
    (sum, e) => sum + e.amount * e.qty,
    0
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          📊 Expense Report
        </h1>
      </div>

      {/* Add Expense */}
      <div className="flex flex-wrap gap-3 items-end border p-4 rounded-lg bg-white shadow-sm">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium mb-1">Item</label>
          <Input
            placeholder="Enter item name"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
        </div>

        <div className="w-32">
          <label className="block text-sm font-medium mb-1">Qty</label>
          <Input
            type="number"
            min={1}
            value={newQty}
            onChange={(e) => setNewQty(Number(e.target.value))}
          />
        </div>

        <div className="w-40">
          <label className="block text-sm font-medium mb-1">Amount</label>
          <Input
            type="number"
            min={0}
            value={newAmount}
            onChange={(e) =>
              setNewAmount(e.target.value ? Number(e.target.value) : "")
            }
          />
        </div>

        <Button
          onClick={addExpense}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
      </div>

      {/* Expense Table */}
      <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Item</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {expenses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-6 text-gray-500"
                >
                  No expenses added yet.
                </TableCell>
              </TableRow>
            ) : (
              expenses.map((expense) => (
                <TableRow key={expense.id}>
                  {editingId === expense.id ? (
                    <>
                      {/* Editable Row */}
                      <TableCell>
                        <Input
                          value={editItem}
                          onChange={(e) => setEditItem(e.target.value)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          min={1}
                          value={editQty}
                          onChange={(e) =>
                            setEditQty(Number(e.target.value))
                          }
                          className="text-right"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          min={0}
                          value={editAmount}
                          onChange={(e) =>
                            setEditAmount(Number(e.target.value))
                          }
                          className="text-right"
                        />
                      </TableCell>
                      <TableCell className="text-right flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={saveEdit}
                          className="text-green-600 hover:bg-green-100"
                        >
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={cancelEditing}
                          className="text-red-600 hover:bg-red-100"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{expense.item}</TableCell>
                      <TableCell className="text-right">{expense.qty}</TableCell>
                      <TableCell className="text-right">
                        ₹{expense.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startEditing(expense)}
                          className="hover:bg-blue-100 hover:text-blue-600"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteExpense(expense.id)}
                          className="hover:bg-red-100 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Total */}
      <div className="text-right text-lg font-semibold mt-4">
        Total: ₹{totalAmount.toFixed(2)}
      </div>
    </div>
  );
};

export default ExpenseReport;
