import ArchitecturalVisionGallery from "@/components/Campaigners/ArchitecturalVisionGallery";
import Banner from "@/components/Campaigners/Banner";
import CampaignSideBySide from "@/components/Campaigners/CampaignSideBySide";
import DidYouKnowBanner from "@/components/Campaigners/DidYouKnowBanner";
import DonorPrivileges from "@/components/Campaigners/DonorPrivileges";
import Footer from "@/components/Campaigners/Footer";
import MajesticAltarsBanner from "@/components/Campaigners/MajesticAltarsBanner";
import PowerOfGivingSection from "@/components/Campaigners/PowerOfGivingSection";
import ProjectOverviewSection from "@/components/Campaigners/ProjectOverviewSection";
import RecentContributors from "@/components/Campaigners/RecentContributors";
import TempleHighlights from "@/components/Campaigners/TempleHighlights";
import TempleSpacesSection from "@/components/Campaigners/TempleSpacesSection";
import TestimonialsSection from "@/components/Campaigners/TestimonialsSection";
import YoutubeIframe from "@/components/Campaigners/YoutubeIframe";
import { getCurrentCampaign } from "@/store/campaign/campaign.service";
import {
  getLastestDonors,
  getSingleCampaignerDetails,
  getTopDonors,
} from "@/store/campaigners/campaigners.service";
import { getSevaList } from "@/store/seva/seva.service";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const CampaignerDetails = () => {
  const dispatch = useDispatch();
  const { id: campaignerId } = useParams();
  const { currentCampaign } = useSelector((state) => state.campaign);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    dispatch(getCurrentCampaign());
  }, [dispatch]);

  useEffect(() => {
    if (!campaignerId) return;
    console.log("singleuseeffect", campaignerId);
    dispatch(getSingleCampaignerDetails(campaignerId));
  }, [campaignerId, dispatch]);
  useEffect(() => {
    if (!campaignerId || !currentCampaign?._id) return;
    console.log("lastest donor");
    dispatch(
      getLastestDonors({
        campId: currentCampaign._id,
        campaignerId,
      }),
    );

    dispatch(getTopDonors(currentCampaign?._id));
  }, [campaignerId, currentCampaign?._id, dispatch]);

  useEffect(() => {
    dispatch(getSevaList());
  }, [dispatch]);

  return (
    <>
      <Banner />
      <div className="container mx-auto px-2 pt-8 space-y-2">
        <CampaignSideBySide />
        <RecentContributors />
        <YoutubeIframe />
        <TempleHighlights />
        <ProjectOverviewSection />
        <DidYouKnowBanner />
        <TempleSpacesSection />
        <ArchitecturalVisionGallery />
        <TestimonialsSection />
        <MajesticAltarsBanner />
        <DonorPrivileges />
        <PowerOfGivingSection />
        <Footer />
      </div>
    </>
  );
};

export default CampaignerDetails;
