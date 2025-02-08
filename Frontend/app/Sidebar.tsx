'use client'
import 
{
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
  } from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { GiSurfBoard } from "react-icons/gi"
import { GoTasklist } from "react-icons/go"
  
  export function AppSidebar() {
    const path = usePathname()
     
    
    return (
      <Sidebar>
        <div className="h-[100px]">
        <SidebarHeader className="m-auto">James Andreson
        </SidebarHeader>
        </div >
          <hr/>
        <SidebarContent className="m-auto">
          <SidebarGroup >
            <div className="flex gap-3"><GoTasklist/> Dashboard</div>
          </SidebarGroup>
          <SidebarGroup>
          <div className="flex gap-3"><GoTasklist/> My Reports </div>
          </SidebarGroup>
          <SidebarGroup className={`${path == '/my-plans' ? 'bg-purple-200':''} rounded`}>
          <div className="flex gap-3"><GoTasklist/> <Link href='/my-plans' className="px-4 "> My Workout Plan</Link> </div>
          </SidebarGroup>
          <SidebarGroup className={`${path == '/my-diets' ? 'bg-purple-200':''} rounded`}>
          <div className="flex gap-3"><GoTasklist/> <Link href='my-diets' className="px-4">My Diet Plan</Link></div>
          </SidebarGroup>
          <SidebarGroup>
          <div className="flex gap-3"><GoTasklist/> Payments</div>
          </SidebarGroup>
          <SidebarGroup>
          <div className="flex gap-3"><GoTasklist/> Equipments</div>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="bg-purple-600 h-[50px]">
          <div className="text-white text-center">Liul Sintayehu</div>
          </SidebarFooter>
      </Sidebar>
    )
  }
  