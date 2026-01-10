import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
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
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth - Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Agency Portal - Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/clients" element={
              <ProtectedRoute>
                <Clients />
              </ProtectedRoute>
            } />
            <Route path="/clients/:id" element={
              <ProtectedRoute>
                <ClientDetail />
              </ProtectedRoute>
            } />
            <Route path="/calendar" element={
              <ProtectedRoute>
                <CalendarPage />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="/playbooks" element={
              <ProtectedRoute>
                <Playbooks />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            
            {/* Client Portal - Protected routes */}
            <Route path="/client/dashboard" element={
              <ProtectedRoute>
                <ClientDashboard />
              </ProtectedRoute>
            } />
            <Route path="/client/approvals" element={
              <ProtectedRoute>
                <ClientApprovals />
              </ProtectedRoute>
            } />
            <Route path="/client/assets" element={
              <ProtectedRoute>
                <ClientAssets />
              </ProtectedRoute>
            } />
            <Route path="/client/reports" element={
              <ProtectedRoute>
                <ClientReports />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
