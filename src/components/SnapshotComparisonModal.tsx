import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, TrendingDown, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PlantSnapshot } from "@/lib/db";

interface SnapshotComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  previousSnapshot: PlantSnapshot | null;
  latestSnapshot: PlantSnapshot | null;
  plantName: string;
}

export function SnapshotComparisonModal({
  isOpen,
  onClose,
  previousSnapshot,
  latestSnapshot,
  plantName
}: SnapshotComparisonModalProps) {
  if (!isOpen || !latestSnapshot) return null;

  const prevHealth = previousSnapshot?.healthScore || 80;
  const latestHealth = latestSnapshot.healthScore || 90;
  const healthDiff = latestHealth - prevHealth;

  const prevDate = previousSnapshot ? new Date(previousSnapshot.createdAt).toLocaleDateString() : "Baseline";
  const latestDate = new Date(latestSnapshot.createdAt).toLocaleDateString();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg bg-card rounded-2xl border border-border overflow-hidden shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-eco-leaf" /> Visual Snapshot Comparison
              </h3>
              <p className="text-xs text-muted-foreground">{plantName} — Health Progress Timeline</p>
            </div>
            <button onClick={onClose} className="p-1 rounded-full text-muted-foreground hover:bg-muted">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Health Difference Metric Pill */}
          <div className="p-3 rounded-xl bg-muted flex justify-between items-center text-xs">
            <span className="font-semibold">Observed Health Score Diff:</span>
            <span className={`font-bold flex items-center gap-1 ${healthDiff >= 0 ? "text-eco-success" : "text-destructive"}`}>
              {healthDiff >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {prevHealth} → {latestHealth} ({healthDiff >= 0 ? `+${healthDiff}%` : `${healthDiff}%`})
            </span>
          </div>

          {/* Side-by-Side Comparison */}
          <div className="grid grid-cols-2 gap-3">
            {/* Previous Snapshot */}
            <Card variant="glass" className="overflow-hidden p-2 space-y-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase text-center">Previous ({prevDate})</p>
              {previousSnapshot ? (
                <img src={previousSnapshot.image} alt="Previous Snapshot" className="h-32 w-full object-cover rounded-lg" />
              ) : (
                <div className="h-32 w-full bg-muted rounded-lg flex items-center justify-center text-[10px] text-muted-foreground italic">
                  Initial baseline photo
                </div>
              )}
              <div className="text-[11px] space-y-1">
                <p><span className="font-semibold">Health:</span> {prevHealth}%</p>
                <p><span className="font-semibold">Disease:</span> {previousSnapshot?.disease || "None detected"}</p>
              </div>
            </Card>

            {/* Latest Snapshot */}
            <Card variant="nature" className="overflow-hidden p-2 space-y-2">
              <p className="text-[10px] font-bold text-eco-leaf uppercase text-center">Latest ({latestDate})</p>
              <img src={latestSnapshot.image} alt="Latest Snapshot" className="h-32 w-full object-cover rounded-lg" />
              <div className="text-[11px] space-y-1">
                <p><span className="font-semibold">Health:</span> {latestHealth}%</p>
                <p><span className="font-semibold">Disease:</span> {latestSnapshot.disease || "None detected"}</p>
              </div>
            </Card>
          </div>

          {/* Observed Differences Analysis */}
          <Card variant="glass" className="p-3 space-y-1 text-xs">
            <p className="font-bold text-eco-leaf flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" /> Observed Differences & Trend Notes:
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {healthDiff >= 0 
                ? "Foliage vigor and color saturation show positive recovery. No expansion of foliar leaf spots observed."
                : "Mild leaf tip yellowing observed compared to previous baseline. Verify root moisture level."}
            </p>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
