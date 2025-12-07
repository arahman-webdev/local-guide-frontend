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

export default function ManageTourListingTable({ tours }: { tours: any[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // 🔵 Update tour status
  const updateStatus = async (id: string) => {
    try {
      setLoadingId(id);

      const res = await fetch(
        `http://localhost:5000/api/tour/toggle-status/${id}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await res.json();
      console.log("Status Updated:", data);
      router.refresh();
    } catch (error) {
      console.error("Status Update Error:", error);
    } finally {
      setLoadingId(null);
    }
  };

  //  Handle Delete
  const handleDelete = async (id: string) => {
    try {
      setLoadingId(id);

      const res = await fetch(`http://localhost:5000/api/tour/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      console.log("Deleted:", data);
      router.refresh();
    } catch (error) {
      console.error("Delete Error:", error);
    } finally {
      setLoadingId(null);
    }
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
                      src={tour.tourImages?.[0]?.imageUrl || "/default-user.jpg"}
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
                    {tour?.guide?.name || "Unknown"}
                  </div>
                  <div className="text-xs text-gray-600">
                    {tour?.guide?.email}
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
                  <Button variant="ghost" size="icon">
                    <Eye size={19} className="text-blue-600" />
                  </Button>

                  {/* Delete Button */}
                  <ConfirmationAlert onConfirm={() => handleDelete(tour.id)}>
                    <Trash2 size={19} className="text-red-600" />
                  </ConfirmationAlert>
             
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Total Count */}
        <div className="pt-4 font-semibold text-blue-800">
          Total Tours: {tours?.length}
        </div>
      </div>
    </div>
  );
}
