import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { addDevote } from "@/store/devotees/devote.service";
import { toast } from "react-toastify";

export default function DevoteForm() {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
  });
  const dispatch = useDispatch();

  const { addDevoteLoading: loading } = useSelector((state) => state.devote);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phoneNumber || !formData.email) {
      alert("Please fill all fields");
      return;
    }

    const result = await dispatch(addDevote(formData)).unwrap();

    if (result?.success) {
      toast.success("Devote Added Successfully");
    }

    setFormData({
      name: "",
      phoneNumber: "",
      email : ""
    });
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-muted/30">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Add Temple Devotee
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Devote Name */}
            <div className="space-y-2">
              <Label>Devotee Name</Label>
              <Input
                name="name"
                placeholder="Enter devotee name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Devotee Email</Label>
              <Input
                type="email"
                name="email"
                placeholder="Enter devotee name"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                name="phoneNumber"
                type="tel"
                placeholder="Enter phone number"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
