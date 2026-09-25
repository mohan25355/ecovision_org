import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Radio, Thermometer, Droplets, Sun, Activity, Wifi, ShieldAlert } from "lucide-react";
import { TopHeader, BottomNav } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

interface SensorData {
  temperature: number;
  humidity: number;
  moisture: number;
  lightLux: number;
  lastSynced: string;
}

const EcoSensePage = () => {
  const netState = useNetworkStatus();
  const [telemetry, setTelemetry] = useState<SensorData>({
    temperature: 28.4,
    humidity: 72,
    moisture: 61,
    lightLux: 4500,
    lastSynced: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  useEffect(() => {
    // If online, simulate live telemetry stream updates
    if (netState.isOnline) {
      const interval = setInterval(() => {
        setTelemetry({
          temperature: +(27.5 + Math.random() * 2).toFixed(1),
          humidity: Math.floor(70 + Math.random() * 5),
          moisture: Math.floor(58 + Math.random() * 6),
          lightLux: Math.floor(4200 + Math.random() * 500),
          lastSynced: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [netState.isOnline]);

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
                <Radio className="h-6 w-6 text-eco-leaf" />
                EcoVision Sense IoT
              </h1>
              <p className="text-sm text-muted-foreground">ESP32 Sensor Telemetry Hub</p>
            </div>

            <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${netState.isOnline ? "bg-eco-mint/50 text-eco-leaf" : "bg-amber-500/20 text-amber-500"}`}>
              <span className={`h-2 w-2 rounded-full ${netState.isOnline ? "bg-eco-leaf animate-pulse" : "bg-amber-500"}`} />
              {netState.isOnline ? "Live Telemetry" : `Last synced: ${telemetry.lastSynced}`}
            </div>
          </div>

          {/* Telemetry Notice */}
          {!netState.isOnline && (
            <Card variant="glass" className="border-amber-500/30">
              <CardContent className="p-4 flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-foreground">Cached Sensor Telemetry</p>
                  <p className="text-muted-foreground">Displaying last synchronized reading from ESP32 node. Live telemetry streaming will resume automatically when internet returns.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sensor Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card variant="nature">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-medium">Ambient Temp</span>
                  <Thermometer className="h-4 w-4 text-eco-warning" />
                </div>
                <p className="text-2xl font-bold">{telemetry.temperature}°C</p>
                <p className="text-[10px] text-eco-success">Optimal range (20-30°C)</p>
              </CardContent>
            </Card>

            <Card variant="nature">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-medium">Humidity</span>
                  <Droplets className="h-4 w-4 text-eco-sky" />
                </div>
                <p className="text-2xl font-bold">{telemetry.humidity}%</p>
                <p className="text-[10px] text-eco-success">Ideal humidity level</p>
              </CardContent>
            </Card>

            <Card variant="nature">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-medium">Soil Moisture</span>
                  <Activity className="h-4 w-4 text-eco-leaf" />
                </div>
                <p className="text-2xl font-bold">{telemetry.moisture}%</p>
                <p className="text-[10px] text-eco-success">Sufficient soil hydration</p>
              </CardContent>
            </Card>

            <Card variant="nature">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-medium">Sunlight Intensity</span>
                  <Sun className="h-4 w-4 text-amber-400" />
                </div>
                <p className="text-2xl font-bold">{telemetry.lightLux} Lux</p>
                <p className="text-[10px] text-eco-success">Indirect bright exposure</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
};

export default EcoSensePage;
