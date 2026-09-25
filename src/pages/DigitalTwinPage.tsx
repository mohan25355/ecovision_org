import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cpu, Heart, Droplets, Sparkles, Plus, Clock, CheckCircle, ShieldCheck } from "lucide-react";
import { TopHeader, BottomNav } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { saveRecord, getAllRecords, CheckInRecord } from "@/lib/db";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { toast } from "sonner";

const DigitalTwinPage = () => {
  const netState = useNetworkStatus();
  const [checkIns, setCheckIns] = useState<CheckInRecord[]>([]);
  const [notes, setNotes] = useState("");
  const [watered, setWatered] = useState(false);
  const [fertilized, setFertilized] = useState(false);
  const [pruned, setPruned] = useState(false);
  const [healthStatus, setHealthStatus] = useState<'healthy' | 'warning' | 'critical'>('healthy');

  useEffect(() => {
    loadCheckIns();
  }, []);

  const loadCheckIns = async () => {
    try {
      const records = await getAllRecords<CheckInRecord>("check_ins");
      setCheckIns(records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (e) {
      console.error("Error loading checkins", e);
    }
  };

  const handleAddCheckIn = async () => {
    try {
      const syncStatus = netState.isOnline ? 'synced' : 'pending';
      const record = await saveRecord("check_ins", {
        plantId: "twin_plant_01",
        plantName: "Peace Lily (Indoor Digital Twin)",
        notes,
        watered,
        fertilized,
        pruned,
        healthStatus,
        syncStatus
      });

      toast.success(netState.isOnline ? "Check-in logged & synced!" : "Check-in saved locally (Pending Sync)");
      setNotes("");
      setWatered(false);
      setFertilized(false);
      setPruned(false);
      loadCheckIns();
    } catch (e) {
      toast.error("Failed to save check-in");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopHeader />

      <main className="container px-4 py-6 pb-24 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Cpu className="h-6 w-6 text-eco-leaf" />
                Digital Plant Twin
              </h1>
              <p className="text-sm text-muted-foreground">Real-time health monitoring & care logging</p>
            </div>

            <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${netState.isOnline ? "bg-eco-mint/50 text-eco-leaf" : "bg-amber-500/20 text-amber-500"}`}>
              <span className={`h-2 w-2 rounded-full ${netState.isOnline ? "bg-eco-leaf animate-pulse" : "bg-amber-500"}`} />
              {netState.isOnline ? "Live Cloud Sync" : "Offline Mode"}
            </div>
          </div>

          {/* Plant Twin Health Status Header */}
          <Card variant="eco" className="overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold">Peace Lily Twin #01</h2>
                  <p className="text-sm text-muted-foreground italic">Spathiphyllum wallisii</p>
                </div>
                <div className="p-3 rounded-xl bg-eco-mint/60">
                  <Heart className="h-6 w-6 text-eco-leaf" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-card/80 border border-border">
                  <p className="text-xs text-muted-foreground">Overall Health</p>
                  <p className="text-sm font-bold text-eco-success">96% Optimal</p>
                </div>
                <div className="p-3 rounded-xl bg-card/80 border border-border">
                  <p className="text-xs text-muted-foreground">Hydration</p>
                  <p className="text-sm font-bold text-eco-sky">Good (Moist)</p>
                </div>
                <div className="p-3 rounded-xl bg-card/80 border border-border">
                  <p className="text-xs text-muted-foreground">Sunlight</p>
                  <p className="text-sm font-bold text-eco-warning">Indirect High</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Log Care Check-In Form */}
          <Card variant="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Plus className="h-5 w-5 text-eco-leaf" /> Log Care Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setWatered(!watered)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${watered ? "bg-eco-sky text-white" : "bg-muted text-muted-foreground"}`}
                >
                  <Droplets className="h-4 w-4" /> Watered
                </button>

                <button
                  type="button"
                  onClick={() => setFertilized(!fertilized)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${fertilized ? "bg-eco-leaf text-white" : "bg-muted text-muted-foreground"}`}
                >
                  <Sparkles className="h-4 w-4" /> Fertilized
                </button>

                <button
                  type="button"
                  onClick={() => setPruned(!pruned)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${pruned ? "bg-amber-600 text-white" : "bg-muted text-muted-foreground"}`}
                >
                  <Cpu className="h-4 w-4" /> Pruned Leaves
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Health Observation & Care Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record growth progress, leaf yellowing, soil moisture, etc..."
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-eco-leaf h-20"
                />
              </div>

              <Button variant="eco" size="sm" onClick={handleAddCheckIn}>
                Save Check-In Record
              </Button>
            </CardContent>
          </Card>

          {/* History of Check-ins */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-eco-leaf" /> Digital Twin Activity Logs
            </h3>

            {checkIns.length > 0 ? (
              checkIns.map((log) => (
                <Card key={log.id} variant="glass" className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm">{log.plantName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${log.syncStatus === 'synced' ? "bg-eco-success/20 text-eco-success" : "bg-amber-500/20 text-amber-500"}`}>
                      {log.syncStatus === 'synced' ? "Synced" : "Pending Sync"}
                    </span>
                  </div>

                  <div className="flex gap-2 text-xs">
                    {log.watered && <span className="px-2 py-0.5 rounded-md bg-eco-sky/20 text-eco-sky font-medium">💧 Watered</span>}
                    {log.fertilized && <span className="px-2 py-0.5 rounded-md bg-eco-leaf/20 text-eco-leaf font-medium">✨ Fertilized</span>}
                    {log.pruned && <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-500 font-medium">✂ Pruned</span>}
                  </div>

                  {log.notes && <p className="text-xs text-foreground bg-muted p-2 rounded-lg">{log.notes}</p>}
                </Card>
              ))
            ) : (
              <p className="text-xs text-muted-foreground italic text-center py-6">
                No care activities logged yet. Create your first Digital Twin check-in above!
              </p>
            )}
          </div>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
};

export default DigitalTwinPage;
