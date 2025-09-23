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

  return (
    <div className={cn(
      "flex flex-col h-screen bg-card border-r border-border transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
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
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.title}>
              <NavLink
                to={item.url}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                  isActive(item.url)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="font-medium">{item.title}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-3">
        {!collapsed && user && (
          <div className="text-xs text-muted-foreground">
            <p>Logado como:</p>
            <p className="font-medium text-foreground truncate">{user.email}</p>
          </div>
        )}
        <div className={cn(
          "flex items-center gap-2",
          collapsed ? "justify-center" : "justify-between"
        )}>
          <ThemeToggle />
          <Button
            variant="outline"
            size={collapsed ? "icon" : "sm"}
            onClick={logout}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Sair</span>}
          </Button>
        </div>
      </div>
    </div>
  )
}