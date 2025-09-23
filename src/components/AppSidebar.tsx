import { useIsMobile } from "@/hooks/use-mobile"
import { AppSidebarContent } from "@/components/AppSidebarContent"

export function AppSidebar() {
  const isMobile = useIsMobile()

  // On mobile, the sidebar is hidden and replaced by MobileHeader
  if (isMobile) {
    return null
  }

  return (
    <aside className="w-64 border-r bg-card">
      <AppSidebarContent />
    </aside>
  )
}