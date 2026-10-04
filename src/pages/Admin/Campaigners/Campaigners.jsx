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
  getTempleDevotesList,
} from "@/store/campaigners/campaigners.service";
import {
  getCampaignsList,
  getCurrentCampaign,
} from "@/store/campaign/campaign.service";
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
import ResendCampaignerLinks from "@/components/utils/ResendCampaignerLinks";
import { toast } from "@/utils/toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CampaignersTable() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    campaginers,
    campaginerTotalPages,
    campainerLoading,
    templeDevotesList,
  } = useSelector((state) => state.campaginer);
  const { details } = useSelector((state) => state.auth);
  const { currentCampaign, campaginListArr } = useSelector(
    (state) => state.campaign,
  );
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const [campaigner, setSelectedCampaigner] = useState(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState("all");
  const [selectedCampaignStatus, setSelectedCampaignStatus] =
    useState("active");
  const [selectedDevoteeId, setSelectedDevoteeId] = useState("all");
  const isAdmin = details?.role === "admin";
  const isDevotee = ["admin", "devotee"].includes(details?.role);
  const effectiveCampaignId =
    isAdmin && selectedCampaignId !== "all"
      ? selectedCampaignId
      : currentCampaign?._id;
  const effectiveCampaignStatus =
    isAdmin && selectedCampaignId !== "all"
      ? selectedCampaignStatus
      : currentCampaign?.status || "active";

  useEffect(() => {
    dispatch(getCurrentCampaign());
  }, [dispatch]);

  useEffect(() => {
    if (!isAdmin) return;

    dispatch(getCampaignsList({ page: 1, pageSize: 100 }));
    dispatch(getTempleDevotesList());
  }, [dispatch, isAdmin]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!effectiveCampaignId || !details?.role) return;

    dispatch(
      getCampainer({
        id: effectiveCampaignId,
        status: "active",
        campStatus: effectiveCampaignStatus,
        page,
        pageSize,
        sort,
        search: debouncedSearch,
        devoteeId: isAdmin ? selectedDevoteeId : undefined,
        isDevotee,
      }),
    );
  }, [
    effectiveCampaignId,
    effectiveCampaignStatus,
    selectedCampaignId,
    selectedDevoteeId,
    debouncedSearch,
    sort,
    page,
    details?.role,
    dispatch,
    isDevotee,
  ]);

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
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="w-full sm:max-w-sm"
        />
        <div className="flex w-full flex-col gap-3.5 self-start sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:self-auto">
          {isAdmin && (
            <Select
              value={selectedCampaignId}
              onValueChange={(value) => {
                setPage(1);
                setSelectedCampaignId(value);

                const selectedCampaign =
                  value === "all"
                    ? currentCampaign
                    : campaginListArr?.find(
                        (campaign) => campaign?._id === value,
                      );

                setSelectedCampaignStatus(selectedCampaign?.status || "active");
              }}
            >
              <SelectTrigger className="w-full sm:w-56">
                <SelectValue placeholder="Filter by Campaign" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Current Campaign</SelectItem>
                {campaginListArr?.map((campaign) => (
                  <SelectItem key={campaign?._id} value={campaign?._id}>
                    {campaign?.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {isAdmin && (
            <Select
              value={selectedDevoteeId}
              onValueChange={(value) => {
                setPage(1);
                setSelectedDevoteeId(value);
              }}
            >
              <SelectTrigger className="w-full sm:w-56">
                <SelectValue placeholder="Filter by Devotee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Devotees</SelectItem>
                {templeDevotesList?.map((devotee) => (
                  <SelectItem key={devotee?._id} value={devotee?._id}>
                    {devotee?.devoteName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="relative w-full justify-center gap-2 sm:w-auto sm:px-4"
              >
                <Funnel />
                <span className="sm:inline">Sort</span>

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

          {isAdmin && <ResendCampaignerLinks campaignId={effectiveCampaignId} />}
        </div>
      </div>
      <div className="grid gap-3 md:hidden">
        {campainerLoading ? (
          <div className="rounded-xl border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
            Loading...
          </div>
        ) : campaginers?.length === 0 ? (
          <div className="rounded-xl border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
            No Campaigners found
          </div>
        ) : (
          campaginers?.map((item) => (
            <div
              key={item._id}
              className="rounded-xl border bg-card p-4 shadow-sm"
              onClick={() => setSelectedCampaigner(item)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={item?.image?.url} />
                    <AvatarFallback>{item?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{item?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item?.phoneNumber}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(
                        `/admin/campaigner/edit/${item._id}?slug=${item?.slug}&campaignId=${item?.campaignId?._id}`,
                      );
                    }}
                  >
                    <Pencil size={16} />
                  </Button>
                  {item?.raisedAmount <= 0 && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Campaigner</AlertDialogTitle>

                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the campaigner and their data.
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
                                const result = await dispatch(
                                  deleteCampaigner(item?._id),
                                ).unwrap();

                                if (result?.success && effectiveCampaignId) {
                                  toast.success(
                                    "Campaigner Deleted Successfully",
                                  );

                                  dispatch(
                                    getCampainer({
                                      id: effectiveCampaignId,
                                      status: "active",
                                      campStatus: effectiveCampaignStatus,
                                      page,
                                      pageSize,
                                      sort,
                                      search: debouncedSearch,
                                      devoteeId: isAdmin
                                        ? selectedDevoteeId
                                        : undefined,
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
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-muted/40 px-3 py-2">
                  <p className="text-xs text-muted-foreground">Target</p>
                  <p className="font-medium">
                    ₹{item.targetAmount.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="rounded-lg bg-muted/40 px-3 py-2">
                  <p className="text-xs text-muted-foreground">Raised</p>
                  <p className="font-medium">
                    ₹{item.raisedAmount.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="rounded-lg bg-muted/40 px-3 py-2">
                  <p className="text-xs text-muted-foreground">Funders</p>
                  <p className="font-medium">{item?.funderCount}</p>
                </div>
                <div className="rounded-lg bg-muted/40 px-3 py-2">
                  <p className="text-xs text-muted-foreground">Progress</p>
                  <p className="font-medium">{item?.percentage}%</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Progress value={item?.percentage} />
                <Button
                  className="w-full"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/admin/funders?id=${item?._id}`);
                  }}
                >
                  View Funders
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="hidden min-w-0 overflow-x-auto rounded-2xl border shadow-sm md:block">
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
                            navigate(
                              `/admin/campaigner/edit/${item._id}?slug=${item?.slug}&campaignId=${item?.campaignId?._id}`,
                            );
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
                                      const campaignId = isAdmin
                                        ? effectiveCampaignId
                                        : currentCampaign?._id;
                                      const result = await dispatch(
                                        deleteCampaigner(item?._id),
                                      ).unwrap();

                                      if (result?.success && campaignId) {
                                        toast.success(
                                          "Campaigner Deleted Successfully",
                                        );

                                        dispatch(
                                          getCampainer({
                                            id: campaignId,
                                            status: "active",
                                            campStatus: effectiveCampaignStatus,
                                            page,
                                            pageSize,
                                            sort,
                                            search: debouncedSearch,
                                            devoteeId: isAdmin
                                              ? selectedDevoteeId
                                              : undefined,
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
