import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteDevote, getDevoteList } from "@/store/devotees/devote.service";
import { Input } from "@/components/ui/input";
import { toast } from "@/utils/toast";
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
import { Link } from "react-router-dom";

export default function DevoteeList() {
  const dispatch = useDispatch();
  const {
    devoteeLoading,
    devoteeListArr: devotees,
    deleteDevoteLoading,
  } = useSelector((state) => state.devote);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    dispatch(getDevoteList(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  const handleDelete = async (id) => {
    const result = await dispatch(deleteDevote(id)).unwrap();

    if (result?.success) {
      toast.success("Deleted Successfully");
      dispatch(getDevoteList());
    }
  };

  return (
    <section className="w-full space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Devotees</h1>
          <p className="text-sm text-muted-foreground">
            Search, update, and manage temple devotee records.
          </p>
        </div>
        <Input
          value={search}
          placeholder="Search devotee..."
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-sm"
        />
      </div>
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Temple Devotees</CardTitle>
        </CardHeader>

        <CardContent className="min-w-0 px-0 sm:px-6">
          <Table className="min-w-180">
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-center">Total Campaigners</TableHead>
                <TableHead className="text-center">Short Form</TableHead>
                <TableHead className="text-center">Devotee ID</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {devoteeLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : devotees?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    No Devotees found
                  </TableCell>
                </TableRow>
              ) : (
                devotees?.map((item, index) => (
                  <TableRow key={item?._id}>
                    <TableCell>{index + 1}</TableCell>

                    <TableCell className="font-medium">
                      {item?.devoteName}
                    </TableCell>

                    <TableCell>{item?.phoneNumber}</TableCell>
                    <TableCell>{item?.email}</TableCell>
                    <TableCell className="text-center">
                      {item?.totalCampaigners}
                    </TableCell>
                    <TableCell className="text-center">
                      {item?.shortForm}
                    </TableCell>
                    <TableCell className="text-center">
                      {item?.devoteeID}
                    </TableCell>

                    <TableCell className="text-center">
                      <Link to={`/admin/devotee/${item?._id}/edit`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Devotee?</AlertDialogTitle>

                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently remove the devotee from the temple
                              list.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>

                            <AlertDialogAction
                              className="bg-destructive text-white hover:bg-destructive/90"
                              onClick={() => handleDelete(item?._id)}
                            >
                              {deleteDevoteLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Delete"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
