"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { LogOut } from "lucide-react";
import Link from "next/link";

export function ProfileOpen({ name,profilePic, role, logout }: { name: string;profilePic?:string, role?: string; logout: () => void }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100">
          {name}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 border border-blue-200">
        <div className="flex flex-col gap-3">
          <p className="font-semibold text-gray-700">{name}</p>
          <p className="text-sm text-gray-500">{role}</p>
          <Link href="/dashboard/profile" className="text-blue-700 hover:text-indigo-500 font-medium">
            My Profile
          </Link>
          <button
            onClick={logout}
            className="text-left text-red-500 hover:text-red-700 font-medium flex gap-2 cursor-pointer"
          >
            <LogOut />Logout
            
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
