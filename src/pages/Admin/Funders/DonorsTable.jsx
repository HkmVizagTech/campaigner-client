import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import DonorDetailsModal from "@/components/utils/DonorDetailsModal";
import { useDispatch, useSelector } from "react-redux";
import { getDonations } from "@/store/Donations/donations.service";
import CustomPagination from "@/components/utils/CustomPagination";
import { useSearchParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSevaList } from "@/store/seva/seva.service";
import { getCampaignsList } from "@/store/campaign/campaign.service";

export default function DonorsTable() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [selectedSeva, setSelectedSeva] = useState("all");
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const [isPrasadam, setIsPrasadam] = useState("all");
  const {
    getDonationsArr,
    getDonationsLoading: loading,
    totalPages,
    totalDonations,
  } = useSelector((state) => state?.donation);
  const { campaginListArr } = useSelector((state) => state.campaign);
  const { sevaList, sevaLoading } = useSelector((state) => state.seva);
  const { details } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    dispatch(
      getDonations({
        page,
        pageSize: limit,
        search: debouncedSearch,
        id,
        campId: selectedCampaign,
        sevaId: selectedSeva,
        isPrasadam: isPrasadam === "true" ? true : undefined,
      }),
    );
  }, [
    debouncedSearch,
    page,
    dispatch,
    id,
    selectedCampaign,
    selectedSeva,
    isPrasadam,
  ]);

  useEffect(() => {
    dispatch(getSevaList());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCampaignsList({ page: 1 }));
  }, [dispatch]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <h2 className="text-xl font-semibold">Funders ({totalDonations})</h2>

        <div className="flex gap-4 items-center">
          {/* Search */}
          <Input
            placeholder="Search donor, phone..."
            className="w-60"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />

          {/* Seva Dropdown */}
          <Select
            value={selectedSeva}
            onValueChange={(value) => {
              setPage(1);
              setSelectedSeva(value);
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by Seva" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Seva's</SelectItem>
              {sevaList?.map((seva) => (
                <SelectItem value={seva?._id} key={seva?._id}>
                  {seva?.sevaName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Campaign Dropdown */}
          {details?.role === "admin" && (
            <Select
              value={selectedCampaign}
              onValueChange={(value) => {
                setPage(1);
                setSelectedCampaign(value);
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Campaign" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campaigns</SelectItem>
                {campaginListArr?.map((item) => (
                  <SelectItem value={item?._id} key={item?._id}>
                    {item?.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select
            value={isPrasadam}
            onValueChange={(value) => {
              setPage(1);
              setIsPrasadam(value);
            }}
          >
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Prasadam Eligibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">Eligible for Prasadam</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Donor</TableHead>
              <TableHead>Campaign</TableHead>
              <TableHead>Campaigner</TableHead>
              <TableHead className="text-center w-40">Amount</TableHead>
              <TableHead className="w-40 text-center">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  Loading...
                </TableCell>
              </TableRow>
            ) : getDonationsArr?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No donors found
                </TableCell>
              </TableRow>
            ) : (
              getDonationsArr?.map((donor) => (
                <TableRow
                  key={donor._id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedDonor(donor)}
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {donor.isAnonymous ? "Anonymous" : donor.donorName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {donor.donorPhone}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>{donor.campaign?.title}</TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={donor.campaigner?.image?.url} />
                        <AvatarFallback>
                          {donor.campaigner?.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {donor.campaigner?.name}
                    </div>
                  </TableCell>

                  <TableCell className="text-center font-semibold text-primary">
                    ₹{donor.amount.toLocaleString()}
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge variant="default">{donor.status}</Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div>
          <CustomPagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Modal */}
      {selectedDonor && (
        <DonorDetailsModal
          donor={selectedDonor}
          onClose={() => setSelectedDonor(null)}
        />
      )}
    </div>
  );
}
