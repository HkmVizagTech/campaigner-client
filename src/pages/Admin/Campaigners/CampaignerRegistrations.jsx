import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import CustomPagination from "@/components/utils/CustomPagination";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getCurrentCampaign } from "@/store/campaign/campaign.service";
import {
  deleteCampaigner,
  getCampainer,
  updateCampaigner,
} from "@/store/campaigners/campaigners.service";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, Eye, Funnel, MoreHorizontal, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import CampaignerDetailsModal from "@/components/utils/CampaignerDetailsModal";
import { toast } from "@/utils/toast";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Field, FieldGroup } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CampaignerRegistrations = () => {
  const { campaginers, campaginerTotalPages, campainerLoading } = useSelector(
    (state) => state.campaginer,
  );
  const dispatch = useDispatch();
  const { currentCampaign } = useSelector((state) => state.campaign);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [campaigner, setSelectedCampaigner] = useState(null);
  const [sort, setSort] = useState("pending");
  const pageSize = 15;

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
    if (!currentCampaign?._id) return;

    dispatch(
      getCampainer({
        id: currentCampaign?._id,
        status: sort,
        campStatus: "active",
        page,
        pageSize,
        sort: "created_desc",
        search: debouncedSearch,
      }),
    );
  }, [currentCampaign?._id, debouncedSearch, page, sort, dispatch]);

  const handleCategoryChange = (id, checked) => {
    setPage(1);
    if (checked) {
      setSort(id);
    } else {
      setSort(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <Input
          placeholder="Search campaigner..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-3.5">
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
                  {[
                    {
                      label: "Pending",
                      value: "pending",
                    },
                    {
                      label: "Rejected",
                      value: "reject",
                    },
                  ]?.map((item) => (
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

          {/* <Button variant="outline">Export CSV</Button> */}
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-2xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[20%]">Name</TableHead>
              <TableHead className="w-[15%] text-center">Phone</TableHead>
              <TableHead className="w-[25%] text-center">Target</TableHead>
              <TableHead className="w-[15%] text-center">
                Touch With Devote
              </TableHead>
              <TableHead className="w-[30%] text-center">Status</TableHead>
              <TableHead className="w-[10%] text-center">Action</TableHead>
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
                    className="hover:bg-muted/50 transition"
                  >
                    <TableCell className="font-medium">
                      {" "}
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

                    <TableCell className="text-center">
                      {item.phoneNumber}
                    </TableCell>

                    <TableCell className="text-center">
                      ₹{item.targetAmount.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell className="text-center">
                      {item?.templeDevoteInTouch?.devoteName}
                    </TableCell>
                    <TableCell className="text-center">{item.status}</TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal size={18} />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={async () => {
                              await dispatch(
                                updateCampaigner({
                                  id: item?._id,
                                  formData: { status: "active" },
                                }),
                              ).unwrap();
                              dispatch(
                                getCampainer({
                                  id: currentCampaign?._id,
                                  status: sort,
                                  campStatus: "active",
                                  page,
                                  pageSize,
                                  sort: "created_desc",
                                }),
                              );
                            }}
                            className="cursor-pointer"
                          >
                            <Check className="mr-2 h-4 w-4 text-green-600" />
                            Approve
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={async () => {
                              await dispatch(
                                updateCampaigner({
                                  id: item?._id,
                                  formData: { status: "reject" },
                                }),
                              ).unwrap();
                              dispatch(
                                getCampainer({
                                  id: currentCampaign?._id,
                                  status: sort,
                                  campStatus: "active",
                                  page,
                                  pageSize,
                                  sort: "created_desc",
                                }),
                              );
                            }}
                            className="cursor-pointer"
                          >
                            <X className="mr-2 h-4 w-4 text-red-600" />
                            Reject
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => setSelectedCampaigner(item)}
                            className="cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        {/* DELETE MODAL */}
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
                              <AlertDialogCancel>Cancel</AlertDialogCancel>

                              <AlertDialogAction
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  try {
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
                                          status: "pending",
                                          campStatus: "active",
                                          page,
                                          pageSize,
                                          sort: "created_desc",
                                          search,
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
};

export default CampaignerRegistrations;
