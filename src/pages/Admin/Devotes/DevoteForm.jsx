import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import {
  addDevote,
  getSingleDevotee,
  updateDevotee,
} from "@/store/devotees/devote.service";
import { toast } from "@/utils/toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function DevoteForm() {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    shortForm: "",
  });
  const { pathname } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEdit = pathname.includes("edit");

  const {
    addDevoteLoading: loading,
    singleDevoteeLoading,
    singleDevoteeDetails,
  } = useSelector((state) => state.devote);

  useEffect(() => {
    if (!id || !isEdit) return;
    dispatch(getSingleDevotee(id));
  }, [id, isEdit, dispatch]);

  useEffect(() => {
    if (!Object.keys(singleDevoteeDetails ?? {}).length || !isEdit || !id)
      return;

    setFormData({
      name: singleDevoteeDetails?.devoteName ?? "",
      phoneNumber: singleDevoteeDetails?.phoneNumber ?? "",
      email: singleDevoteeDetails?.email ?? "",
      shortForm: singleDevoteeDetails?.shortForm ?? "",
    });
  }, [singleDevoteeDetails, id, isEdit, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.phoneNumber.trim() ||
      !formData.email.trim() ||
      !formData.shortForm.trim()
    ) {
      alert("Please fill all fields");
      return;
    }

    if (isEdit && id) {
      const result = await dispatch(updateDevotee({ id, formData })).unwrap();
      if (result?.success) {
        toast.success("Devote Added Successfully");
        navigate("/admin/devotees");
      }
    }

    if (!isEdit && !id) {
      const result = await dispatch(addDevote(formData)).unwrap();

      if (result?.success) {
        toast.success("Devote Added Successfully");
      }

      setFormData({
        name: "",
        phoneNumber: "",
        email: "",
        shortForm: "",
      });
    }
  };

  return (
    <section className="flex w-full justify-center">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            {isEdit ? "Edit Temple Devotee" : "Add Temple Devotee"}
          </CardTitle>
        </CardHeader>

        <CardContent className="px-4 pb-6 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
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
                  placeholder="Enter devotee email"
                  value={formData.email}
                  disabled={isEdit}
                  onChange={handleChange}
                  required
                />
              </div>
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
              <div className="space-y-2">
                <Label>Devotee Short Form</Label>
                <Input
                  name="shortForm"
                  placeholder="Enter Devote Short Form"
                  value={formData.shortForm}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              {isEdit && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => navigate("/admin/devotees")}
                >
                  Back to Devotees
                </Button>
              )}
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={loading || singleDevoteeLoading}
              >
                {loading
                  ? isEdit
                    ? "Updating..."
                    : "Saving..."
                  : isEdit
                    ? "Update"
                    : "Submit"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
