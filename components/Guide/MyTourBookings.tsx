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
import { Loader2 } from "lucide-react";
import { IconUsers } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

export default function MyTourBookings({ bookings }: { bookings: any[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const updateBookingStatus = async (id: string, newStatus: string) => {
    try {
      setLoadingId(id);

      const res = await fetch(
        `http://localhost:5000/api/bookings/update-status/${id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to update booking");
        return;
      }

      toast.success(`Booking ${newStatus.toLowerCase()} successfully`);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-600 mb-6 flex gap-1.5 items-center">
        <IconUsers size={30} /> My Tour Bookings
      </h1>

      <div className="bg-white shadow-md rounded-xl p-8 border border-blue-100">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-50">
              <TableHead className="font-semibold text-blue-700">Tour</TableHead>
              <TableHead className="font-semibold text-blue-700">Tourist</TableHead>
              <TableHead className="font-semibold text-blue-700">Start</TableHead>
              <TableHead className="font-semibold text-blue-700">End</TableHead>
              <TableHead className="font-semibold text-blue-700">Status</TableHead>
              <TableHead className="text-right font-semibold text-blue-700">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {bookings?.map((booking) => (
              <TableRow
                key={booking.bookingId}
                className="hover:bg-blue-50/50 transition"
              >
                <TableCell className="font-medium text-blue-900">
                  {booking.tourTitle}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image
                      src={booking.tourist.profilePic || "/default-user.jpg"}
                      alt={booking.tourist.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium">{booking.tourist.name}</div>
                      <div className="text-xs text-gray-600">
                        {booking.tourist.email}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  {new Date(booking.startTime).toLocaleString()}
                </TableCell>

                <TableCell>
                  {new Date(booking.endTime).toLocaleString()}
                </TableCell>

                <TableCell>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : booking.status === "CONFIRMED"
                        ? "bg-green-100 text-green-700"
                        : booking.status === "COMPLETED"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {booking.status}
                  </span>
                </TableCell>

                <TableCell className="text-right space-x-3">
                  {/* PENDING → CONFIRM / CANCEL */}
                  {booking.status === "PENDING" && (
                    <>
                      <Button
                        size="sm"
                        className="bg-blue-500 text-white hover:bg-blue-600"
                        disabled={loadingId === booking.bookingId}
                        onClick={() =>
                          updateBookingStatus(booking.bookingId, "CONFIRMED")
                        }
                      >
                        {loadingId === booking.bookingId ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Confirm"
                        )}
                      </Button>

                      <Button
                        size="sm"
                        className="bg-red-500 text-white hover:bg-red-600"
                        disabled={loadingId === booking.bookingId}
                        onClick={() =>
                          updateBookingStatus(booking.bookingId, "CANCELLED")
                        }
                      >
                        {loadingId === booking.bookingId ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Cancel"
                        )}
                      </Button>
                    </>
                  )}

                  {/* CONFIRMED → COMPLETE / CANCEL */}
                  {booking.status === "CONFIRMED" && (
                    <>
                      <Button
                        size="sm"
                        className="bg-green-500 text-white hover:bg-green-600"
                        disabled={loadingId === booking.bookingId}
                        onClick={() =>
                          updateBookingStatus(booking.bookingId, "COMPLETED")
                        }
                      >
                        {loadingId === booking.bookingId ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Complete"
                        )}
                      </Button>

                      <Button
                        size="sm"
                        className="bg-red-500 text-white hover:bg-red-600"
                        disabled={loadingId === booking.bookingId}
                        onClick={() =>
                          updateBookingStatus(booking.bookingId, "CANCELLED")
                        }
                      >
                        {loadingId === booking.bookingId ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Cancel"
                        )}
                      </Button>
                    </>
                  )}

                  {/* COMPLETED / CANCELLED → no actions */}
                  {(booking.status === "COMPLETED" ||
                    booking.status === "CANCELLED") && (
                    <span className="text-gray-400 text-sm">No actions</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="pt-4 font-semibold text-blue-800">
          Showing {bookings.length} bookings
        </div>
      </div>
    </div>
  );
}
