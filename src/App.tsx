import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { lazy, Suspense } from "react";

// Eager load critical pages
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";

// Auth pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";

// Lazy load marketing pages
const Solutions = lazy(() => import("./pages/Solutions"));
const Pricing = lazy(() => import("./pages/Pricing"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const WhyAutoMSP = lazy(() => import("./pages/WhyAutoMSP"));
const Resources = lazy(() => import("./pages/Resources"));

// App pages (dashboard/portal)
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import Interactions from "./pages/Interactions";
import Tickets from "./pages/Tickets";
import Team from "./pages/Team";
import Settings from "./pages/Settings";
import Integrations from "./pages/Integrations";
import Reports from "./pages/Reports";

const queryClient = new QueryClient();

// Loading fallback for lazy loaded pages
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-primary animate-pulse flex items-center justify-center">
        <span className="text-primary-foreground font-heading font-bold text-xl">A</span>
      </div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public marketing routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/solutions" element={<Solutions />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/why-automsp" element={<WhyAutoMSP />} />
              <Route path="/resources" element={<Resources />} />

              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/onboarding" element={<Onboarding />} />

              {/* App routes (protected portal/dashboard) */}
              <Route path="/portal" element={<AppLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="clients" element={<Clients />} />
                <Route path="clients/:id" element={<ClientDetail />} />
                <Route path="interactions" element={<Interactions />} />
                <Route path="tickets" element={<Tickets />} />
                <Route path="team" element={<Team />} />
                <Route path="settings" element={<Settings />} />
                <Route path="integrations" element={<Integrations />} />
                <Route path="reports" element={<Reports />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
