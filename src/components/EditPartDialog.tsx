import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SparePart {
  id: string;
  part_number: string;
  part_name: string;
  category: string;
  manufacturer: string | null;
  description: string | null;
  selling_price: number; // ✅ renamed from price
  cost_price: number | null;
  stock_quantity: number;
  min_stock: number; // ✅ renamed from minimum_stock
  unit: string;
  location: string | null;
}

interface EditPartDialogProps {
  part: SparePart;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPartUpdated: () => void;
}

const EditPartDialog = ({ part, open, onOpenChange, onPartUpdated }: EditPartDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    part_number: part.part_number,
    part_name: part.part_name,
    category: part.category,
    manufacturer: part.manufacturer || "",
    description: part.description || "",
    selling_price: part.selling_price.toString(), // ✅ updated
    cost_price: part.cost_price?.toString() || "",
    stock_quantity: part.stock_quantity.toString(),
    min_stock: part.min_stock.toString(), // ✅ updated
    unit: part.unit,
    location: part.location || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("spare_parts")
        .update({
          part_number: formData.part_number,
          part_name: formData.part_name,
          category: formData.category,
          manufacturer: formData.manufacturer || null,
          description: formData.description || null,
          selling_price: parseFloat(formData.selling_price), // ✅ renamed
          cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
          stock_quantity: parseInt(formData.stock_quantity),
          min_stock: parseInt(formData.min_stock), // ✅ renamed
          unit: formData.unit,
          location: formData.location || null,
        })
        .eq("id", part.id);

      if (error) throw error;

      toast.success("Spare part updated successfully!");
      onOpenChange(false);
      onPartUpdated();
    } catch (error: any) {
      toast.error(error.message || "Failed to update spare part");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Spare Part</DialogTitle>
          <DialogDescription>
            Update the details of the spare part.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit_part_number">Part Number *</Label>
              <Input
                id="edit_part_number"
                required
                value={formData.part_number}
                onChange={(e) => setFormData({ ...formData, part_number: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_part_name">Part Name *</Label>
              <Input
                id="edit_part_name"
                required
                value={formData.part_name}
                onChange={(e) => setFormData({ ...formData, part_name: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit_category">Category *</Label>
              <Input
                id="edit_category"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_manufacturer">Manufacturer</Label>
              <Input
                id="edit_manufacturer"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_description">Description</Label>
            <Textarea
              id="edit_description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit_selling_price">Selling Price *</Label>
              <Input
                id="edit_selling_price"
                type="number"
                step="0.01"
                required
                value={formData.selling_price}
                onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_cost_price">Cost Price</Label>
              <Input
                id="edit_cost_price"
                type="number"
                step="0.01"
                value={formData.cost_price}
                onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit_stock_quantity">Stock Quantity *</Label>
              <Input
                id="edit_stock_quantity"
                type="number"
                required
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_min_stock">Min. Stock</Label>
              <Input
                id="edit_min_stock"
                type="number"
                value={formData.min_stock}
                onChange={(e) => setFormData({ ...formData, min_stock: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_unit">Unit</Label>
              <Input
                id="edit_unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_location">Storage Location</Label>
            <Input
              id="edit_location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Part"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPartDialog;
