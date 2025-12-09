"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Eye, Trash2, Loader2 } from "lucide-react";
import { IconUsers } from "@tabler/icons-react";
import { ConfirmationAlert } from "../sharedComponent/ConfirmationAlert";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ManageTourListingTable({ tours }: { tours: any[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [tourToDelete, setTourToDelete] = useState<string | null>(null);

  // Get token from localStorage
  const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  };

  // Debug: Check if token exists
  const debugAuth = () => {
    console.log('=== DEBUG AUTH ===');
    console.log('localStorage token:', localStorage.getItem('accessToken'));
    console.log('localStorage userRole:', localStorage.getItem('userRole'));
    console.log('sessionStorage token:', sessionStorage.getItem('token'));
    console.log('Current URL:', window.location.href);
  };

  // Update tour status
  const updateStatus = async (id: string) => {
    try {
      setLoadingId(id);

      // Get token
      const token = getToken();
      
      console.log('Updating tour status - Token:', token ? 'Found' : 'Not found');
      
      if (!token) {
        debugAuth();
        toast.error("Please login again");
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tour/toggle-status/${id}`,
        {
          method: "PATCH",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      console.log('Status update response status:', res.status);

      if (res.status === 401) {
        toast.error("Session expired");
        localStorage.clear();
        window.location.href = '/login';
        return;
      }

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Status update error:', errorText);
        throw new Error(`Status update failed: ${res.status}`);
      }

      const data = await res.json();
      console.log('Status update success:', data);

      if (data.success) {
        toast.success(data.message || "Status updated");
        router.refresh();
      } else {
        toast.error(data.message || "Update failed");
      }

    } catch (error: any) {
      console.error("Status Update Error:", error);
      toast.error(error.message || "Failed to update");
    } finally {
      setLoadingId(null);
    }
  };

  // Open delete confirmation
  const openDeleteConfirm = (id: string) => {
    setTourToDelete(id);
    setDeleteConfirmOpen(true);
  };

  // Handle Delete
  const handleDelete = async () => {
    if (!tourToDelete) return;

    try {
      setLoadingId(tourToDelete);

      // Get token
      const token = getToken();
      
      console.log('Deleting tour - Token:', token ? 'Found' : 'Not found');
      
      if (!token) {
        debugAuth();
        toast.error("Please login again");
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tour/${tourToDelete}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Delete response status:', res.status);

      if (res.status === 401) {
        toast.error("Session expired");
        localStorage.clear();
        window.location.href = '/login';
        return;
      }

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Delete error:', errorText);
        throw new Error(`Delete failed: ${res.status}`);
      }

      const data = await res.json();
      console.log('Delete success:', data);

      if (data.success) {
        toast.success(data.message || "Tour deleted");
        router.refresh();
      } else {
        toast.error(data.message || "Delete failed");
      }

    } catch (error: any) {
      console.error("Delete Error:", error);
      toast.error(error.message || "Failed to delete");
    } finally {
      setLoadingId(null);
      setDeleteConfirmOpen(false);
      setTourToDelete(null);
    }
  };

  // View tour details
  const viewTour = (id: string) => {
    router.push(`/tours/${id}`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-600 mb-6 flex gap-1.5 items-center">
        <IconUsers size={30} /> Manage Tour Listings
      </h1>

      <div className="bg-white shadow-md rounded-xl p-8 border border-blue-100">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-50">
              <TableHead className="font-semibold text-blue-700">Tour</TableHead>
              <TableHead className="font-semibold text-blue-700">Guide</TableHead>
              <TableHead className="font-semibold text-blue-700">Fee</TableHead>
              <TableHead className="font-semibold text-blue-700">Status</TableHead>
              <TableHead className="text-right font-semibold text-blue-700">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tours?.map((tour) => (
              <TableRow
                key={tour.id}
                className="hover:bg-blue-50/50 transition"
              >
                {/* Tour Info */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image
                      src={tour.tourImages?.[0]?.imageUrl || "/default-tour.jpg"}
                      alt={tour.title}
                      width={50}
                      height={50}
                      className="rounded-md object-cover"
                    />
                    <div>
                      <div className="font-medium text-blue-900">
                        {tour.title}
                      </div>
                      <div className="text-xs text-gray-600">
                        {tour.category}
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Guide */}
                <TableCell>
                  <div className="font-medium">
                    {tour?.user?.name || "Unknown"}
                  </div>
                  <div className="text-xs text-gray-600">
                    {tour?.user?.email || ""}
                  </div>
                </TableCell>

                {/* Fee */}
                <TableCell>${tour.fee}</TableCell>

                {/* Status */}
                <TableCell>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${tour.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                      }`}
                  >
                    {tour.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right space-x-3">
                  {/* Activate / Deactivate */}
                  <Button
                    onClick={() => updateStatus(tour.id)}
                    disabled={loadingId === tour.id}
                    variant={tour.isActive ? "outline" : "default"}
                    size="sm"
                    className={`min-w-[120px] gap-2 transition-all duration-300 ${tour.isActive
                      ? "border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                      : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                  >
                    {loadingId === tour.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : tour.isActive ? (
                      "Deactivate"
                    ) : (
                      "Activate"
                    )}
                  </Button>

                  {/* View Button */}
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => viewTour(tour.id)}
                    title="View Tour"
                  >
                    <Eye size={19} className="text-blue-600" />
                  </Button>

                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteConfirm(tour.id)}
                    disabled={loadingId === tour.id}
                    title="Delete Tour"
                  >
                    {loadingId === tour.id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                    ) : (
                      <Trash2 size={19} className="text-red-600" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Total Count */}
        <div className="pt-4 font-semibold text-blue-800">
          Total Tours: {tours?.length || 0}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this tour? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setTourToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={loadingId === tourToDelete}
              >
                {loadingId === tourToDelete ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Debug button (remove in production) */}
      <button 
        onClick={debugAuth}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded text-xs opacity-50 hover:opacity-100"
      >
        Debug Auth
      </button>
    </div>
  );
}