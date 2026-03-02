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
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSevaList } from "@/store/seva/seva.service";

const SevaList = () => {
  const dispatch = useDispatch();
  const { sevaList, sevaLoading } = useSelector((state) => state.seva);

  const [selectedSeva, setSelectedSeva] = useState(null);

  useEffect(() => {
    dispatch(getSevaList());
  }, [dispatch]);

  return (
    <section className="py-2 px-4">
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 shadow-sm rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
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
            /* Table */
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Seva Name</TableHead>
                  <TableHead>Amount (₹)</TableHead>
                  <TableHead>Benefits</TableHead>
                  <TableHead className="text-center w-40">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {sevaList?.map((seva) => (
                  <TableRow key={seva?._id}>
                    <TableCell className="font-medium">
                      {seva?.sevaName}
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
                          className="text-muted-foreground hover:text-primary"
                          onClick={() => setSelectedSeva(seva)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {/* Edit */}
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>

                        {/* Delete */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
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
                <DialogTitle>{selectedSeva?.sevaName}</DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-4">
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
                    {selectedSeva?.sevaPoints?.map((point, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 text-sm bg-muted/40 px-3 py-2 rounded-md"
                      >
                        <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                        <span>{point}</span>
                      </div>
                    ))}
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
