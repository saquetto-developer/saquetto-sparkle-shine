import { useIsMobile } from "@/hooks/use-mobile"
import { AppSidebarContent } from "@/components/AppSidebarContent"
import { Sidebar, SidebarContent, useSidebar } from "@/components/ui/sidebar"

export function AppSidebar() {
  const isMobile = useIsMobile()
  const { state } = useSidebar()

  // On mobile, the sidebar is hidden and replaced by MobileHeader
  if (isMobile) {
    return null
  }

  return (
    <Sidebar 
      className={state === "collapsed" ? "w-14" : "w-64"}
      collapsible="icon"
    >
      <SidebarContent className="flex flex-col h-full">
        <AppSidebarContent />
      </SidebarContent>
    </Sidebar>
  )
}