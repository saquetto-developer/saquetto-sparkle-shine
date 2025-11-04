import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/ThemeToggle"
import { AppSidebarContent } from "@/components/AppSidebarContent"
import saquettoLogo from "@/assets/saquetto-logo.png"
import { useState } from "react"

export function MobileHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <AppSidebarContent isMobile onItemClick={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          
          <div className="flex items-center gap-2">
            <img 
              src={saquettoLogo} 
              alt="Saquetto"
              className="h-6 w-6"
            />
            <h1 className="text-lg font-semibold">Saquetto</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}