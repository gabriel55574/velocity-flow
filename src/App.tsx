import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import CalendarPage from "./pages/Calendar";
import Reports from "./pages/Reports";
import Playbooks from "./pages/Playbooks";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
// Auth
import Login from "./pages/auth/Login";
import ResetPassword from "./pages/auth/ResetPassword";
// Client Portal
import ClientDashboard from "./pages/client/Dashboard";
import ClientApprovals from "./pages/client/Approvals";
import ClientAssets from "./pages/client/Assets";
import ClientReports from "./pages/client/Reports";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Agency Portal */}
          <Route path="/" element={<Index />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/:id" element={<ClientDetail />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/playbooks" element={<Playbooks />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* Client Portal */}
          <Route path="/client/dashboard" element={<ClientDashboard />} />
          <Route path="/client/approvals" element={<ClientApprovals />} />
          <Route path="/client/assets" element={<ClientAssets />} />
          <Route path="/client/reports" element={<ClientReports />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
