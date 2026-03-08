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
import { toast } from "react-toastify";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function CreateCampaigner() {
  const dispatch = useDispatch();
  const {
    templeDevotesList,
    templeDevotesLoading,
    mediaList,
    createCampaignerLoading,
    singleCampaignerDetails,
  } = useSelector((state) => state.campaginer);
  const { currentCampaign } = useSelector((state) => state.campaign);
  const { campaignerId } = useParams();
  const { pathname } = useLocation();
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
    if (!currentCampaign || !isEdit) return;
    dispatch(getSingleCampaignerDetails(campaignerId));
  }, [campaignerId, isEdit, dispatch]);

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
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          data.append(key, value);
        }
      });

      if (currentCampaign?._id) {
        data.append("campaignId", currentCampaign._id);
      }

      if (image) {
        data.append("image", image);
      }

      if (!isEdit) {
        const result = await dispatch(createCampaigner(data)).unwrap();

        if (result?.success) {
          toast.success("Campaigner Created Successfully!");
        }

        setFormData({
          name: "",
          phoneNumber: "",
          templeDevoteInTouch: "",
          imageId: "",
          targetAmount: 0,
        });
        setImage(null);
        setPreview(null);
        setSelectedImg(null);
      } else if (campaignerId && isEdit) {
        const result = await dispatch(
          updateCampaigner({ id: campaignerId, formData }),
        ).unwrap();
        if (result?.success) {
          toast.success("Campaigner Updated Successfully!");
          navigate("/admin/campaigners");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-8 w-full max-w-6xl mx-auto space-y-8">
      {/* Header */}
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

        <CardContent>
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
              <div className="space-y-2">
                <Label>Select Devote In Touch</Label>
                <Select
                  value={formData.templeDevoteInTouch}
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

              {/* Recent Images */}
              <div className="space-y-2">
                <Label>Recent Images</Label>
                <Select
                  value={formData.imageId}
                  disabled={!!image || isEdit}
                  onValueChange={(value) => {
                    setFormData({ ...formData, imageId: value });
                    setSelectedImg(value);
                  }}
                >
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder="Select recent image" />
                  </SelectTrigger>
                  <SelectContent>
                    {mediaList.map((img) => (
                      <SelectItem key={img._id} value={img._id}>
                        {img.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Upload Image</Label>

              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={`absolute inset-0 opacity-0 ${
                    selectedImage || isEdit
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  } z-10`}
                  disabled={selectedImage || isEdit}
                />

                <div
                  className={`border-2 border-dashed border-border rounded-lg p-6 text-center transition-all duration-200 ${
                    selectedImage || isEdit ? "opacity-60" : "hover:bg-muted"
                  }`}
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="mx-auto h-28 object-cover rounded-md"
                    />
                  ) : (
                    <span className="text-muted-foreground">
                      Click to upload or drag image
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <Button type="submit" disabled={createCampaignerLoading}>
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
