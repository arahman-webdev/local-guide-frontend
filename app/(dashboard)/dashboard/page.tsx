
import { SectionCards } from "@/components/section-cards"

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
export default function DashboardPage() {
  return (
    <SidebarProvider
    
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <SidebarInset className="px-0 bg-[#EFF4F8]">
        <SectionCards />
      </SidebarInset>
    </SidebarProvider>
  )
}
