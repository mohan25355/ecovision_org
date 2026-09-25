import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Calendar, ShieldCheck } from "lucide-react";
import { TopHeader, BottomNav } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

const AnalyticsPage = () => {
  const netState = useNetworkStatus();

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
                <BarChart3 className="h-6 w-6 text-eco-leaf" />
                Plant Analytics
              </h1>
              <p className="text-sm text-muted-foreground">Historical growth & health trends</p>
            </div>

            <div className="px-3 py-1 rounded-full text-xs font-semibold bg-eco-mint/50 text-eco-leaf flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              {netState.isOnline ? "Live Analytics" : "Cached Analytics"}
            </div>
          </div>

          {/* Analytics Summary */}
          <Card variant="eco">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-muted-foreground">Total Plant Scans</p>
                  <p className="text-3xl font-bold">24</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Average Confidence</p>
                  <p className="text-3xl font-bold text-eco-success">94.2%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-eco-leaf" /> Monthly Identification Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Indoor Foliage</span>
                  <span className="font-bold">65%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-eco-leaf w-[65%]" />
                </div>

                <div className="flex justify-between pt-2">
                  <span>Medicinal Herbs (Tulsi, Neem)</span>
                  <span className="font-bold">25%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-eco-sky w-[25%]" />
                </div>

                <div className="flex justify-between pt-2">
                  <span>Succulents</span>
                  <span className="font-bold">10%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[10%]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
};

export default AnalyticsPage;
