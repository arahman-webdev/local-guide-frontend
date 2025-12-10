"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";

import { IconUsers } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface ManageUsersTableProps {
  users: any[];
}

export default function ManageUsersTable({ users }: ManageUsersTableProps) {
  const [userList, setUserList] = useState(users);
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string;
    status: string;
  } | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle status selection
  const handleStatusSelect = (userId: string, userName: string, status: string) => {
    setSelectedUser({ id: userId, name: userName, status });
    setNewStatus(status);
    setIsDialogOpen(true);
  };

  // Get token from localStorage
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  };

  // Update user status
  const handleStatusChange = async () => {
    if (!selectedUser || !newStatus) return;

    try {
      setLoading(true);
      
      const token = getToken();
      
      if (!token) {
        toast.error("Authentication required. Please log in again.");
        setIsDialogOpen(false);
        return;
      }

      console.log('Updating user status:', {
        userId: selectedUser.id,
        newStatus: newStatus,
        token: token ? 'Token found' : 'No token'
      });

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/status/${selectedUser.id}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      console.log('Status update response:', {
        status: res.status,
        statusText: res.statusText
      });

      const data = await res.json();
      console.log('Status update data:', data);

      if (!res.ok) {
        if (res.status === 401) {
          toast.error("Session expired. Please login again.");
          // Clear storage and redirect
          if (typeof window !== 'undefined') {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '/login';
          }
          return;
        }
        
        if (res.status === 403) {
          toast.error("You don't have permission to update user status.");
          return;
        }
        
        throw new Error(data.message || `Failed to update status: ${res.status}`);
      }

      if (!data.success) {
        toast.error(data.message || "Failed to update status");
        return;
      }

      toast.success("Status updated successfully");

      // Update local state
      setUserList(prev =>
        prev.map(user =>
          user.id === selectedUser.id ? { ...user, status: newStatus } : user
        )
      );

      // Reset dialog
      setIsDialogOpen(false);
      setSelectedUser(null);
      setNewStatus("");

    } catch (err: any) {
      console.error("Error updating status:", err);
      
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        toast.error("Cannot connect to server. Please check your connection.");
      } else {
        toast.error(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-600 mb-6 flex gap-1.5 items-center">
        <IconUsers size={30} /> Manage Users
      </h1>

      <div className="bg-white shadow-md rounded-xl p-8 border border-blue-100">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-50">
              <TableHead className="font-semibold text-blue-700">Name</TableHead>
              <TableHead className="font-semibold text-blue-700">Email</TableHead>
              <TableHead className="font-semibold text-blue-700">Role</TableHead>
              <TableHead className="font-semibold text-blue-700">Status</TableHead>
              <TableHead className="text-right font-semibold text-blue-700">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {userList.map((user) => (
              <TableRow key={user.id} className="hover:bg-blue-50/50 transition">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image
                      src={user.profilePic || "/default-user.jpg"}
                      alt={user.name}
                      width={50}
                      height={50}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium text-blue-900">{user.name}</div>
                      <span className="text-xs text-gray-600 capitalize">{user.role?.toLowerCase() || 'user'}</span>
                    </div>
                  </div>
                </TableCell>

                <TableCell>{user.email}</TableCell>
                <TableCell className="capitalize">{user.role?.toLowerCase() || 'user'}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === "ACTIVE" 
                      ? "bg-green-100 text-green-800" 
                      : user.status === "INACTIVE" 
                      ? "bg-yellow-100 text-yellow-800"
                      : user.status === "BLOCKED"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {user.status || 'INACTIVE'}
                  </span>
                </TableCell>

                <TableCell className="flex justify-end">
                  <Select
                    onValueChange={(value) => handleStatusSelect(user.id, user.name, value)}
                  >
                    <SelectTrigger className="w-[150px] border-blue-200">
                      <SelectValue placeholder="Change Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                        <SelectItem value="BLOCKED">Blocked</SelectItem>
                        <SelectItem value="DELETED">Deleted</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="pt-4 font-semibold text-blue-800">
          Total users: {userList.length}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the status of{" "}
              <span className="font-semibold text-blue-600">{selectedUser?.name}</span>{" "}
              from <span className="font-semibold">{selectedUser?.status}</span> to{" "}
              <span className="font-semibold">{newStatus}</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)} disabled={loading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusChange} disabled={loading}>
              {loading ? "Updating..." : "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}