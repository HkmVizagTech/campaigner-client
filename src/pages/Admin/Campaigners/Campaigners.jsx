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
import { getCampainer } from "@/store/campaigners/campaigners.service";
import { getCurrentCampaign } from "@/store/campaign/campaign.service";
import CustomPagination from "@/components/utils/CustomPagination";
import { Funnel, Pencil, Trash2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
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

export default function CampaignersTable() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { campaginers, campaginerTotalPages } = useSelector(
    (state) => state.campaginer,
  );
  const { currentCampaign } = useSelector((state) => state.campaign);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    dispatch(getCurrentCampaign());
  }, [dispatch]);

  useEffect(() => {
    if (!currentCampaign?._id) return;

    dispatch(
      getCampainer({
        id: currentCampaign?._id,
        status: "active",
        page,
        pageSize,
        sort,
        search,
      }),
    );
  }, [currentCampaign?._id, search, sort, page, dispatch]);

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
    <div className="space-y-6">
      {/* FILTER BAR */}
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

          {/* <Button variant="outline">Export CSV</Button> */}
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-2xl border shadow-sm overflow-hidden">
        <Table>
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
            </TableRow>
          </TableHeader>

          <TableBody>
            {campaginers?.map((item) => {
              return (
                <TableRow
                  key={item._id}
                  className="hover:bg-muted/40 transition"
                >
                  <TableCell className="font-medium">{item.name}</TableCell>

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
                      onClick={() => navigate(`/admin/funders?id=${item?._id}`)}
                    >
                      View Funders
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      {/* EDIT */}
                      <Button
                        size="icon-sm"
                        variant="outline"
                        onClick={() =>
                          navigate(`/admin/campaigner/edit/${item._id}`)
                        }
                      >
                        <Pencil size={16} />
                      </Button>

                      {/* DELETE MODAL */}
                      {item?.raisedAmount < 0 && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="icon-sm" variant="destructive">
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
                                onClick={() => handleDelete(item._id)}
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
            })}
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
    </div>
  );
}
