import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, Loader2, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteSeva, getSevaList } from "@/store/seva/seva.service";
import { Link } from "react-router-dom";
import { toast } from "@/utils/toast";

const SevaList = () => {
  const dispatch = useDispatch();
  const { sevaList, sevaLoading, deleteLoading } = useSelector(
    (state) => state.seva,
  );

  const [selectedSeva, setSelectedSeva] = useState(null);

  useEffect(() => {
    dispatch(getSevaList());
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteSeva(id)).unwrap();
      await dispatch(getSevaList()).unwrap();
      toast.success("Seva Deleted Successfully");
    } catch (error) {
      toast.error(error || "Internal Server error");
    }
  };

  const getSevaCode = (seva) => seva?.sevaCode || seva?.SevaCode || "-";

  const getSevaSubCode = (seva) =>
    seva?.sevaSubCode || seva?.SevaSubCode || "-";

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-7xl">
        <Card className="p-6 shadow-sm rounded-2xl">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Seva List</h2>
              <p className="text-sm text-muted-foreground">
                Manage all available seva offerings.
              </p>
            </div>
          </div>

          {/* Loading State */}
          {sevaLoading ? (
            <div className="py-16 text-center text-muted-foreground">
              Loading seva list...
            </div>
          ) : sevaList?.length === 0 ? (
            /* Empty State */
            <div className="py-16 text-center text-muted-foreground">
              No seva added yet.
            </div>
          ) : (
            <Table className="min-w-160">
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Sub Category</TableHead>
                  <TableHead>Codes</TableHead>
                  <TableHead>Amount (₹)</TableHead>
                  <TableHead>Benefits</TableHead>
                  <TableHead className="text-center w-40">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {sevaList?.map((seva) => (
                  <TableRow key={seva?._id}>
                    <TableCell className="font-medium">
                      <div className="space-y-1">
                        <p className="font-medium">{seva?.sevaCategory || "-"}</p>
                        <p className="text-xs text-muted-foreground">
                          ID: {seva?.sevaCategoryId || "-"}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <p>{seva?.sevaSubCategory || "-"}</p>
                        <p className="text-xs text-muted-foreground">
                          ID: {seva?.sevaSubCategoryId || "-"}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <p>Category: {getSevaCode(seva)}</p>
                        <p className="text-muted-foreground">
                          Sub: {getSevaSubCode(seva)}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      ₹ {seva?.sevaAmount?.toLocaleString()}
                    </TableCell>

                    <TableCell>
                      <Badge variant="secondary">
                        {seva?.sevaPoints?.length} Benefits
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        {/* View */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-primary cursor-pointer"
                          onClick={() => setSelectedSeva(seva)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {/* Edit */}
                        <Link
                          to={`/admin/seva/${seva?._id}/${seva?.sevaCategory || "seva"}/edit`}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>

                        {/* Delete */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive cursor-pointer"
                          onClick={() => handleDelete(seva?._id)}
                        >
                          {deleteLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* View Dialog */}
          <Dialog
            open={!!selectedSeva}
            onOpenChange={() => setSelectedSeva(null)}
          >
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{selectedSeva?.sevaCategory || "Seva Details"}</DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-semibold">{selectedSeva?.sevaCategory || "-"}</p>
                    <p className="text-xs text-muted-foreground">
                      ID: {selectedSeva?.sevaCategoryId || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Sub Category</p>
                    <p className="font-semibold">
                      {selectedSeva?.sevaSubCategory || "-"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ID: {selectedSeva?.sevaSubCategoryId || "-"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Seva Code</p>
                    <p className="font-medium">{getSevaCode(selectedSeva)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Seva Sub Code</p>
                    <p className="font-medium">{getSevaSubCode(selectedSeva)}</p>
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-semibold text-lg">
                    ₹ {selectedSeva?.sevaAmount?.toLocaleString()}
                  </p>
                </div>

                {/* Benefits */}
                <div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Benefits Included
                  </p>

                  <div className="space-y-3">
                    {selectedSeva?.sevaPoints?.length ? (
                      selectedSeva?.sevaPoints?.map((point, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 text-sm bg-muted/40 px-3 py-2 rounded-md"
                        >
                          <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                          <span>{point}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No benefits added.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </Card>
      </div>
    </section>
  );
};

export default SevaList;
