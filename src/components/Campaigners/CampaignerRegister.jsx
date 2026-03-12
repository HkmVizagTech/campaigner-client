import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentCampaign } from "@/store/campaign/campaign.service";
import { Landmark, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  createCampaigner,
  getTempleDevotesList,
} from "@/store/campaigners/campaigners.service";
import { toast } from "react-toastify";

const CampaignerRegister = () => {
  const dispatch = useDispatch();

  const { currentCampaign, campaignLoading } = useSelector(
    (state) => state.campaign,
  );
  const { templeDevotesList, templeDevotesLoading, createCampaignerLoading } =
    useSelector((state) => state.campaginer);

  const [form, setForm] = useState({
    name: "",
    targetAmount: "",
    phoneNumber: "",
    templeDevoteInTouch: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getCurrentCampaign());
    dispatch(getTempleDevotesList());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name required";
    if (!form.targetAmount) newErrors.targetAmount = "Target amount required";

    if (!form.phoneNumber) newErrors.phoneNumber = "Phone required";
    else if (!/^[0-9]{10}$/.test(form.phoneNumber))
      newErrors.phoneNumber = "Enter valid phone number";

    if (!form.templeDevoteInTouch)
      newErrors.templeDevoteInTouch = "Devote ID required";

    if (!form.image) newErrors.image = "Image required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const data = new FormData();
    try {
      data.append("name", form.name);
      data.append("targetAmount", form.targetAmount);
      data.append("phoneNumber", form.phoneNumber);
      data.append("templeDevoteInTouch", form.templeDevoteInTouch);
      data.append("campaignId", currentCampaign?._id);

      if (form.image) data.append("image", form.image);

      const result = await dispatch(
        createCampaigner({ formData: data, skipAuth: true }),
      ).unwrap();

      if (result?.success) {
        toast.success(
          "Hare Krishna 🙏 Your seva as a campaigner has been registered successfully. Please wait for the temple administration to review and approve your request.",
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setForm({
        name: "",
        targetAmount: "",
        phoneNumber: "",
        templeDevoteInTouch: "",
        image: null,
      });
      setPreview(null);
    }
  };

  if (campaignLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading campaign...</p>
      </div>
    );
  }

  if (
    !campaignLoading &&
    (!currentCampaign || Object.keys(currentCampaign).length === 0)
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center shadow-lg border">
          <CardContent className="p-10 space-y-4">
            <div className="flex justify-center">
              <Landmark className="h-12 w-12 text-primary" />
            </div>

            <h2 className="text-2xl font-semibold">No Active Campaign</h2>

            <p className="text-muted-foreground text-sm leading-relaxed">
              Currently there is no active temple campaign available for
              registration. Please check back later when a new campaign begins.
            </p>

            <p className="italic text-sm text-muted-foreground mt-4">
              “When devotees come together to serve Krishna, great spiritual
              transformations happen.”
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  /* -----------------------------
     NORMAL FORM UI
  ------------------------------ */

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-b from-background to-muted/30 px-4 py-12">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
        {/* LEFT SIDE */}
        <div className="space-y-6">
          <img
            src="https://storage.googleapis.com/campaigners-images/Temple%20Images/govindaFrontView.jpg"
            className="w-full h-72 sm:h-96 object-cover rounded-2xl shadow-xl"
          />

          <div className="bg-card border rounded-xl p-5 shadow-sm">
            <p className="italic text-muted-foreground leading-relaxed">
              “One who explains this supreme secret to My devotees performs the
              highest devotional service to Me, and he will come back to Me
              without doubt.”
            </p>

            <p className="text-sm font-semibold text-primary mt-3">
              — Lord Krishna, Bhagavad-Gita 18.68
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-semibold">
              Become a Temple Campaigner
            </h2>

            <p className="text-muted-foreground mt-2 max-w-lg">
              Help spread Krishna consciousness and support temple construction
              by becoming a campaigner. Inspire devotees, raise support, and
              participate in sacred seva.
            </p>
          </div>
        </div>

        {/* FORM */}
        <div className="bg-card border rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6">
            Campaigner Registration
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <Label>Full Name</Label>
              <Input
                name="name"
                placeholder="Enter campaigner name"
                value={form.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="text-destructive text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Target Amount</Label>
              <Input
                type="number"
                name="targetAmount"
                placeholder="Enter target amount"
                value={form.targetAmount}
                onChange={handleChange}
              />
              {errors.targetAmount && (
                <p className="text-destructive text-xs mt-1">
                  {errors.targetAmount}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Phone Number</Label>
              <Input
                name="phoneNumber"
                placeholder="Enter phone number"
                value={form.phoneNumber}
                onChange={handleChange}
              />
              {errors.phoneNumber && (
                <p className="text-destructive text-xs mt-1">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Select Devote In Touch</Label>
              <Select
                value={form?.templeDevoteInTouch}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    templeDevoteInTouch: value,
                  }))
                }
              >
                <SelectTrigger className="w-full h-10">
                  <SelectValue
                    placeholder={
                      templeDevotesLoading
                        ? "Loading devotes..."
                        : "Choose devote"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {templeDevotesList?.map((d) => (
                    <SelectItem key={d._id} value={d._id}>
                      {d.devoteName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.templeDevoteInTouch && (
                <p className="text-destructive text-xs mt-1">
                  {errors.templeDevoteInTouch}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Campaigner Image</Label>

              <label className="flex flex-col items-center justify-center border border-dashed rounded-xl p-6 cursor-pointer hover:bg-muted/40 transition">
                {preview ? (
                  <img
                    src={preview}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Click to upload campaigner photo
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
                <p className="text-destructive text-xs mt-1">{errors.image}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={createCampaignerLoading}
              className="w-full text-base font-semibold py-6"
            >
              {createCampaignerLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Registering...
                </span>
              ) : (
                "Register Campaigner"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CampaignerRegister;
