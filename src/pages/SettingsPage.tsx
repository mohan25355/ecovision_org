import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Cpu, Wifi, RefreshCw, Trash2, CheckCircle2, AlertCircle, Database } from "lucide-react";
import { TopHeader, BottomNav } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { getOllamaConfig, saveOllamaConfig, checkOllamaStatus, OllamaConfig, OllamaStatus } from "@/lib/ollama";
import { syncEngine } from "@/services/syncEngine";
import { toast } from "sonner";

const SettingsPage = () => {
  const netState = useNetworkStatus();
  const [config, setConfig] = useState<OllamaConfig>(getOllamaConfig());
  const [ollamaStatus, setOllamaStatus] = useState<OllamaStatus | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    handleTestConnection();
  }, []);

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const status = await checkOllamaStatus(config.baseUrl);
      setOllamaStatus(status);
      if (status.available) {
        toast.success(`Connected to Ollama! Detected ${status.models.length} model(s)`);
      } else {
        toast.warning(status.error || "Could not connect to local Ollama server");
      }
    } catch (e) {
      toast.error("Failed to check Ollama connection");
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveConfig = () => {
    saveOllamaConfig(config);
    toast.success("Settings saved successfully!");
    handleTestConnection();
  };

  const handleSyncNow = async () => {
    setIsSyncing(true);
    toast.info("Triggering cloud synchronization...");
    await syncEngine.syncPendingData();
    setIsSyncing(false);
    toast.success("Synchronization complete!");
  };

  const handleClearCache = async () => {
    if (confirm("Clear local cache and database stores?")) {
      try {
        indexedDB.deleteDatabase("EcoVisionDB");
        toast.success("Local cache cleared!");
      } catch (e) {
        toast.error("Failed to clear cache");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopHeader />

      <main className="container px-4 py-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-eco-mint/50">
              <Settings className="h-6 w-6 text-eco-leaf" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AI & Local Settings</h1>
              <p className="text-sm text-muted-foreground">Manage offline intelligence & Ollama options</p>
            </div>
          </div>

          {/* System Status Overview */}
          <Card variant="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Wifi className="h-5 w-5 text-eco-leaf" /> System & Network Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Internet Connectivity:</span>
                <span className={`font-semibold flex items-center gap-1.5 ${netState.isOnline ? "text-eco-success" : "text-eco-warning"}`}>
                  <span className={`h-2.5 w-2.5 rounded-full ${netState.isOnline ? "bg-eco-success animate-pulse" : "bg-eco-warning"}`} />
                  {netState.isOnline ? "Online (Cloud Enabled)" : "Offline Mode"}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Local Ollama AI:</span>
                <span className={`font-semibold flex items-center gap-1.5 ${ollamaStatus?.available ? "text-eco-success" : "text-muted-foreground"}`}>
                  <span className={`h-2.5 w-2.5 rounded-full ${ollamaStatus?.available ? "bg-purple-500" : "bg-gray-400"}`} />
                  {ollamaStatus?.available ? "Connected & Active" : "Unavailable"}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Local Plant Database:</span>
                <span className="font-semibold text-eco-leaf flex items-center gap-1">
                  <Database className="h-4 w-4" /> Ready (Offline Knowledge)
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Ollama Local AI Configuration */}
          <Card variant="nature">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Cpu className="h-5 w-5 text-eco-leaf" /> Local Ollama AI Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                  Ollama Base URL
                </label>
                <input
                  type="text"
                  value={config.baseUrl}
                  onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-eco-leaf"
                  placeholder="http://localhost:11434"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                    Ollama Text Model
                  </label>
                  <input
                    type="text"
                    value={config.textModel}
                    onChange={(e) => setConfig({ ...config, textModel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-eco-leaf"
                    placeholder="llama3.2"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                    Ollama Vision Model
                  </label>
                  <input
                    type="text"
                    value={config.visionModel}
                    onChange={(e) => setConfig({ ...config, visionModel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-eco-leaf"
                    placeholder="llava"
                  />
                </div>
              </div>

              {ollamaStatus && (
                <div className={`p-3 rounded-xl text-xs space-y-1 ${ollamaStatus.available ? "bg-purple-500/10 border border-purple-500/20 text-purple-300" : "bg-muted text-muted-foreground"}`}>
                  <p className="font-semibold flex items-center gap-1.5">
                    {ollamaStatus.available ? (
                      <CheckCircle2 className="h-4 w-4 text-purple-400" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                    )}
                    {ollamaStatus.available ? "Ollama Engine Ready" : "Ollama Daemon Disconnected"}
                  </p>
                  {ollamaStatus.available && (
                    <p>
                      Vision Model Status: {ollamaStatus.hasVisionModel ? `Detected (${ollamaStatus.detectedVisionModel})` : "Not installed (Cloud queuing fallback active)"}
                    </p>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2">
                <Button variant="eco" size="sm" onClick={handleSaveConfig}>
                  Save Settings
                </Button>
                <Button variant="eco-outline" size="sm" onClick={handleTestConnection} disabled={isTesting}>
                  {isTesting ? "Testing..." : "Test Connection"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Storage & Sync Management */}
          <Card variant="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-eco-leaf" /> Sync & Offline Storage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground">
                All plant scans, check-ins, and health logs are saved locally first. Pending items are synchronized automatically when internet connectivity returns.
              </p>
              
              <div className="flex flex-wrap gap-3">
                <Button variant="eco" size="sm" onClick={handleSyncNow} disabled={isSyncing}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
                  Sync Data Now
                </Button>
                <Button variant="ghost" size="sm" onClick={handleClearCache} className="text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Local Cache
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
};

export default SettingsPage;
