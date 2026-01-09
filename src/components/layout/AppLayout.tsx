import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { MobileNav } from "./MobileNav";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full gradient-mesh">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col pb-20 md:pb-0">
          {children}
        </SidebarInset>
        <MobileNav />
      </div>
    </SidebarProvider>
  );
}
