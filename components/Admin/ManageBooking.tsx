"use client";

import { IconUsers } from "@tabler/icons-react";
import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import Image from "next/image";
import { Eye, Trash2 } from "lucide-react";
import { ConfirmationAlert } from "../sharedComponent/ConfirmationAlert";
import { useRouter } from "next/navigation";

export default function ManageBooking({ bookings }: { bookings: any[] }) {
    const router = useRouter()
 const [loadingId, setLoadingId] = useState<string | null>(null);



      //  Handle Delete
  const handleDelete = async (id: string) => {
    try {
      setLoadingId(id);

      const res = await fetch(`http://localhost:5000/api/bookings/${id}`, {
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
                <IconUsers size={30} /> Manage Bookings
            </h1>

            <div className="bg-white shadow-md rounded-xl p-8 border border-blue-100">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-blue-50">
                            <TableHead className="font-semibold text-blue-700">
                                Tour
                            </TableHead>
                            <TableHead className="font-semibold text-blue-700">
                                Booking Code
                            </TableHead>
                            <TableHead className="font-semibold text-blue-700">
                                User
                            </TableHead>
                            <TableHead className="font-semibold text-blue-700">
                                Time
                            </TableHead>
                            <TableHead className="font-semibold text-blue-700">
                                Payment
                            </TableHead>
                            <TableHead className="font-semibold text-blue-700">
                                Status
                            </TableHead>
                            <TableHead className="text-right font-semibold text-blue-700">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {bookings?.map((booking) => (
                            <TableRow
                                key={booking?.id}
                                className="hover:bg-blue-50/50 transition"
                            >
                                {/* 👉 Tour */}
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={
                                                booking?.tour?.tourImages?.[0]?.imageUrl ||
                                                "/default-tour.jpg"
                                            }
                                            alt={booking?.tour?.title}
                                            width={50}
                                            height={50}
                                            className="rounded-md object-cover"
                                        />

                                        <div>
                                            <div className="font-medium text-blue-900">
                                                {booking?.tour?.title}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                {booking?.tour?.category}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>

                                {/* 👉 Booking Code */}
                                <TableCell>
                                    <div className="font-semibold text-blue-900">
                                        {booking.bookingCode}
                                    </div>
                                </TableCell>

                                {/* 👉 User */}
                                <TableCell>
                                    <div className="font-medium">
                                        {booking?.user?.name || "Unknown User"}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        {booking?.user?.email}
                                    </div>
                                </TableCell>

                                {/* 👉 Time */}
                                <TableCell>
                                    <div className="text-sm font-medium text-gray-800">
                                        {new Date(booking.startTime).toLocaleDateString()} ➝{" "}
                                        {new Date(booking.endTime).toLocaleDateString()}
                                    </div>
                                    <div className="text-[10px] text-gray-500">
                                        {new Date(booking.startTime).toLocaleTimeString()}
                                    </div>
                                </TableCell>

                                {/* 👉 Payment */}
                                <TableCell>
                                    {booking.payment ? (
                                        <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
                                            PAID
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-700">
                                            UNPAID
                                        </span>
                                    )}
                                </TableCell>

                                {/* 👉 Status */}
                                <TableCell>
                                    <span
                                        className={`
                                            px-3 py-1 rounded-full text-xs font-medium
                                            ${booking.status === "COMPLETED"
                                                ? "bg-green-100 text-green-700"
                                                : booking.status === "CONFIRMED"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : booking.status === "PENDING"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : booking.status === "CANCELLED"
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-gray-100 text-gray-700"
                                            }
  `}
                                    >
                                        {booking.status}
                                    </span>

                                </TableCell>

                                {/* 👉 Actions */}
                                <TableCell className="text-right space-x-3">
                                    {/* View */}
                                    <button className="p-2 hover:bg-blue-100 rounded-md cursor-pointer">
                                        <Eye size={18} className="text-blue-600" />
                                    </button>

                                    {/* Delete */}
                                    <ConfirmationAlert
                                        onConfirm={() => handleDelete(booking?.id)}
                                    >
                                        <Trash2 size={18} className="text-red-600 hover:bg-blue-400 cursor-pointer" />
                                    </ConfirmationAlert>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Total Count */}
                <div className="pt-4 font-semibold text-blue-800">
                    Total Bookings: {bookings?.length}
                </div>
            </div>
        </div>
    );
}
