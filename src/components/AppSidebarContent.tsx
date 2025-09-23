import { useState } from "react"
import { useLocation, NavLink } from "react-router-dom"
import { 
  BarChart3, 
  Users, 
  FileText, 
  Building2,
  ChartLine,
  LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"
import { ThemeToggle } from "@/components/ThemeToggle"
import saquettoLogo from "@/assets/saquetto-logo.png"

const navigation = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
  { title: "Notas Fiscais", url: "/notas-fiscais", icon: FileText },
  { title: "Clientes", url: "/clientes", icon: Users },
  { title: "Fornecedores", url: "/fornecedores", icon: Building2 },
  { title: "Relatórios", url: "/relatorios", icon: ChartLine },
]

interface AppSidebarContentProps {
  isMobile?: boolean
  onItemClick?: () => void
}

export function AppSidebarContent({ isMobile = false, onItemClick }: AppSidebarContentProps) {
  const location = useLocation()
  const { user, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleItemClick = () => {
    if (onItemClick) {
      onItemClick()
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <img 
            src={saquettoLogo} 
            alt="Saquetto"
            className="h-5 w-5"
          />
        </div>
        <div className="flex flex-col">
          <h2 className="text-base font-semibold">Saquetto</h2>
          <p className="text-xs text-muted-foreground">Auditoria Fiscal</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = location.pathname === item.url
            const Icon = item.icon

            return (
              <NavLink
                key={item.title}
                to={item.url}
                onClick={handleItemClick}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  "hover:bg-muted/50",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.title}</span>
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t p-4 space-y-3">
        {user && (
          <div className="text-xs text-muted-foreground">
            <p>Logado como:</p>
            <p className="font-medium text-foreground truncate">{user.email}</p>
          </div>
        )}
        
        {!isMobile && (
          <div className="flex items-center justify-center">
            <ThemeToggle />
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          {isLoggingOut ? "Saindo..." : "Sair"}
        </Button>
      </div>
    </div>
  )
}