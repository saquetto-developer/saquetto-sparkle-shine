import { AppSidebar } from "@/components/AppSidebar"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen w-full">
      <AppSidebar />
      <main className="flex-1 overflow-auto bg-background-secondary">
        {children}
      </main>
    </div>
  )
}