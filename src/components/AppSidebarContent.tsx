import { useState } from "react"
import { useLocation, NavLink } from "react-router-dom"
import {
  BarChart3,
  Users,
  FileText,
  Building2,
  ChartLine,
  AlertTriangle,
  LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"
import { ThemeToggle } from "@/components/ThemeToggle"
import { useSidebar } from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const navigation = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
  { title: "Notas Fiscais", url: "/notas-fiscais", icon: FileText },
  { title: "Erros e Alertas", url: "/erros-alertas", icon: AlertTriangle },
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
  const { state } = useSidebar()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  
  const collapsed = state === "collapsed"

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

  const NavigationItem = ({ item }: { item: typeof navigation[0] }) => {
    const isActive = location.pathname === item.url
    const Icon = item.icon

    // On mobile, always show titles regardless of collapsed state
    const showTitle = isMobile || !collapsed

    const linkContent = (
      <NavLink
        key={item.title}
        to={item.url}
        onClick={handleItemClick}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
          collapsed && !isMobile ? "justify-center" : "",
          isActive
            ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {showTitle && <span>{item.title}</span>}
      </NavLink>
    )

    if (collapsed && !isMobile) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {linkContent}
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{item.title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return linkContent
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className={cn(
        "flex items-center border-b py-4",
        collapsed ? "justify-center px-2" : "px-6"
      )}>
        <div className={cn(
          "flex items-center",
          collapsed ? "justify-center" : "gap-3"
        )}>
          <div className="flex h-8 w-8 items-center justify-center">
            <img 
              src="/saquetto_logo.png" 
              alt="Saquetto"
              className="h-8 w-8 rounded-full object-cover"
            />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <h2 className="text-base font-semibold">Saquetto</h2>
              <p className="text-xs text-muted-foreground">Auditoria Fiscal</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-4">
        <nav className="space-y-1 px-3">
          {navigation.map((item) => (
            <NavigationItem key={item.title} item={item} />
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className={cn(
        "border-t p-4 space-y-3",
        collapsed && "px-2"
      )}>
        {user && !collapsed && (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">
              <p>Logado como:</p>
              <p className="font-medium text-foreground truncate">{user.email}</p>
            </div>
            {!isMobile && (
              <div className="flex items-center justify-start">
                <ThemeToggle />
              </div>
            )}
          </div>
        )}
        
        {collapsed && !isMobile ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full justify-center p-2 text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{isLoggingOut ? "Saindo..." : "Sair"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && (isLoggingOut ? "Saindo..." : "Sair")}
          </Button>
        )}
      </div>
    </div>
  )
}