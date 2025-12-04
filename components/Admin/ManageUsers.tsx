import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { IconUsers } from "@tabler/icons-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";

const items = [
    {
        balance: "$1,250.00",
        email: "alex.t@company.com",
        id: "1",
        image:
            "https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/avatar-40-02_upqrxi.jpg",
        language: "English",
        name: "Alex Thompson",
        status: "Active",
        role: "ADMIN",
    },
    {
        balance: "$600.00",
        email: "sarah.c@company.com",
        id: "2",
        image:
            "https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/avatar-40-01_ij9v7j.jpg",
        language: "Bangla",
        name: "Sarah Chen",
        status: "Active",
        role: "GUIDE",
    },
    {
        balance: "$0.00",
        email: "m.garcia@company.com",
        id: "4",
        image:
            "https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/avatar-40-03_dkeufx.jpg",
        language: "Urdu",
        name: "Maria Garcia",
        status: "Active",
        role: "Tourist",
    },
    {
        balance: "-$1,000.00",
        email: "d.kim@company.com",
        id: "5",
        image:
            "https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/avatar-40-05_cmz0mg.jpg",
        language: "Bangla, English",
        name: "David Kim",
        status: "Active",
        role: "Tourist",
    },
];

export default function ManageUsers() {
    return (
        <div className="">
            <h1 className="text-2xl font-bold text-blue-600 mb-6 flex gap-1.5 items-center"><IconUsers size={30} /> Manage Users</h1>
            <div className="bg-white p-8">

                <Table>
                    <TableHeader>
                        <TableRow className=" bg-[#F7FAFC]">
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Language</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="p-12">
                        {items.map((item) => (
                            <TableRow key={item.id} className="hover:bg-[#EAF1FF]">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <img
                                            alt={item.name}
                                            className="rounded-xs"
                                            height={50}
                                            src={item.image}
                                            width={50}
                                        />
                                        <div>
                                            <div className="font-medium">{item.name}</div>
                                            <span className="mt-0.5 text-muted-foreground text-xs">
                                                {item.role}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{item.email}</TableCell>
                                <TableCell>{item.language}</TableCell>
                                <TableCell>{item.status}</TableCell>
                                <TableCell className="flex justify-end">
                                    <Select>
                                        <SelectTrigger className="w-[150px] text-right">
                                            <SelectValue placeholder="Select a fruit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Fruits</SelectLabel>
                                                <SelectItem value="apple">Inactive</SelectItem>
                                                <SelectItem value="banana">Blocked</SelectItem>
                                                <SelectItem value="blueberry">Deleted</SelectItem>
                                               
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="pt-4">
                    Total users:
                </div>
            </div>


        </div>
    );
}
