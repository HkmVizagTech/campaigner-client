import Footer from "@/components/Campaigners/Footer";
import Banner from "@/components/Home/Banner";
import Banner1 from "@/components/Home/Banner1";
import CardSection from "@/components/Home/CardSection";
import ProgressBanner from "@/components/Home/ProgressBanner";
import { getCurrentCampaign } from "@/store/campaign/campaign.service";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Home = () => {
  const { currentCampaign } = useSelector((state) => state.campaign);
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = `ISKCON Vizag | Crowdfunding for Sri Srinivasa Govinda Temple`;
  }, []);

  useEffect(() => {
    dispatch(getCurrentCampaign());
  }, [dispatch]);
  return (
    <>
      <div className="container mx-auto px-3">
        <Banner1 />
        <ProgressBanner />
        <Banner />
        <CardSection currentCampaign={currentCampaign} />
      </div>
      <div className="md:container md:mx-auto">
        <Footer />
      </div>
    </>
  );
};

export default Home;
