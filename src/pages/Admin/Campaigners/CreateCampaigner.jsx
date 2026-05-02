import { useEffect, useState } from "react";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import {
  createCampaigner,
  getMediaList,
  getSingleCampaignerDetails,
  getTempleDevotesList,
  updateCampaigner,
} from "@/store/campaigners/campaigners.service";
import { getCurrentCampaign } from "@/store/campaign/campaign.service";
import { toast } from "@/utils/toast";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

export default function CreateCampaigner() {
  const dispatch = useDispatch();
  const {
    templeDevotesList,
    templeDevotesLoading,
    mediaList,
    createCampaignerLoading,
    singleCampaignerDetails,
  } = useSelector((state) => state.campaginer);
  const { currentCampaign, campainLoading } = useSelector(
    (state) => state.campaign,
  );
  const { details } = useSelector((state) => state.auth);
  const { campaignerId } = useParams();
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const slug = searchParams.get("slug");
  const campaignId = searchParams.get("campaignId");
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    templeDevoteInTouch: "",
    imageId: "",
    targetAmount: 0,
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedImage, setSelectedImg] = useState(null);
  const [isImageChanged, setIsImageChanged] = useState(false); // Track if image was changed
  const isEdit = pathname.includes("edit");
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCurrentCampaign());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getTempleDevotesList());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getMediaList());
  }, [dispatch]);

  useEffect(() => {
    const effectiveSlugId = slug || campaignerId;
    const effectiveCampaignId = campaignId || currentCampaign?._id;

    if (!isEdit || !campaignerId || !effectiveSlugId || !effectiveCampaignId) {
      return;
    }

    dispatch(
      getSingleCampaignerDetails({
        slugId: effectiveSlugId,
        campaignId: effectiveCampaignId,
      }),
    );
  }, [campaignerId, slug, campaignId, currentCampaign?._id, isEdit, dispatch]);

  useEffect(() => {
    if (
      !Object.keys(singleCampaignerDetails?.campaginers ?? {}).length ||
      !campaignerId
    )
      return;
    setFormData({
      name: singleCampaignerDetails?.campaginers?.name,
      phoneNumber: singleCampaignerDetails?.campaginers?.phoneNumber,
      templeDevoteInTouch:
        singleCampaignerDetails?.campaginers?.templeDevoteInTouch?._id,
      targetAmount: singleCampaignerDetails?.campaginers?.targetAmount,
    });
    setPreview(singleCampaignerDetails?.campaginers?.image?.url);
    setImage(singleCampaignerDetails?.campaginers?.image?.filename);
  }, [singleCampaignerDetails, campaignerId]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setIsImageChanged(true); // Mark that image was changed
      setSelectedImg(null); // Clear selected recent image if any
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
    setIsImageChanged(true);
    // If you want to allow removing the image completely, you can add a flag
    // to indicate that the image should be deleted
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      // Add all text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value && key !== "imageId") {
          // Skip imageId as it's handled separately
          data.append(key, value);
        }
      });

      if (campaignId || currentCampaign?._id) {
        data.append("campaignId", campaignId || currentCampaign?._id);
      }

      if (details?.role === "devotee") {
        const single = templeDevotesList?.find(
          (item) => item?.userId?.toString() === details?._id,
        );
        if (!single) {
          toast.error("Devotee profile not found");
          return;
        }
        data.append("templeDevoteInTouch", single?._id);
      }

      // ✅ KEY FIX: Handle image for edit mode
      if (isEdit) {
        // Check if there's a new file selected (File object)
        if (image instanceof File) {
          data.append("image", image);
          console.log("Adding new image file for edit:", image.name);
        }
        // If image was removed (set to null and no preview)
        else if (image === null && !preview) {
          data.append("removeImage", "true");
          console.log("Removing image");
        }
        // If image hasn't changed, don't append anything
      } else {
        // Create mode
        if (image instanceof File) {
          data.append("image", image);
        }
      }

      // ✅ IMPORTANT: Log what's being sent
      console.log("=== Edit Mode FormData ===");
      for (let pair of data.entries()) {
        if (pair[1] instanceof File) {
          console.log(`${pair[0]}: [FILE] ${pair[1].name}`);
        } else {
          console.log(`${pair[0]}: ${pair[1]}`);
        }
      }

      if (!isEdit) {
        const result = await dispatch(
          createCampaigner({ formData: data, skipAuth: false }),
        ).unwrap();
        if (result?.success) {
          toast.success("Campaigner Created Successfully!");
          // Reset form...
        }
      } else {
        // ✅ For edit, make sure we're sending FormData, not JSON
        const result = await dispatch(
          updateCampaigner({ id: campaignerId, formData: data }),
        ).unwrap();
        if (result?.success) {
          toast.success("Campaigner Updated Successfully!");
          navigate("/admin/campaigners");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">
          {isEdit ? "Edit Campaigner" : "Create Campaigner"}
        </h1>
        <p className="text-muted-foreground">
          Assign campaign, devote and upload campaigner image.
        </p>
      </div>

      <Card className="shadow-lg border hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle>Campaigner Information</CardTitle>
          <CardDescription>
            Fill in the required details carefully.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-4 pb-6 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  name="name"
                  placeholder="Enter campaigner name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  name="phoneNumber"
                  placeholder="Enter phone number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Current Campaign</Label>
                <Input
                  name="campaignId"
                  placeholder="Current Campaign"
                  value={currentCampaign?.title || ""}
                  required
                  disabled
                  className="cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <Label>Target Amount</Label>
                <Input
                  name="targetAmount"
                  type="number"
                  placeholder="Enter targetAmount"
                  value={formData?.targetAmount || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {details?.role === "admin" ? (
                <div className="space-y-2">
                  <Label>Select Devote In Touch</Label>
                  <Select
                    value={formData.templeDevoteInTouch}
                    required
                    onValueChange={(value) =>
                      setFormData((prev) => ({
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
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Touch With Devote</Label>
                  <Input
                    name="templeDevoteInTouch"
                    placeholder="Enter temple Devote in touch"
                    value={details?.name || ""}
                    disabled
                  />
                </div>
              )}

              {/* Recent Images - Only show in create mode */}
              {!isEdit && (
                <div className="space-y-2">
                  <Label>Recent Images</Label>
                  <Select
                    value={formData.imageId}
                    disabled={!!image || isEdit}
                    onValueChange={(value) => {
                      const finalValue = value === "none" ? "" : value;

                      setFormData((prev) => ({
                        ...prev,
                        imageId: finalValue,
                      }));

                      setSelectedImg(finalValue);
                    }}
                  >
                    <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder="Select recent image" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {mediaList.map((img) => (
                        <SelectItem key={img._id} value={img._id}>
                          {img.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Upload Image</Label>

              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />

                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center transition-all duration-200 hover:bg-muted">
                  {preview ? (
                    <div className="relative inline-block">
                      <img
                        src={preview}
                        alt="Preview"
                        className="mx-auto h-28 object-cover rounded-md"
                      />
                      {isEdit && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">
                      Click to upload or drag image
                    </span>
                  )}
                </div>
              </div>
              {isEdit && preview && (
                <p className="text-xs text-muted-foreground mt-1">
                  Click on the image to change it, or click the × button to
                  remove it
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              {isEdit ? (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => navigate("/admin/campaigners")}
                >
                  Back to Campaigners
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setFormData({
                      name: "",
                      phoneNumber: "",
                      templeDevoteInTouch: "",
                      imageId: "",
                      targetAmount: 0,
                    });
                    setImage(null);
                    setSelectedImg(null);
                    setPreview(null);
                    setIsImageChanged(false);
                  }}
                >
                  Reset Form
                </Button>
              )}

              <Button
                type="submit"
                disabled={createCampaignerLoading || campainLoading}
                className="w-full sm:w-auto"
              >
                {createCampaignerLoading
                  ? isEdit
                    ? "Updating..."
                    : "Creating..."
                  : isEdit
                    ? "Update Campaigner"
                    : "Create Campaigner"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
