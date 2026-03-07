import Admin from "@/pages/Admin/Admin";
import Campaigners from "@/pages/Admin/Campaigners/Campaigners";
import CampaignerDetails from "@/pages/Campaigners/CampaignerDetails";
import CreateCampaign from "@/pages/Admin/Campaigns/CreateCampaign";
import Contact from "@/pages/Contact/Contact";
import Home from "@/pages/Home/Home";
import { Route, Routes } from "react-router-dom";
import CreateCampaigner from "@/pages/Admin/Campaigners/CreateCampaigner";
import ThankYouPage from "@/components/Campaigners/ThankYouPage";
import AddNewSeva from "@/pages/Admin/Seva/AddNewSeva";
import SevaList from "@/pages/Admin/Seva/SevaList";
import NotFound from "@/pages/NotFound";
import DonorsTable from "@/pages/Admin/Funders/DonorsTable";
import CampaignerRegister from "@/components/Campaigners/CampaignerRegister";
import Dashboard from "@/pages/Admin/Dashboard";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/campaigner/:id/:campaignername"
        element={<CampaignerDetails />}
      />
      <Route path="/contact" element={<Contact />} />
      <Route path="/campaigner/register" element=<CampaignerRegister /> />
      <Route path="/thankyou" element={<ThankYouPage />} />

      <Route element={<Admin />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/campaigners" element={<Campaigners />} />
        <Route path="/admin/create-campaign" element={<CreateCampaign />} />
        <Route path="/admin/create-campaigner" element={<CreateCampaigner />} />
        <Route path="/admin/campaigners" element={<Campaigners />} />
        <Route path="/admin/add-seva" element={<AddNewSeva />} />
        <Route path="/admin/seva-list" element={<SevaList />} />
        <Route path="/admin/seva/:id/:sevaname/edit" element={<AddNewSeva />} />
        <Route path="/admin/funders" element={<DonorsTable />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AllRoutes;
