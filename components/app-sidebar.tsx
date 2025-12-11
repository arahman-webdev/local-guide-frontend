"use client"

import * as React from "react"
import {
  IconDashboard,
  IconUsers,
  IconMap,
  IconMapSearch,
  IconCalendar,
  IconStar,
  IconUserCircle,
  IconSettings,
  IconHelp,
  IconSearch,
  IconHeart,
  IconPlus,
  IconLayout2,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import Image from "next/image"
import logo from "@/app/images/logo.png"
import { getMyProfile } from "@/app/utils/auth";
import { IUser } from "@/types/commonType";
import { redirect } from "next/dist/server/api-utils";


const navData = {
  ADMIN: {
    navMain: [
      { title: "Dashboard", url: "/dashboard/admin", icon: IconLayout2 },
      { title: "Manage Users", url: "/dashboard/admin/users", icon: IconUsers },
      { title: "Manage Tours", url: "/dashboard/admin/listings", icon: IconMap },
      { title: "Bookings", url: "/dashboard/admin/bookings", icon: IconCalendar },
      { title: "Profile", url: "/dashboard/profile", icon: IconUserCircle },
    ],
    navSecondary: [
      { title: "Settings", url: "/admin/settings", icon: IconSettings },
      { title: "Get Help", url: "/help", icon: IconHelp },
      { title: "Search", url: "/search", icon: IconSearch },
    ],
  },

  GUIDE: {
    navMain: [
      { title: "Dashboard", url: "/dashboard/guide", icon: IconLayout2 },
      { title: "My Tours", url: "/dashboard/guide/my-tours", icon: IconMap },
      { title: "Create Tour", url: "/dashboard/guide/create-tour", icon: IconPlus },
      { title: "Bookings Requests", url: "/dashboard/guide/bookings", icon: IconCalendar },
      { title: "My Reviews", url: "/dashboard/guide/reviews", icon: IconStar },
      { title: "Profile", url: "/dashboard/profile", icon: IconUserCircle },
    ],
    navSecondary: [
      { title: "Settings", url: "/guide/settings", icon: IconSettings },
      { title: "Get Help", url: "/help", icon: IconHelp },
      { title: "Search", url: "/search", icon: IconSearch },
    ],
  },

  TOURIST: {
    navMain: [
   
      { title: "Browse Tours", url: "/tours", icon: IconMapSearch },
      { title: "My Bookings", url: "/dashboard/tourist/bookings", icon: IconCalendar },
      { title: "My Reviews", url: "/dadhboard/tourist/reviews", icon: IconStar },
      { title: "Favorites", url: "/dadhboard/tourist/favourites", icon: IconHeart },
      { title: "Profile", url: "/dashboard/profile", icon: IconUserCircle },
    ],
    navSecondary: [
      { title: "Settings", url: "/tourist/settings", icon: IconSettings },
      { title: "Get Help", url: "/help", icon: IconHelp },
      { title: "Search", url: "/search", icon: IconSearch },
    ],
  },
};


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
 
  const [user, setUser] = React.useState<IUser | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMyProfile()
       
          setUser(res.data || null)
        
      } catch (err) {
        console.error("Failed to fetch user:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

 
  console.log("from dahsboasrd",user)

  const role = user?.role || "TOURIST"

  const data = navData[role]





  return (
    <Sidebar collapsible="offcanvas" {...props} className="bg-white shadow-xl shadow-blue-200">
      <SidebarHeader className="bg-white">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="felx"
            >
              <Link href="/" className="col-start-1">
                <Image src={logo} width={150} height={300} alt="Logo" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <NavMain items={data.navMain} />

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{
          name: user?.name as string,
          email:user?.email as string,
          profilePic: user?.profilePic as string
        }} />
      </SidebarFooter>
    </Sidebar>
  )
}
