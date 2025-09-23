import { AppSidebar } from "@/components/AppSidebar"
import { MobileHeader } from "@/components/MobileHeader"
import { useIsMobile } from "@/hooks/use-mobile"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile()

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen w-full flex flex-col">
        {isMobile && <MobileHeader />}
        
        <div className="flex flex-1 overflow-hidden">
          <AppSidebar />
          <main className="flex-1 overflow-auto bg-background-secondary">
            <div className="p-4 sm:p-6 md:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}