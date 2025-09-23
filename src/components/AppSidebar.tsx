import { useState } from "react"
import { 
  BarChart3, 
  Users, 
  FileText, 
  Building2,
  ChartLine,
  ChevronLeft,
  ChevronRight,
  Bot,
  LogOut
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { useAuth } from "@/contexts/AuthContext"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import saquettoLogo from "@/assets/saquetto-logo.png"

const navigation = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
  { title: "Notas Fiscais", url: "/notas-fiscais", icon: FileText },
  { title: "Clientes", url: "/clientes", icon: Users },
  { title: "Fornecedores", url: "/fornecedores", icon: Building2 },
  { title: "Relatórios", url: "/relatorios", icon: ChartLine },
]

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const currentPath = location.pathname
  const { user, logout } = useAuth()

  const isActive = (path: string) => currentPath === path

  const NavigationItem = ({ item }: { item: typeof navigation[0] }) => {
    const active = isActive(item.url)
    
    const linkContent = (
      <NavLink
        to={item.url}
        className={cn(
          "flex items-center rounded-lg transition-all duration-200 relative group",
          collapsed 
            ? "w-10 h-10 justify-center mx-auto" 
            : "px-3 py-2 space-x-3",
          active
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <item.icon className={cn(
          "flex-shrink-0 transition-transform",
          collapsed ? "h-5 w-5" : "h-5 w-5",
          active && "scale-105"
        )} />
        {!collapsed && <span className="font-medium">{item.title}</span>}
      </NavLink>
    )

    if (collapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            {linkContent}
          </TooltipTrigger>
          <TooltipContent side="right" className="ml-2">
            <p>{item.title}</p>
          </TooltipContent>
        </Tooltip>
      )
    }

    return linkContent
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className={cn(
        "flex flex-col h-screen bg-card border-r border-border transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}>
        {/* Header */}
        <div className={cn(
          "flex items-center border-b border-border transition-all duration-300",
          collapsed 
            ? "justify-center p-2" 
            : "justify-between p-4"
        )}>
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <img src={saquettoLogo} alt="Saquetto" className="h-8 w-auto" />
              <div>
                <div className="flex items-center space-x-1">
                  <Bot className="h-4 w-4 text-primary" />
                  <h1 className="font-bold text-sm">Auditoria Fiscal IA</h1>
                </div>
                <p className="text-xs text-muted-foreground">Saquetto Industrial</p>
              </div>
            </div>
          )}
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCollapsed(!collapsed)}
                className="h-8 w-8 transition-transform hover:scale-105"
              >
                {collapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side={collapsed ? "right" : "bottom"}>
              <p>{collapsed ? "Expandir menu" : "Recolher menu"}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Navigation */}
        <nav className={cn(
          "flex-1 transition-all duration-300",
          collapsed ? "p-2" : "p-4"
        )}>
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.title}>
                <NavigationItem item={item} />
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className={cn(
          "border-t border-border transition-all duration-300",
          collapsed ? "p-2 space-y-2" : "p-4 space-y-3"
        )}>
          {!collapsed && user && (
            <div className="text-xs text-muted-foreground">
              <p>Logado como:</p>
              <p className="font-medium text-foreground truncate">{user.email}</p>
            </div>
          )}
          
          <div className={cn(
            "flex items-center transition-all duration-300",
            collapsed 
              ? "flex-col space-y-2" 
              : "justify-between gap-2"
          )}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={collapsed ? "w-10 flex justify-center" : ""}>
                  <ThemeToggle />
                </div>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">
                  <p>Alternar tema</p>
                </TooltipContent>
              )}
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size={collapsed ? "icon" : "sm"}
                  onClick={logout}
                  className={cn(
                    "text-muted-foreground hover:text-foreground transition-all",
                    collapsed && "w-10 h-10"
                  )}
                >
                  <LogOut className="h-4 w-4" />
                  {!collapsed && <span className="ml-2">Sair</span>}
                </Button>
              </TooltipTrigger>
              <TooltipContent side={collapsed ? "right" : "top"}>
                <p>Sair do sistema</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}