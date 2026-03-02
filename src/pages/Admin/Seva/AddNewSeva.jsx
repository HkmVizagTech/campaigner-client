import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addNewSeva } from "@/store/seva/seva.service";
import { toast } from "react-toastify";

const AddNewSeva = () => {
  const [formData, setFormData] = useState({
    sevaName: "",
    sevaAmount: "",
    sevaPoints: [""],
  });
  const dispatch = useDispatch();
  const { addSevaLoading } = useSelector((state) => state.seva);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePointChange = (index, value) => {
    const updatedPoints = [...formData.sevaPoints];
    updatedPoints[index] = value;

    setFormData((prev) => ({
      ...prev,
      sevaPoints: updatedPoints,
    }));
  };

  const addPoint = () => {
    setFormData((prev) => ({
      ...prev,
      sevaPoints: [...prev.sevaPoints, ""],
    }));
  };

  const removePoint = (index) => {
    const updatedPoints = formData.sevaPoints.filter((_, i) => i !== index);

    setFormData((prev) => ({
      ...prev,
      sevaPoints: updatedPoints.length ? updatedPoints : [""],
    }));
  };

  const isFormValid =
    formData.sevaName.trim() !== "" &&
    formData.sevaAmount !== "" &&
    Number(formData.sevaAmount) > 0 &&
    formData.sevaPoints.every((point) => point.trim() !== "");

  const handleSubmit = async () => {
    if (!isFormValid) return;

    const result = await dispatch(addNewSeva(formData)).unwrap();
    setFormData({
      sevaName: "",
      sevaAmount: "",
      sevaPoints: [""],
    });
    if (result?.success) {
      toast.success("Seva Added");
    }
  };

  return (
    <section className="py-14 px-4">
      <div className="max-w-xl mx-auto">
        <Card className="p-8 space-y-8 shadow-md rounded-2xl">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Add New Seva
            </h2>
            <p className="text-sm text-muted-foreground">
              Create a new seva offering with benefits.
            </p>
          </div>

          {/* Seva Name */}
          <div className="space-y-2">
            <Label>Seva Name</Label>
            <Input
              placeholder="e.g. Dharma Sevak Seva (Life Patron)"
              value={formData.sevaName}
              onChange={(e) => handleChange("sevaName", e.target.value)}
            />
          </div>

          {/* Seva Amount */}
          <div className="space-y-2">
            <Label>Seva Amount (₹)</Label>
            <Input
              type="number"
              placeholder="108000"
              value={formData.sevaAmount}
              onChange={(e) => handleChange("sevaAmount", e.target.value)}
            />
          </div>

          {/* Seva Points */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Seva Benefits</Label>
                <p className="text-xs text-muted-foreground">
                  Add spiritual privileges included in this seva.
                </p>
              </div>

              <Button
                type="button"
                size="sm"
                onClick={addPoint}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>

            <div className="space-y-3">
              {formData.sevaPoints.map((point, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30"
                >
                  <Input
                    placeholder={`Benefit ${index + 1}`}
                    value={point}
                    onChange={(e) => handlePointChange(index, e.target.value)}
                    className="bg-background"
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={formData.sevaPoints.length === 1}
                    onClick={() => removePoint(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            className="w-full h-11 text-base font-medium"
            disabled={!isFormValid || addSevaLoading}
          >
            {addSevaLoading ? "Loading..." : "Save Seva"}
          </Button>
        </Card>
      </div>
    </section>
  );
};

export default AddNewSeva;
