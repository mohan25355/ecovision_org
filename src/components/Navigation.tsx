import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, ScanLine, BookOpen, History, Bot, Settings, RefreshCw, Cpu, Radio, BarChart3, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

const navItems = [
  { path: "/", icon: Leaf, label: "Home" },
  { path: "/scan", icon: ScanLine, label: "Scan" },
  { path: "/my-plants", icon: BookOpen, label: "My Plants" },
  { path: "/history", icon: History, label: "History" },
  { path: "/ecobot", icon: Bot, label: "EcoBot" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-t border-border/50 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center py-2 px-4 rounded-xl transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-eco-mint/50 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon
                className={cn(
                  "h-5 w-5 relative z-10 transition-colors",
                  isActive ? "text-eco-leaf" : "text-muted-foreground"
                )}
              />
              <span
                className={cn(
                  "text-xs mt-1 relative z-10 transition-colors",
                  isActive ? "text-eco-leaf font-medium" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function TopHeader() {
  const netState = useNetworkStatus();

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-eco-mint/50">
            <Leaf className="h-6 w-6 text-eco-leaf" />
          </div>
          <span className="text-xl font-bold text-eco-gradient">EcoVision</span>
        </Link>
        
        <div className="flex items-center gap-3">
          {/* Network Status Indicator */}
          <Link to="/settings" className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted/80 hover:bg-muted border border-border/50 transition-colors">
            {netState.isSyncing ? (
              <>
                <RefreshCw className="h-3 w-3 text-eco-leaf animate-spin" />
                <span className="text-eco-leaf font-semibold">🔄 Syncing...</span>
              </>
            ) : netState.status === 'LOCAL_AI' || netState.isLocalAiAvailable ? (
              <>
                <Cpu className="h-3 w-3 text-purple-400" />
                <span className="text-purple-400 font-semibold">🟣 Local AI</span>
              </>
            ) : netState.isOnline ? (
              <>
                <span className="h-2 w-2 rounded-full bg-eco-success animate-pulse" />
                <span className="text-eco-success font-semibold">🟢 Online</span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-amber-500 font-semibold">🟠 Offline Mode</span>
              </>
            )}
          </Link>

          <Link to="/settings" className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
            <Settings className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

