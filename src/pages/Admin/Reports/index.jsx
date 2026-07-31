import { useSelector } from "react-redux";
import DevoteeReport from "./DevoteeReport";
import PrasadamReport from "./PrasadamReport";
import FundersWithOrderId from "./FundersWithOrderId";
import { useState } from "react";

const tabs = [
  { id: "devotee", label: "Devotee Summary", roles: ["admin", "superAdmin"] },
  { id: "prasadam", label: "Prasadam Donors", roles: ["admin", "superAdmin"] },
  { id: "funders", label: "Funders with Order ID", roles: ["admin", "superAdmin"] },
];

const Reports = () => {
  const { details } = useSelector((state) => state.auth);
  const role = details?.role;

  const visibleTabs = tabs.filter((t) => t.roles.includes(role));
  const [activeTab, setActiveTab] = useState(visibleTabs[0]?.id || "devotee");

  return (
    <div className="p-4 space-y-5 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">Reports</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Donation reports and analytics
        </p>
      </div>

      {/* Tab buttons */}
      {visibleTabs.length > 1 && (
        <div className="flex gap-1 border-b">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Tab content */}
      {activeTab === "devotee" && <DevoteeReport />}
      {activeTab === "prasadam" && <PrasadamReport />}
      {activeTab === "funders" && <FundersWithOrderId />}
    </div>
  );
};

export default Reports;
