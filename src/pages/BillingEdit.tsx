import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// -------------------------------------------------------
// TYPES
// -------------------------------------------------------

interface BillItem {
  id?: string;
  gsm_number: string;
  quantity: number;
  price: number;
  total: number;
}

interface BillData {
  id: string;
  bill_number: string;
  customer_name: string;
  total_amount: number;
  created_at: string;

  // New columns
  payment_mode: string | null;
  status: string | null;
}

// -------------------------------------------------------
// COMPONENT
// -------------------------------------------------------

const BillingEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [status, setStatus] = useState("Paid");
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [loading, setLoading] = useState(true);

  // -------------------------------------------------------
  // LOAD BILL DATA
  // -------------------------------------------------------

  const fetchBill = async () => {
    try {
      // Fetch main bill
      const { data: billData, error: billError } = await supabase
        .from("bills")
        .select("*")
        .eq("id", id)
        .single();

      if (billError || !billData) {
        toast.error("Failed to load bill");
        return;
      }

      setCustomerName(billData.customer_name);
      setPaymentMode(billData.payment_mode || "");
      setStatus(billData.status || "Paid");

      // Fetch bill items  
      const { data: items, error: itemsError } = await supabase
        .from("bill_items")
        .select("*")
        .eq("bill_id", id);

      if (itemsError) throw itemsError;

      setBillItems(
        items?.map((i) => ({
          id: i.id,
          gsm_number: i.gsm_number,
          quantity: i.quantity,
          price: i.price,
          total: i.total,
        })) || []
      );
    } catch (err) {
      console.error(err);
      toast.error("Error loading bill");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBill();
  }, [id]);

  // -------------------------------------------------------
  // UPDATE BILL
  // -------------------------------------------------------

  const updateBill = async () => {
    try {

        const updatedTotal = billItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
      // Update main bill
      const { error: updateError } = await supabase
        .from("bills")
        .update({
          customer_name: customerName,
          payment_mode: paymentMode,
          status,
          total_amount: updatedTotal,
        })
        .eq("id", id);

      if (updateError) throw updateError;

      // Delete old items
      await supabase.from("bill_items").delete().eq("bill_id", id);

      // Insert updated items
      const newItems = billItems.map((item) => ({
        bill_id: id,
        gsm_number: String(item.gsm_number),
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      }));

      const { error: insertError } = await supabase
        .from("bill_items")
        .insert(newItems);

      if (insertError) throw insertError;

      toast.success("Bill updated successfully!");
      navigate("/billing");

    } catch (err) {
      console.error(err);
      toast.error("Failed to update bill");
    }
  };

  // -------------------------------------------------------
  // UI SECTION
  // -------------------------------------------------------

  if (loading) return <p className="p-6">Loading bill...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">✏️ Edit Bill</h1>

      {/* CUSTOMER NAME */}
      <div>
        <label className="text-sm font-medium">Customer Name</label>
        <Input
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="mt-1"
        />
      </div>

      {/* PAYMENT MODE + STATUS */}
      <div className="flex gap-4 mt-4">
        <div>
          <label className="text-sm font-medium">Payment Mode</label>
          <select
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            className="border rounded-md p-2 w-44"
          >
            <option value="">Select</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Bank">Bank Transfer</option>
            <option value="Card">Card</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded-md p-2 w-44"
          >
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* EDITABLE ITEMS TABLE */}
      <div className="border rounded-lg p-4 bg-white shadow-sm mt-4">
        <h3 className="font-semibold mb-2">Bill Items</h3>

        {billItems.length === 0 ? (
          <p className="text-sm text-gray-500">No items.</p>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">GSM</th>
                <th className="p-2 text-right">Qty</th>
                <th className="p-2 text-right">Price</th>
                <th className="p-2 text-right">Total</th>
                <th className="p-2 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {billItems.map((item, index) => (
                <tr key={index} className="border-b">
                  
                  {/* GSM */}
                  <td className="p-2">
                    <input
                      type="text"
                      value={item.gsm_number}
                      onChange={(e) => {
                        const updated = [...billItems];
                        updated[index].gsm_number = e.target.value;
                        setBillItems(updated);
                      }}
                      className="border p-1 rounded w-20"
                      placeholder="GSM"
                    />
                  </td>

                  {/* QTY */}
                  <td className="p-2 text-right">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => {
                        const updated = [...billItems];
                        updated[index].quantity = Number(e.target.value);
                        updated[index].total =
                          updated[index].quantity * updated[index].price;
                        setBillItems(updated);
                      }}
                      className="border p-1 rounded w-16 text-right"
                    />
                  </td>

                  {/* PRICE */}
                  <td className="p-2 text-right">
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={item.price}
                      onChange={(e) => {
                        const updated = [...billItems];
                        updated[index].price = Number(e.target.value);
                        updated[index].total =
                          updated[index].quantity * updated[index].price;
                        setBillItems(updated);
                      }}
                      className="border p-1 rounded w-20 text-right"
                    />
                  </td>

                  {/* TOTAL */}
                  <td className="p-2 text-right font-semibold">
                    ₹{item.total.toFixed(2)}
                  </td>

                  {/* DELETE ROW */}
                  <td className="p-2 text-right">
                    <button
                      onClick={() => {
                        const updated = billItems.filter((_, i) => i !== index);
                        setBillItems(updated);
                      }}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* SAVE BUTTON */}
      <Button
        onClick={updateBill}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
      >
        💾 Save Changes
      </Button>

      <div className="mt-3">
  <Button
    variant="outline"
    onClick={() =>
      setBillItems([
        ...billItems,
        {
          gsm_number: "",
          quantity: 1,
          price: 0,
          total: 0,
        },
      ])
    }
  >
    ➕ Add Item
  </Button>
</div>
    </div>
  );
};

export default BillingEdit;
