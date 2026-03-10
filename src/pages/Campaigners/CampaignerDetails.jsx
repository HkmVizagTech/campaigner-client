import ArchitecturalVisionGallery from "@/components/Campaigners/ArchitecturalVisionGallery";
import Banner from "@/components/Campaigners/Banner";
import CampaignSideBySide from "@/components/Campaigners/CampaignSideBySide";
import DidYouKnowBanner from "@/components/Campaigners/DidYouKnowBanner";
import DonorPrivileges from "@/components/Campaigners/DonorPrivileges";
import Footer from "@/components/Campaigners/Footer";
import InitialLoader from "@/components/Campaigners/InitialLoader";
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
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const CampaignerDetails = () => {
  const dispatch = useDispatch();
  const { id: campaignerId } = useParams();
  const { currentCampaign } = useSelector((state) => state.campaign);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [minTimeDone, setMinTimeDone] = useState(false);
  useEffect(() => {
    const images = document.images;
    let loadedCount = 0;

    const checkDone = () => {
      loadedCount++;

      if (loadedCount === images.length) {
        setImagesLoaded(true);
      }
    };

    for (let img of images) {
      if (img.complete) {
        checkDone();
      } else {
        img.addEventListener("load", checkDone);
        img.addEventListener("error", checkDone);
      }
    }

    return () => {
      for (let img of images) {
        img.removeEventListener("load", checkDone);
        img.removeEventListener("error", checkDone);
      }
    };
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeDone(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleLoad = () => {
      const images = Array.from(document.images);
      const unloaded = images.filter((img) => !img.complete);

      if (unloaded.length === 0) {
        setImagesLoaded(true);
        return;
      }

      let loadedCount = 0;

      unloaded.forEach((img) => {
        const onLoad = () => {
          loadedCount++;
          if (loadedCount === unloaded.length) {
            setImagesLoaded(true);
          }
        };

        img.addEventListener("load", onLoad);
        img.addEventListener("error", onLoad);
      });
    };

    setTimeout(handleLoad, 100);
  }, []);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    dispatch(getCurrentCampaign());
  }, [dispatch]);

  useEffect(() => {
    if (!campaignerId) return;
    dispatch(getSingleCampaignerDetails(campaignerId));
  }, [campaignerId, dispatch]);
  useEffect(() => {
    if (!campaignerId || !currentCampaign?._id) return;
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
  if (!imagesLoaded || !minTimeDone) {
    return <InitialLoader />;
  }
  return (
    <>
      <Banner />
      <div className="container mx-auto px-2 pt-8 space-y-1">
        <CampaignSideBySide />
        <RecentContributors />
        <TempleHighlights />
        <ProjectOverviewSection />
        <DidYouKnowBanner />
        <TempleSpacesSection />
        <ArchitecturalVisionGallery />
        <YoutubeIframe />
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
