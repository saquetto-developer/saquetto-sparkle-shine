import { AppSidebar } from "@/components/AppSidebar"
import { MobileHeader } from "@/components/MobileHeader"
import { useIsMobile } from "@/hooks/use-mobile"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Menu } from "lucide-react"

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
            {!isMobile && (
              <div className="sticky top-0 z-10 flex h-14 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
                <SidebarTrigger className="h-9 w-9">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Alternar menu</span>
                </SidebarTrigger>
              </div>
            )}
            <div className="p-4 sm:p-6 md:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}