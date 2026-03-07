import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const CampaignerRegister = () => {
  const [form, setForm] = useState({
    name: "",
    targetAmount: "",
    phoneNumber: "",
    templeDevoteInTouch: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";

    if (!form.targetAmount)
      newErrors.targetAmount = "Target amount is required";

    if (!form.phoneNumber) newErrors.phoneNumber = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(form.phoneNumber))
      newErrors.phoneNumber = "Enter valid 10 digit number";

    if (!form.templeDevoteInTouch)
      newErrors.templeDevoteInTouch = "Devote ID required";

    if (!form.image) newErrors.image = "Image is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const data = new FormData();
    data.append("name", form.name);
    data.append("targetAmount", form.targetAmount);
    data.append("phoneNumber", form.phoneNumber);
    data.append("templeDevoteInTouch", form.templeDevoteInTouch);

    if (form.image) data.append("image", form.image);

    await fetch("http://localhost:2345/api/campaigner", {
      method: "POST",
      body: data,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-linear-to-b from-background to-muted/40">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-10 items-start">
        {/* LEFT IMAGE */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <img
            src="https://storage.googleapis.com/campaigners-images/Temple%20Images/frontview.jpg"
            className="w-full max-w-lg h-65 sm:h-80 lg:h-105
            object-cover rounded-xl shadow-lg"
          />

          <h2 className="text-2xl font-semibold mt-6">Empower Devotees</h2>

          <p className="text-muted-foreground text-sm mt-2 max-w-md">
            Register campaigners who help raise donations for temple activities
            and community service.
          </p>
        </div>

        {/* FORM */}
        <div className="border rounded-xl shadow-md bg-card p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-semibold mb-6">
            Campaigner Registration
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NAME */}
            <div>
              <Label>Name</Label>
              <Input
                name="name"
                placeholder="Enter campaigner name"
                value={form.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* TARGET */}
            <div>
              <Label>Target Amount</Label>
              <Input
                name="targetAmount"
                type="number"
                placeholder="Enter target amount"
                value={form.targetAmount}
                onChange={handleChange}
              />
              {errors.targetAmount && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.targetAmount}
                </p>
              )}
            </div>

            {/* PHONE */}
            <div>
              <Label>Phone Number</Label>
              <Input
                name="phoneNumber"
                placeholder="Enter phone number"
                value={form.phoneNumber}
                onChange={handleChange}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            {/* DEVOTE */}
            <div>
              <Label>Temple Devote In Touch</Label>
              <Input
                name="templeDevoteInTouch"
                placeholder="Enter devote ID"
                value={form.templeDevoteInTouch}
                onChange={handleChange}
              />
              {errors.templeDevoteInTouch && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.templeDevoteInTouch}
                </p>
              )}
            </div>

            {/* IMAGE */}
            <div>
              <Label>Campaigner Image</Label>

              <label className="flex flex-col items-center justify-center border border-dashed rounded-lg p-6 cursor-pointer hover:bg-muted transition">
                {preview ? (
                  <img
                    src={preview}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Click to upload image
                  </span>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="hidden"
                />
              </label>

              {errors.image && (
                <p className="text-red-500 text-xs mt-1">{errors.image}</p>
              )}
            </div>

            <Button type="submit" className="w-full text-lg font-medium">
              Register Campaigner
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CampaignerRegister;
