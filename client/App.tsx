import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ListingDetail from "./pages/ListingDetail";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MessagesPage from "./pages/MessagesPage";
import PostAdPage from "./pages/PostAdPage";
import DashboardPage from "./pages/DashboardPage";
import PlaceholderPage from "./pages/PlaceholderPage";

const queryClient = new QueryClient();

const App = () => (
  <LanguageProvider>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/listing/:id" element={<ListingDetail />} />

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Main Features */}
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/post-ad" element={<PostAdPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Placeholder routes */}
            <Route path="/categories" element={<PlaceholderPage title="Categories" />} />
            <Route path="/listings" element={<PlaceholderPage title="All Listings" />} />
            <Route path="/sell" element={<PlaceholderPage title="Selling Guide" />} />
            <Route path="/profile" element={<PlaceholderPage title="My Profile" />} />
            <Route path="/favorites" element={<PlaceholderPage title="Saved Listings" />} />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  </LanguageProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
