import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewSeva,
  getSingleSevaDetails,
  updateSeva,
} from "@/store/seva/seva.service";
import { toast } from "@/utils/toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const AddNewSeva = () => {
  const [formData, setFormData] = useState({
    sevaCategory: "",
    sevaSubCategory: "",
    sevaCode: "",
    sevaSubCode: "",
    sevaCategoryId: "",
    sevaSubCategoryId: "",
    sevaAmount: "",
    sevaPoints: [""],
  });
  const dispatch = useDispatch();
  const { addSevaLoading, getSingleSeva } = useSelector((state) => state.seva);
  const { pathname } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = pathname.includes("edit");

  const getTrimmedValue = (value) => String(value ?? "").trim();

  useEffect(() => {
    if (!id || !isEdit) return;

    dispatch(getSingleSevaDetails(id));
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (!Object.keys(getSingleSeva).length || !id) return;

    setFormData({
      sevaCategory: getSingleSeva?.sevaCategory ?? "",
      sevaSubCategory: getSingleSeva?.sevaSubCategory ?? "",
      sevaCode: getSingleSeva?.sevaCode ?? getSingleSeva?.SevaCode ?? "",
      sevaSubCode:
        getSingleSeva?.sevaSubCode ?? getSingleSeva?.SevaSubCode ?? "",
      sevaCategoryId: String(getSingleSeva?.sevaCategoryId ?? ""),
      sevaSubCategoryId: String(getSingleSeva?.sevaSubCategoryId ?? ""),
      sevaAmount: getSingleSeva?.sevaAmount ?? "",
      sevaPoints:
        Array.isArray(getSingleSeva?.sevaPoints) &&
        getSingleSeva.sevaPoints.length
          ? getSingleSeva.sevaPoints
          : [""],
    });
  }, [getSingleSeva, id]);

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
    getTrimmedValue(formData.sevaCategory) !== "" &&
    getTrimmedValue(formData.sevaSubCategory) !== "" &&
    getTrimmedValue(formData.sevaCode) !== "" &&
    getTrimmedValue(formData.sevaCategoryId) !== "" &&
    getTrimmedValue(formData.sevaSubCategoryId) !== "" &&
    formData.sevaAmount !== "" &&
    Number(formData.sevaAmount) > 0 &&
    formData.sevaPoints.every((point) => getTrimmedValue(point) !== "");

  const handleSubmit = async () => {
    if (!isFormValid) return;

    try {
      let result;

      if (isEdit) {
        result = await dispatch(updateSeva({ id, formData })).unwrap();
        toast.success("Seva Updated Successfully");
        navigate("/admin/seva-list");
      } else {
        result = await dispatch(addNewSeva(formData)).unwrap();
        toast.success("Seva Added Successfully");

        setFormData({
          sevaCategory: "",
          sevaSubCategory: "",
          sevaCode: "",
          sevaSubCode: "",
          sevaCategoryId: "",
          sevaSubCategoryId: "",
          sevaAmount: "",
          sevaPoints: [""],
        });
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-3xl">
        <Card className="space-y-8 rounded-2xl p-4 shadow-md sm:p-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              {isEdit ? "Edit Seva" : "Add New Seva"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isEdit
                ? "Edit an existing seva offering and update its details or benefits."
                : "Create a new seva offering with benefits."}
            </p>
          </div>

          {/* Seva Category */}
          <div className="space-y-2">
            <Label>Seva Category</Label>
            <Input
              placeholder="e.g. Dharma Sevak Seva (Life Patron)"
              value={formData.sevaCategory}
              onChange={(e) => handleChange("sevaCategory", e.target.value)}
            />
          </div>

          {/* Seva Category ID */}
          <div className="space-y-2">
            <Label>Seva Category ID</Label>
            <Input
              placeholder="e.g. 1"
              type="number"
              value={formData.sevaCategoryId}
              onChange={(e) => handleChange("sevaCategoryId", e.target.value)}
            />
          </div>

          {/* Seva Code */}
          <div className="space-y-2">
            <Label>Seva Code</Label>
            <Input
              placeholder="e.g. DSS"
              value={formData.sevaCode}
              onChange={(e) => handleChange("sevaCode", e.target.value)}
            />
          </div>

          {/* Seva Sub Category */}
          <div className="space-y-2">
            <Label>Seva Sub Category</Label>
            <Input
              placeholder="e.g. Dharma Sevak Seva (Life Patron)"
              value={formData.sevaSubCategory}
              onChange={(e) => handleChange("sevaSubCategory", e.target.value)}
            />
          </div>

          {/* Seva Sub Category ID */}
          <div className="space-y-2">
            <Label>Seva Sub Category ID</Label>
            <Input
              placeholder="e.g. 1"
              type="number"
              value={formData.sevaSubCategoryId}
              onChange={(e) =>
                handleChange("sevaSubCategoryId", e.target.value)
              }
            />
          </div>

          {/* Seva Sub Code */}
          <div className="space-y-2">
            <Label>Seva Sub Code</Label>
            <Input
              placeholder="e.g. DSS"
              value={formData.sevaSubCode}
              onChange={(e) => handleChange("sevaSubCode", e.target.value)}
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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
                  className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-3 sm:flex-row sm:items-center"
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
                    className="self-end text-destructive hover:text-destructive sm:self-auto"
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
            {addSevaLoading
              ? "Loading..."
              : isEdit
                ? "Update Seva"
                : "Save Seva"}
          </Button>
        </Card>
      </div>
    </section>
  );
};

export default AddNewSeva;
