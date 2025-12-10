

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
import LeavReview from "./LeavingReview";

export default function MyBooking({ bookings }: { bookings: any[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

 

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
              <TableHead className="font-semibold text-blue-700">Booking Code</TableHead>
              <TableHead className="font-semibold text-blue-700">Start</TableHead>
              <TableHead className="font-semibold text-blue-700">End</TableHead>
              <TableHead className="font-semibold text-blue-700">Status</TableHead>
              <TableHead className="font-semibold text-blue-700">Actions</TableHead>
             
            </TableRow>
          </TableHeader>

          <TableBody>
            {bookings?.map((booking) => (
              <TableRow
                key={booking.bookingId}
                className="hover:bg-blue-50/50 transition"
              >
                <TableCell className="font-medium text-blue-900">
                  {booking.tour.title}
                </TableCell>

                <TableCell>
                {booking.bookingCode}
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
                <TableCell>
                 <LeavReview />
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
