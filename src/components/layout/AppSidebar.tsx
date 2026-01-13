import {
  LayoutDashboard,
  Users,
  Settings,
  Zap,
  Calendar,
  BarChart3,
  FileText,
  ChevronRight,
  Building2,
  LogOut
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar-context";
import { useAuth } from "@/contexts/useAuth";
import { useQueryClient } from "@tanstack/react-query";

const mainNavItems = [
  { title: "Today", url: "/", icon: Zap },
  { title: "Clients", url: "/clients", icon: Users },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Playbooks", url: "/playbooks", icon: FileText },
];

const settingsNavItems = [
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const queryClient = useQueryClient();
  const { signOut } = useAuth();
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        <NavLink to="/" className="flex items-center gap-3">
          <img src="/logo.svg" alt="Velocity Logo" className="h-9 w-9 object-contain" />
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-sidebar-foreground">Velocity</span>
              <span className="text-[10px] text-muted-foreground">Agency OS</span>
            </div>
          )}
        </NavLink>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/70 px-3">
            {!isCollapsed && "Main"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                        "hover:bg-sidebar-accent",
                        isActive(item.url) && "bg-sidebar-accent text-sidebar-primary font-medium"
                      )}
                    >
                      <item.icon className={cn(
                        "h-4 w-4 shrink-0",
                        isActive(item.url) ? "text-sidebar-primary" : "text-muted-foreground"
                      )} />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1">{item.title}</span>
                          {item.title === "Today" && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                              5
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/70 px-3">
            {!isCollapsed && "System"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                        "hover:bg-sidebar-accent",
                        isActive(item.url) && "bg-sidebar-accent text-sidebar-primary font-medium"
                      )}
                    >
                      <item.icon className={cn(
                        "h-4 w-4 shrink-0",
                        isActive(item.url) ? "text-sidebar-primary" : "text-muted-foreground"
                      )} />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className={cn(
          "flex items-center gap-3",
          isCollapsed && "justify-center"
        )}>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground text-xs font-medium">
            AD
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Admin</p>
              <p className="text-xs text-muted-foreground truncate">admin@velocity.io</p>
              <button
                className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                onClick={async () => {
                  await signOut();
                  queryClient.clear();
                }}
              >
                <LogOut className="h-3 w-3" />
                Sair
              </button>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
