import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ScanPage from "./pages/ScanPage";
import ResultsPage from "./pages/ResultsPage";
import MyPlantsPage from "./pages/MyPlantsPage";
import PlantDetailPage from "./pages/PlantDetailPage";
import HistoryPage from "./pages/HistoryPage";
import EcoBotPage from "./pages/EcoBotPage";
import RewardsPage from "./pages/RewardsPage";
import SettingsPage from "./pages/SettingsPage";
import DigitalTwinPage from "./pages/DigitalTwinPage";
import EcoSensePage from "./pages/EcoSensePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import EcoCarePage from "./pages/EcoCarePage";
import EcoKnowledgePage from "./pages/EcoKnowledgePage";
import EcoKnowledgeDetailPage from "./pages/EcoKnowledgeDetailPage";
import NotFound from "./pages/NotFound";

import { useEffect } from "react";
import { checkOllamaStatus } from "@/lib/ollama";
import { networkStateEngine } from "@/services/networkState";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Non-blocking background health checks on app startup
    setTimeout(() => {
      networkStateEngine.checkConnectivity();
      checkOllamaStatus();
    }, 100);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/results/:id" element={<ResultsPage />} />
          <Route path="/my-plants" element={<MyPlantsPage />} />
          <Route path="/my-plants/:id" element={<PlantDetailPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/eco-knowledge" element={<EcoKnowledgePage />} />
          <Route path="/eco-knowledge/:id" element={<EcoKnowledgeDetailPage />} />
          <Route path="/ecobot" element={<EcoBotPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/digital-twin" element={<DigitalTwinPage />} />
          <Route path="/ecovision-sense" element={<EcoSensePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/ecocare" element={<EcoCarePage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
