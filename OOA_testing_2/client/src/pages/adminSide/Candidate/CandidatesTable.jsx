import React, { useState, useEffect } from "react";
import { Trash2, Search, Filter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/ui/table";
import { Button } from "@/components/common/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/ui/select";
import { Input } from "@/components/common/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/common/ui/dialog";
import { toast } from "sonner";
import api from "@/lib/api";

const ATTEMPT_STATUSES = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"];

const CandidatesTable = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await fetch(`${api}/candidates/all`);
      const data = await response.json();
      setCandidates(data);
      setFilteredCandidates(data);
    } catch (error) {
      toast.error("Failed to fetch candidates");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${api}/candidates/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setCandidates(candidates.filter((candidate) => candidate._id !== id));
        setFilteredCandidates(
          filteredCandidates.filter((candidate) => candidate._id !== id)
        );
        toast.success("Candidate deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete candidate");
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    filterCandidates(value, statusFilter);
  };

  const handleStatusFilter = async (value) => {
    if (value === "all") {
      setStatusFilter("");
      await fetchCandidates();
    } else {
      setStatusFilter(value);
      filterCandidates(searchTerm, value);
    }
  };

  const filterCandidates = (search, status) => {
    let filtered = [...candidates];

    if (search) {
      filtered = filtered.filter(
        (candidate) =>
          candidate.fullName.toLowerCase().includes(search.toLowerCase()) ||
          candidate.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      filtered = filtered.filter(
        (candidate) => candidate.attemptStatus === status
      );
    }

    setFilteredCandidates(filtered);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {ATTEMPT_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Scheduled Start</TableHead>
            <TableHead>Actual Start</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCandidates.length > 0 ? (
            filteredCandidates.map((candidate) => (
              <TableRow key={candidate._id}>
                <TableCell className="font-medium">
                  {candidate.fullName}
                </TableCell>
                <TableCell>{candidate.email}</TableCell>
                <TableCell>
                  <span
                    className={`px-1 py-1 rounded-full text-xs font-medium ${
                      candidate.attemptStatus === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : candidate.attemptStatus === "IN_PROGRESS"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {candidate.attemptStatus.replace("_", " ")}
                  </span>
                </TableCell>
                <TableCell>
                  {formatDate(candidate.scheduledStartTime)}
                </TableCell>
                <TableCell>
                  {candidate.actualStartTime
                    ? formatDate(candidate.actualStartTime)
                    : "-"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedCandidate(candidate)}
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Candidate Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-1">Full Name</h4>
                            <p>{selectedCandidate?.fullName}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-1">Email</h4>
                            <p>{selectedCandidate?.email}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-1">Status</h4>
                            <p>
                              {selectedCandidate?.attemptStatus.replace(
                                "_",
                                " "
                              )}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-1">
                              Scheduled Start Time
                            </h4>
                            <p>
                              {formatDate(
                                selectedCandidate?.scheduledStartTime
                              )}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-1">
                              Actual Start Time
                            </h4>
                            <p>
                              {selectedCandidate?.actualStartTime
                                ? formatDate(selectedCandidate.actualStartTime)
                                : "-"}
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(candidate._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No candidates found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CandidatesTable;