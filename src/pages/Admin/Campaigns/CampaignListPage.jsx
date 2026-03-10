import { useEffect, useState } from "react";
import { Pen, Search, SlidersHorizontal, Trash2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useDispatch, useSelector } from "react-redux";
import { getCampaignsList } from "@/store/campaign/campaign.service";
import CustomPagination from "@/components/utils/CustomPagination";
import { Progress } from "@/components/ui/progress";

const PAGE_SIZE = 10;

const CampaignListPage = () => {
  const dispatch = useDispatch();

  const {
    campaginListArr: campaigns,
    total,
    totalPages,
  } = useSelector((state) => state.campaign);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    dispatch(
      getCampaignsList({
        page,
        pageSize: PAGE_SIZE,
        search: debouncedSearch,
        sort,
      }),
    );
  }, [page, debouncedSearch, sort, dispatch]);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Campaigns ({total})</h1>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* SEARCH */}
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

          <Input
            placeholder="Search campaign..."
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* FILTER */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-60 space-y-4">
            {/* STATUS */}
            {/* <div>
              <p className="text-sm font-medium mb-2">Status</p>

              <Select
                value={status}
                onValueChange={(value) => {
                  setStatus(value);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="new">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div> */}

            {/* SORT */}
            <div>
              <p className="text-sm font-medium mb-2">Sort</p>

              <Select
                value={sort}
                onValueChange={(value) => {
                  setSort(value);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="target_desc">
                    Target (High → Low)
                  </SelectItem>
                  <SelectItem value="target_asc">
                    Target (Low → High)
                  </SelectItem>
                  <SelectItem value="raised_desc">
                    Raised (High → Low)
                  </SelectItem>
                  <SelectItem value="raised_asc">
                    Raised (Low → High)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* TABLE */}
      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Raised</TableHead>
              <TableHead className="w-[15%]">Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {campaigns?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground"
                >
                  No campaigns found
                </TableCell>
              </TableRow>
            )}

            {campaigns?.map((campaign) => (
              <TableRow key={campaign._id}>
                <TableCell className="font-medium">{campaign?.title}</TableCell>

                <TableCell>
                  ₹{campaign?.targetAmount?.toLocaleString("en-IN")}
                </TableCell>

                <TableCell>
                  ₹{campaign?.raisedAmount?.toLocaleString("en-IN")}
                </TableCell>

                <TableCell className="w-40">
                  <div className="space-y-2">
                    <Progress value={campaign?.percentage} />
                    <span className="text-xs text-muted-foreground">
                      {campaign?.percentage}%
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <StatusBadge status={campaign?.status} />
                </TableCell>

                <TableCell>
                  {new Date(campaign?.startDate).toLocaleDateString()}
                </TableCell>

                <TableCell>
                  {new Date(campaign?.endDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2.5">
                    <Button variant="outline">
                      <Pen />
                    </Button>
                    {campaign?.raisedAmount <= 0 && (
                      <Button variant="destructive">
                        <Trash2 />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <CustomPagination
          totalPages={totalPages}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default CampaignListPage;

function StatusBadge({ status }) {
  const styles = {
    active: "bg-green-100 text-green-700",
    upcoming: "bg-blue-100 text-blue-700",
    completed: "bg-gray-200 text-gray-700",
  };

  return (
    <span
      className={`px-2 py-1 text-xs rounded-md capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}
