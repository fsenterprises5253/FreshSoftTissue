import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AddPartDialogProps {
  onPartAdded: () => void;
}

const AddPartDialog = ({ onPartAdded }: AddPartDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
  part_number: "",
  part_name: "",
  category: "",
  manufacturer: "",
  description: "",
  selling_price: "",
  cost_price: "",
  stock_quantity: "",
  min_stock: "",
  unit: "piece",
  location: "",
});

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const { error } = await supabase.from("spare_parts").insert([
      {
        part_number: formData.part_number,
        part_name: formData.part_name,
        category: formData.category,
        manufacturer: formData.manufacturer || null,
        description: formData.description || null,
        selling_price: parseFloat(formData.selling_price),
        cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
        stock_quantity: parseInt(formData.stock_quantity),
        min_stock: formData.min_stock ? parseInt(formData.min_stock) : 0,
        unit: formData.unit,
        location: formData.location || null,
      },
    ]);

    if (error) throw error;

    toast.success("Spare part added successfully!");
    setOpen(false);
    setFormData({
      part_number: "",
      part_name: "",
      category: "",
      manufacturer: "",
      description: "",
      selling_price: "",
      cost_price: "",
      stock_quantity: "",
      min_stock: "",
      unit: "piece",
      location: "",
    });
    onPartAdded();
  } catch (error: any) {
    toast.error(error.message || "Failed to add spare part");
  } finally {
    setLoading(false);
  }
};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
          <Plus className="mr-2 h-4 w-4" />
          Add New Part
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Spare Part</DialogTitle>
          <DialogDescription>
            Enter the details of the new automotive spare part.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="part_number">Part Number *</Label>
              <Input
                id="part_number"
                required
                value={formData.part_number}
                onChange={(e) => setFormData({ ...formData, part_number: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="part_name">Part Name *</Label>
              <Input
                id="part_name"
                required
                value={formData.part_name}
                onChange={(e) => setFormData({ ...formData, part_name: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Engine, Brake System"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Input
                id="manufacturer"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
  <div className="space-y-2">
    <Label htmlFor="selling_price">Selling Price *</Label>
    <Input
      id="selling_price"
      type="number"
      step="0.01"
      required
      value={formData.selling_price}
      onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
    />
  </div>
  <div className="space-y-2">
    <Label htmlFor="cost_price">Cost Price</Label>
    <Input
      id="cost_price"
      type="number"
      step="0.01"
      value={formData.cost_price}
      onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
    />
  </div>
</div>

<div className="grid grid-cols-3 gap-4">
  <div className="space-y-2">
    <Label htmlFor="stock_quantity">Stock Quantity *</Label>
    <Input
      id="stock_quantity"
      type="number"
      required
      value={formData.stock_quantity}
      onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
    />
  </div>
  <div className="space-y-2">
    <Label htmlFor="min_stock">Min. Stock</Label>
    <Input
      id="min_stock"
      type="number"
      value={formData.min_stock}
      onChange={(e) => setFormData({ ...formData, min_stock: e.target.value })}
    />
  </div>
  <div className="space-y-2">
    <Label htmlFor="unit">Unit</Label>
    <Input
      id="unit"
      value={formData.unit}
      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
    />
  </div>
</div>


          <div className="space-y-2">
            <Label htmlFor="location">Storage Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Warehouse A, Shelf 3"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Part"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPartDialog;