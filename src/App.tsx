import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import PageTransition from "./components/PageTransition";
import ParallaxPaper from "./components/ParallaxPaper";
import MaintenancePage from "./components/MaintenancePage";
import Index from "./pages/Index";
import Article from "./pages/Article";
import Filsafat from "./pages/Filsafat";
import BookReview from "./pages/BookReview";
import Creativity from "./pages/Creativity";
import Growth from "./pages/Growth";
import Wellness from "./pages/Wellness";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Load maintenance settings
const loadMaintenanceSettings = () => {
  try {
    const modules = import.meta.glob("/src/content/settings/maintenance.json", {
      eager: true,
      import: "default",
    });
    
    for (const path in modules) {
      return modules[path] as {
        enabled: boolean;
        title?: string;
        message?: string;
        estimatedTime?: string;
        contactEmail?: string;
        showProgress?: boolean;
        progressPercent?: number;
      };
    }
  } catch (error) {
    console.error("Error loading maintenance settings:", error);
  }
  return null;
};

const maintenanceSettings = loadMaintenanceSettings();

const AppRoutes = () => {
  const location = useLocation();
  
  // Check if maintenance mode is enabled
  // Allow access to /admin path even during maintenance
  if (maintenanceSettings?.enabled && !location.pathname.startsWith('/admin')) {
    return <MaintenancePage settings={maintenanceSettings} />;
  }
  
  return (
    <ParallaxPaper>
      <PageTransition>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Index />} />
          <Route path="/article/:id" element={<Article />} />
          <Route path="/filsafat" element={<Filsafat />} />
          <Route path="/book-review" element={<BookReview />} />
          <Route path="/creativity" element={<Creativity />} />
          <Route path="/growth" element={<Growth />} />
          <Route path="/wellness" element={<Wellness />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
    </ParallaxPaper>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
