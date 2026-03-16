import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCampaigner,
  getCampainer,
} from "@/store/campaigners/campaigners.service";
import { getCurrentCampaign } from "@/store/campaign/campaign.service";
import CustomPagination from "@/components/utils/CustomPagination";
import { Funnel, Pencil, Trash2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import CampaignerDetailsModal from "@/components/utils/CampaignerDetailsModal";
import { toast } from "@/utils/toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CampaignersTable() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { campaginers, campaginerTotalPages, campainerLoading } = useSelector(
    (state) => state.campaginer,
  );
  const { details } = useSelector((state) => state.auth);
  const { currentCampaign } = useSelector((state) => state.campaign);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const [campaigner, setSelectedCampaigner] = useState(null);

  useEffect(() => {
    dispatch(getCurrentCampaign());
  }, [dispatch]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!currentCampaign?._id || !details?.role) return;
    const isDevotee = ["admin", "devotee"].includes(details?.role);
    dispatch(
      getCampainer({
        id: currentCampaign?._id,
        status: "active",
        campStatus: "active",
        page,
        pageSize,
        sort,
        search: debouncedSearch,
        isDevotee,
      }),
    );
  }, [currentCampaign?._id, debouncedSearch, sort, page, details, dispatch]);

  const CAMPAIGN_SORT_OPTIONS = [
    {
      label: "Highest Raised",
      value: "raised_desc",
    },
    {
      label: "Lowest Raised",
      value: "raised_asc",
    },
    {
      label: "Highest Target",
      value: "target_desc",
    },
    {
      label: "Lowest Target",
      value: "target_asc",
    },
    {
      label: "Newest First",
      value: "createdAt_desc",
    },
    {
      label: "Oldest First",
      value: "createdAt_asc",
    },
  ];

  const handleCategoryChange = (id, checked) => {
    setPage(1);
    if (checked) {
      setSort(id);
    } else {
      setSort(null);
    }
  };
  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <Input
          placeholder="Search campaigner..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-sm"
        />
        <div className="flex items-center gap-3.5 self-start sm:self-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button size="icon-sm" className="relative">
                <Funnel />

                {sort && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
                )}
              </Button>
            </PopoverTrigger>{" "}
            <PopoverContent>
              <PopoverHeader>
                <PopoverTitle>Sort by</PopoverTitle>
                <FieldGroup className="gap-4 px-1 py-2">
                  {CAMPAIGN_SORT_OPTIONS?.map((item) => (
                    <Field
                      key={item?.value}
                      orientation="horizontal"
                      className="gap-2"
                    >
                      <Checkbox
                        id={item?.value}
                        checked={sort === item?.value}
                        onCheckedChange={(checked) => {
                          handleCategoryChange(item?.value, checked);
                        }}
                      />
                      <Label htmlFor={item?.value} className="capitalize">
                        {item.label}
                      </Label>
                    </Field>
                  ))}
                </FieldGroup>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="min-w-0 rounded-2xl border shadow-sm">
        <Table className="min-w-270">
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[20%]">Name</TableHead>
              <TableHead className="w-[15%]">Phone</TableHead>
              <TableHead className="w-[15%]">Target</TableHead>
              <TableHead className="w-[15%]">Raised</TableHead>
              <TableHead className="w-[20%]">Progress</TableHead>
              <TableHead className="w-[10%] text-center">
                Total Funders
              </TableHead>
              <TableHead className="w-[10%] text-center">
                View Funders
              </TableHead>
              <TableHead className="w-[10%] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {campainerLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  Loading...
                </TableCell>
              </TableRow>
            ) : campaginers?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No Campaigners found
                </TableCell>
              </TableRow>
            ) : (
              campaginers?.map((item) => {
                return (
                  <TableRow
                    key={item._id}
                    className="cursor-pointer hover:bg-muted/50 transition"
                    onClick={() => setSelectedCampaigner(item)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={item?.image?.url} />
                          <AvatarFallback>
                            {item?.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {item?.name}
                      </div>
                    </TableCell>

                    <TableCell>{item.phoneNumber}</TableCell>

                    <TableCell>
                      ₹{item.targetAmount.toLocaleString("en-IN")}
                    </TableCell>

                    <TableCell>
                      ₹{item.raisedAmount.toLocaleString("en-IN")}
                    </TableCell>

                    <TableCell className="w-40">
                      <div className="space-y-2">
                        <Progress value={item?.percentage} />
                        <span className="text-xs text-muted-foreground">
                          {item?.percentage}%
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="w-32 text-center">
                      {item?.funderCount}
                    </TableCell>

                    <TableCell>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/funders?id=${item?._id}`);
                        }}
                      >
                        View Funders
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        {/* EDIT */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/campaigner/edit/${item._id}`);
                          }}
                        >
                          <Pencil size={16} />
                        </Button>

                        {/* DELETE MODAL */}
                        {item?.raisedAmount <= 0 && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive cursor-pointer"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Campaigner
                                </AlertDialogTitle>

                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete the campaigner and their
                                  data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <AlertDialogFooter>
                                <AlertDialogCancel
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Cancel
                                </AlertDialogCancel>

                                <AlertDialogAction
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    try {
                                      const isDevotee = [
                                        "admin",
                                        "devotee",
                                      ].includes(details?.role);
                                      const result = await dispatch(
                                        deleteCampaigner(item?._id),
                                      ).unwrap();

                                      if (result?.success) {
                                        toast.success(
                                          "Campaigner Deleted Successfully",
                                        );

                                        dispatch(
                                          getCampainer({
                                            id: currentCampaign?._id,
                                            status: "active",
                                            campStatus: "active",
                                            page,
                                            pageSize,
                                            sort,
                                            search,
                                            isDevotee,
                                          }),
                                        );
                                      }
                                    } catch (error) {
                                      toast.error(
                                        error || "Failed to delete campaigner",
                                      );
                                    }
                                  }}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      {campaginerTotalPages > 1 && (
        <div className="w-full">
          <CustomPagination
            totalPages={campaginerTotalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        </div>
      )}
      {campaigner && (
        <CampaignerDetailsModal
          campaigner={campaigner}
          onClose={() => setSelectedCampaigner(null)}
        />
      )}
    </div>
  );
}
