import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  createCampaign,
  getSingleCampaign,
  updateCampaign,
} from "@/store/campaign/campaign.service";
import { toast } from "@/utils/toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function CreateCampaign() {
  const { pathname } = useLocation();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    targetAmount: "",
    startDate: "",
    endDate: "",
  });
  const {
    createCampaignLoading: loading,
    singleCampaignLoading,
    singleCampaignDetails,
  } = useSelector((state) => state.campaign);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isEdit = pathname.includes("edit");

  useEffect(() => {
    if (!id || !isEdit) return;

    dispatch(getSingleCampaign(id));
  }, [id, isEdit, dispatch]);
  useEffect(() => {
    if (!Object.keys(singleCampaignDetails ?? {}).length || !isEdit || !id)
      return;
    setFormData({
      title: singleCampaignDetails?.title,
      targetAmount: singleCampaignDetails?.targetAmount,
      startDate: new Date(singleCampaignDetails?.startDate)
        .toISOString()
        .split("T")[0],
      endDate: new Date(singleCampaignDetails?.endDate)
        .toISOString()
        .split("T")[0],
    });
  }, [singleCampaignDetails, isEdit, id, dispatch]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const duration = useMemo(() => {
    if (!formData.startDate || !formData.endDate) return null;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diff = (end - start) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : null;
  }, [formData.startDate, formData.endDate]);

  const formattedAmount = useMemo(() => {
    if (!formData.targetAmount) return "";
    return Number(formData.targetAmount).toLocaleString("en-IN");
  }, [formData.targetAmount]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (id && isEdit) {
      const result = await dispatch(updateCampaign({ id, formData })).unwrap();
      if (result?.success) {
        toast.success("Campaign updated successfully");
        navigate("/admin/campaigns");
      }
    }

    if (!isEdit && !id) {
      const result = await dispatch(createCampaign(formData)).unwrap();

      if (result?.success) {
        toast.success("Campaign created successfully");
      }
      setFormData({
        title: "",
        targetAmount: "",
        startDate: "",
        endDate: "",
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">
          Create Campaign
        </h1>
        <p className="text-muted-foreground">
          Launch a new fundraising campaign with structured details.
        </p>
      </div>

      {/* Card */}
      <Card className="shadow-lg border border-border transition-all duration-300 hover:shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg">Campaign Information</CardTitle>
          <CardDescription>
            Ensure the campaign details are accurate before submission.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-4 pb-6 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div className="space-y-2">
              <Label>Campaign Title</Label>
              <Input
                name="title"
                placeholder="Temple Renovation Fund"
                value={formData.title}
                onChange={handleChange}
                className="focus-visible:ring-2 focus-visible:ring-primary transition-all"
                required
              />
            </div>

            {/* Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Target Amount */}
              <div className="space-y-2">
                <Label>Target Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">
                    ₹
                  </span>
                  <Input
                    name="targetAmount"
                    type="number"
                    placeholder="1500000"
                    className="pl-8 focus-visible:ring-2 focus-visible:ring-primary"
                    value={formData.targetAmount}
                    onChange={handleChange}
                    required
                  />
                </div>

                {formattedAmount && (
                  <p className="text-xs text-muted-foreground">
                    ₹ {formattedAmount}
                  </p>
                )}
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  name="startDate"
                  type="date"
                  disabled={isEdit}
                  value={formData.startDate}
                  onChange={handleChange}
                  className="focus-visible:ring-2 focus-visible:ring-primary"
                  required
                />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="focus-visible:ring-2 focus-visible:ring-primary"
                  required
                />
              </div>
            </div>

            {/* Duration Preview */}
            {duration && (
              <div className="flex flex-col gap-1 rounded-lg border bg-muted p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
                <span>Campaign Duration</span>
                <span className="font-medium">{duration} days</span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
              {isEdit ? (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => navigate("/admin/campaigns")}
                >
                  Back to Campaigns
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() =>
                    setFormData({
                      title: "",
                      targetAmount: "",
                      startDate: "",
                      endDate: "",
                    })
                  }
                >
                  Reset Form
                </Button>
              )}

              <Button
                type="submit"
                disabled={loading || singleCampaignLoading}
                className="w-full px-6 sm:w-auto"
              >
                {loading
                  ? isEdit
                    ? "Updating..."
                    : "Creating..."
                  : isEdit
                    ? "Update Campaign"
                    : "Create Campaign"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
