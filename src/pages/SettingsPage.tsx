import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Settings, Cpu, Wifi, RefreshCw, Trash2, CheckCircle2, 
  AlertCircle, Database, ShieldCheck, HardDrive, Download, Upload 
} from "lucide-react";
import { TopHeader, BottomNav } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { getOllamaConfig, saveOllamaConfig, checkOllamaStatus, OllamaConfig, OllamaStatus } from "@/lib/ollama";
import { syncEngine } from "@/services/syncEngine";
import { getAllRecords, getPendingRecords, saveRecord } from "@/lib/db";
import { PRESEEDED_BOTANICAL_KNOWLEDGE } from "@/services/ecoKnowledgeEngine";
import { toast } from "sonner";

const SettingsPage = () => {
  const netState = useNetworkStatus();
  const [config, setConfig] = useState<OllamaConfig>(getOllamaConfig());
  const [ollamaStatus, setOllamaStatus] = useState<OllamaStatus | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const [cachedPlantsCount, setCachedPlantsCount] = useState(PRESEEDED_BOTANICAL_KNOWLEDGE.length);
  const [pendingActionsCount, setPendingActionsCount] = useState(0);
  const [storageEstimate, setStorageEstimate] = useState<string>("Calculating...");

  useEffect(() => {
    handleTestConnection();
    loadOfflineStats();
  }, []);

  const loadOfflineStats = async () => {
    try {
      const dbKnowledge = await getAllRecords("plant_knowledge");
      const totalKnowledge = new Set([...PRESEEDED_BOTANICAL_KNOWLEDGE.map(p => p.id), ...dbKnowledge.map(p => p.id)]).size;
      setCachedPlantsCount(totalKnowledge);

      const pending = await getPendingRecords("pending_actions");
      setPendingActionsCount(pending.length);

      if (navigator.storage && navigator.storage.estimate) {
        const est = await navigator.storage.estimate();
        if (est.usage) {
          const mb = (est.usage / (1024 * 1024)).toFixed(1);
          setStorageEstimate(`${mb} MB Used`);
        } else {
          setStorageEstimate("IndexedDB Active");
        }
      } else {
        setStorageEstimate("IndexedDB Storage Active");
      }
    } catch (err) {
      console.warn("Stats load error:", err);
    }
  };

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
    toast.success("Ollama configuration saved successfully!");
    handleTestConnection();
  };

  const handleSyncNow = async () => {
    setIsSyncing(true);
    toast.info("Triggering cloud synchronization...");
    await syncEngine.syncPendingData();
    await loadOfflineStats();
    setIsSyncing(false);
    toast.success("Synchronization complete!");
  };

  const handleExportData = async () => {
    try {
      toast.info("Preparing ECOVISION JSON export package...");
      const plants = await getAllRecords("plants");
      const scans = await getAllRecords("plant_scans");
      const snapshots = await getAllRecords("snapshots");
      const learning = await getAllRecords("learning_records");
      const care = await getAllRecords("care_records");
      const treatments = await getAllRecords("treatment_records");
      const checkIns = await getAllRecords("check_ins");

      const exportPayload = {
        app: "ECOVISION AI",
        version: "2.0.0",
        exportedAt: new Date().toISOString(),
        data: {
          plants,
          scans,
          snapshots,
          learning,
          care,
          treatments,
          checkIns
        }
      };

      const jsonStr = JSON.stringify(exportPayload, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `ecovision_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Data export downloaded successfully!");
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Failed to export local data");
    }
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!json.data) throw new Error("Invalid ECOVISION backup file structure");

        const { plants = [], scans = [], learning = [], care = [] } = json.data;

        for (const p of plants) await saveRecord("plants", p);
        for (const s of scans) await saveRecord("plant_scans", s);
        for (const l of learning) await saveRecord("learning_records", l);
        for (const c of care) await saveRecord("care_records", c);

        toast.success(`Imported ${plants.length} plant(s) & records successfully!`);
        loadOfflineStats();
      } catch (err: any) {
        toast.error("Failed to import file: " + (err.message || "Invalid JSON"));
      }
    };
    reader.readAsText(file);
  };

  const handleClearCache = async () => {
    if (confirm("Clear temporary cache and IndexedDB tables? (Export backup first to preserve user records)")) {
      try {
        indexedDB.deleteDatabase("EcoVisionDB");
        toast.success("Local cache cleared!");
        loadOfflineStats();
      } catch (e) {
        toast.error("Failed to clear cache");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopHeader />

      <main className="container px-4 py-6 pb-28 space-y-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-eco-mint/50">
                <Settings className="h-6 w-6 text-eco-leaf" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">System Diagnostics & Settings</h1>
                <p className="text-sm text-muted-foreground">Manage local intelligence, IndexedDB & Ollama models</p>
              </div>
            </div>

            <Badge className="bg-emerald-600 text-white text-xs px-3 py-1 flex items-center gap-1.5 shadow-sm">
              <ShieldCheck className="h-4 w-4" />
              Offline-First Engine Active
            </Badge>
          </div>

          {/* Connection Status Overview (Part 24) */}
          <Card variant="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Wifi className="h-5 w-5 text-eco-leaf" /> Connection & AI Engine Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Cloud Connectivity:</span>
                <span className={`font-semibold flex items-center gap-1.5 ${netState.isOnline ? "text-eco-success" : "text-amber-500"}`}>
                  <span className={`h-2.5 w-2.5 rounded-full ${netState.isOnline ? "bg-eco-success animate-pulse" : "bg-amber-500"}`} />
                  {netState.isOnline ? "Cloud Connected" : "Offline"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Local AI Server:</span>
                <span className={`font-semibold flex items-center gap-1.5 ${ollamaStatus?.available ? "text-purple-400" : "text-muted-foreground"}`}>
                  <span className={`h-2.5 w-2.5 rounded-full ${ollamaStatus?.available ? "bg-purple-500" : "bg-gray-400"}`} />
                  {ollamaStatus?.available ? "Connected" : "Disconnected"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Local Text Model:</span>
                <span className="font-semibold text-foreground">
                  {ollamaStatus?.available ? (ollamaStatus.detectedTextModel || config.textModel) : "None (Offline Knowledge Fallback)"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Local Vision Model:</span>
                <span className="font-semibold text-foreground">
                  {ollamaStatus?.available && ollamaStatus.hasVisionModel 
                    ? ollamaStatus.detectedVisionModel 
                    : "Vision model unavailable"}
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-border/50 pt-2.5">
                <span className="text-muted-foreground">Cached Species Knowledge:</span>
                <span className="font-semibold text-eco-leaf flex items-center gap-1">
                  <Database className="h-4 w-4" /> {cachedPlantsCount} Botanical Species
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Pending Sync Items:</span>
                <span className={`font-semibold ${pendingActionsCount > 0 ? "text-amber-500" : "text-foreground"}`}>
                  {pendingActionsCount} Queued
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">IndexedDB Storage:</span>
                <span className="font-semibold text-foreground flex items-center gap-1">
                  <HardDrive className="h-4 w-4 text-muted-foreground" /> {storageEstimate}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Ollama Local AI Configuration */}
          <Card variant="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Cpu className="h-5 w-5 text-eco-leaf" /> Local Ollama Engine Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                  Ollama Server Endpoint
                </label>
                <input
                  type="text"
                  value={config.baseUrl}
                  onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-eco-leaf"
                  placeholder="http://localhost:11434"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                    Text Model Name
                  </label>
                  <input
                    type="text"
                    value={config.textModel}
                    onChange={(e) => setConfig({ ...config, textModel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-eco-leaf"
                    placeholder="llama3.2"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                    Vision Model Name
                  </label>
                  <input
                    type="text"
                    value={config.visionModel}
                    onChange={(e) => setConfig({ ...config, visionModel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-eco-leaf"
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
                    {ollamaStatus.available ? "Ollama Daemon Active" : "Ollama Server Disconnected"}
                  </p>
                  {ollamaStatus.available && (
                    <p>
                      Vision Status: {ollamaStatus.hasVisionModel ? `Detected (${ollamaStatus.detectedVisionModel})` : "Vision model unavailable (Scan queuing active)"}
                    </p>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-1">
                <Button className="bg-eco-leaf text-white hover:bg-eco-leaf/90 rounded-xl text-xs" size="sm" onClick={handleSaveConfig}>
                  Save Configuration
                </Button>
                <Button variant="outline" className="rounded-xl text-xs" size="sm" onClick={handleTestConnection} disabled={isTesting}>
                  {isTesting ? "Testing..." : "Test Ollama Connection"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Local Data Backup & Restore (Part 25) */}
          <Card variant="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Download className="h-5 w-5 text-eco-leaf" /> Data Protection: Backup & Restore
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Export your personal digital garden, plant snapshots, history, and learning progress to a JSON backup file to protect against browser storage loss.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button className="bg-eco-leaf text-white hover:bg-eco-leaf/90 rounded-xl text-xs" size="sm" onClick={handleExportData}>
                  <Download className="h-4 w-4 mr-2" /> Export My ECOVISION Data
                </Button>

                <label className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground border border-border/60 text-xs font-semibold cursor-pointer transition-colors">
                  <Upload className="h-4 w-4 mr-2 text-eco-leaf" />
                  Restore / Import Data
                  <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Sync & Storage Management */}
          <Card variant="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-eco-leaf" /> Sync & Cache Operations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Local changes are saved to IndexedDB first. Pending queue synchronizes automatically when cloud connectivity returns.
              </p>
              
              <div className="flex flex-wrap gap-3">
                <Button className="bg-eco-leaf text-white hover:bg-eco-leaf/90 rounded-xl text-xs" size="sm" onClick={handleSyncNow} disabled={isSyncing}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
                  Sync Pending Now
                </Button>

                <Button variant="ghost" size="sm" onClick={handleClearCache} className="text-destructive hover:bg-destructive/10 text-xs rounded-xl">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear IndexedDB Cache
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
