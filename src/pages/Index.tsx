import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  Camera, Leaf, Sparkles, Bot, BookOpen, ArrowRight, 
  ScanLine, Shield, Zap, Plus, BookMarked, Activity, CheckCircle2, AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TopHeader, BottomNav } from "@/components/Navigation";
import { getAllRecords, getPendingRecords, PlantRecord, PlantActivity } from "@/lib/db";
import { PRESEEDED_BOTANICAL_KNOWLEDGE } from "@/services/ecoKnowledgeEngine";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

const Index = () => {
  const navigate = useNavigate();
  const netState = useNetworkStatus();

  const [plants, setPlants] = useState<PlantRecord[]>([]);
  const [recentActivities, setRecentActivities] = useState<PlantActivity[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [speciesCount, setSpeciesCount] = useState(PRESEEDED_BOTANICAL_KNOWLEDGE.length);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const userPlants = await getAllRecords<PlantRecord>("plants");
      setPlants(userPlants.filter(p => !p.isArchived));

      const activities = await getAllRecords<PlantActivity>("pending_actions");
      setRecentActivities(activities.slice(-4).reverse());

      const pending = await getPendingRecords("pending_actions");
      setPendingCount(pending.length);

      const dbKnowledge = await getAllRecords("plant_knowledge");
      const totalCount = new Set([...PRESEEDED_BOTANICAL_KNOWLEDGE.map(p => p.id), ...dbKnowledge.map(p => p.id)]).size;
      setSpeciesCount(totalCount);
    } catch (err) {
      console.warn("Dashboard load error:", err);
    }
  };

  const healthyCount = plants.filter(p => p.healthScore >= 85).length;
  const attentionCount = plants.filter(p => p.healthScore < 85).length;
  const averageHealth = plants.length > 0 
    ? Math.round(plants.reduce((acc, p) => acc + (p.healthScore || 90), 0) / plants.length)
    : 94;

  const randomSpotlightSpecies = PRESEEDED_BOTANICAL_KNOWLEDGE[0];

  return (
    <div className="min-h-screen bg-background">
      <TopHeader />
      
      <main className="pb-28 max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Dynamic Hero Section (Part 19) */}
        <section className="relative overflow-hidden rounded-3xl bg-card border border-border/50 p-6 md:p-8 shadow-sm">
          <div className="leaf-pattern absolute inset-0 opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-br from-eco-mint/40 via-transparent to-background/50" />
          
          <div className="relative space-y-4">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-eco-mint/60 text-eco-leaf text-xs font-bold">
                <Leaf className="h-3.5 w-3.5" />
                <span>ECOVISION AI PLATFORM</span>
              </div>

              <div className="text-xs font-semibold text-muted-foreground">
                {netState.isOnline ? "● Cloud Active" : "● Offline Local Mode"}
              </div>
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Good day, <span className="text-eco-gradient">Plant Guardian</span>
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                Your personal digital garden & botanical intelligence platform is ready.
              </p>
            </div>

            {/* Garden Health Overview Stats */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-background/80 border border-border/50 text-center">
                <p className="text-[10px] font-bold text-muted-foreground">GARDEN HEALTH</p>
                <p className="text-xl font-extrabold text-eco-success">{averageHealth}%</p>
              </div>

              <div className="p-3 rounded-2xl bg-background/80 border border-border/50 text-center">
                <p className="text-[10px] font-bold text-muted-foreground">TOTAL PLANTS</p>
                <p className="text-xl font-extrabold text-foreground">{plants.length}</p>
              </div>

              <div className="p-3 rounded-2xl bg-background/80 border border-border/50 text-center">
                <p className="text-[10px] font-bold text-muted-foreground">NEEDS ATTENTION</p>
                <p className={`text-xl font-extrabold ${attentionCount > 0 ? "text-amber-500" : "text-muted-foreground"}`}>
                  {attentionCount}
                </p>
              </div>
            </div>

            {/* Hero CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/scan">
                <Button variant="eco" size="lg" className="rounded-xl shadow-md">
                  <Camera className="h-4 w-4 mr-2" />
                  📸 Scan a Plant
                </Button>
              </Link>
              <Link to="/my-plants">
                <Button variant="eco-outline" size="lg" className="rounded-xl">
                  <Plus className="h-4 w-4 mr-1.5" />
                  + Add Plant
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Knowledge Spotlight Card */}
        <section>
          <Card variant="glass" className="overflow-hidden hover:border-eco-leaf/50 transition-all">
            <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-eco-mint/50">
                  <BookMarked className="h-6 w-6 text-eco-leaf" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-foreground">Learn Something New</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold">Botanical Knowledge</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Explore {speciesCount}+ cached species: {randomSpotlightSpecies?.commonNames[0]} (*{randomSpotlightSpecies?.scientificName}*)
                  </p>
                </div>
              </div>

              <Link to="/eco-knowledge">
                <Button variant="eco-glass" size="sm" className="rounded-xl text-xs whitespace-nowrap">
                  Explore Knowledge <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>

        {/* Personal Digital Garden Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-eco-leaf" /> My Digital Garden
            </h2>
            <Link to="/my-plants" className="text-xs text-eco-leaf font-semibold hover:underline">
              View All ({plants.length}) →
            </Link>
          </div>

          {plants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {plants.slice(0, 3).map((plant) => (
                <Card 
                  key={plant.id} 
                  variant="glass" 
                  onClick={() => navigate(`/my-plants/${plant.id}`)}
                  className="cursor-pointer overflow-hidden hover:border-eco-leaf/50 transition-all"
                >
                  <div className="h-32 relative overflow-hidden">
                    <img src={plant.image} alt={plant.nickname} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-sm">
                      {plant.healthScore}%
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <h4 className="font-bold text-sm text-foreground truncate">{plant.nickname}</h4>
                    <p className="text-xs text-eco-leaf">{plant.commonName}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card variant="glass" className="text-center py-8">
              <CardContent className="space-y-3">
                <p className="text-sm font-semibold">Your garden is waiting.</p>
                <p className="text-xs text-muted-foreground">Add your first plant to start monitoring growth and care history.</p>
                <Link to="/my-plants">
                  <Button variant="eco" size="sm" className="rounded-xl text-xs">
                    Add Your First Plant
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Feature Tools Grid */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link to="/scan">
            <Card variant="nature" className="p-4 nature-card h-full">
              <ScanLine className="h-5 w-5 text-eco-leaf mb-2" />
              <h3 className="font-bold text-xs text-foreground">AI Leaf Scan</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">Instant disease diagnosis</p>
            </Card>
          </Link>

          <Link to="/ecobot">
            <Card variant="nature" className="p-4 nature-card h-full">
              <Bot className="h-5 w-5 text-purple-400 mb-2" />
              <h3 className="font-bold text-xs text-foreground">EcoBot AI</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">Offline assistant</p>
            </Card>
          </Link>

          <Link to="/digital-twin">
            <Card variant="nature" className="p-4 nature-card h-full">
              <Activity className="h-5 w-5 text-blue-400 mb-2" />
              <h3 className="font-bold text-xs text-foreground">Digital Twin</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">Plant life simulation</p>
            </Card>
          </Link>

          <Link to="/analytics">
            <Card variant="nature" className="p-4 nature-card h-full">
              <Zap className="h-5 w-5 text-amber-400 mb-2" />
              <h3 className="font-bold text-xs text-foreground">Analytics</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">Garden metrics</p>
            </Card>
          </Link>
        </section>

        {/* Recent Activity Feed */}
        {recentActivities.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-muted-foreground">Recent Care Activity</h2>
            <div className="space-y-2">
              {recentActivities.map((act) => (
                <Card key={act.id} variant="glass" className="p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-eco-success flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">{act.title}</p>
                      {act.description && <p className="text-[11px] text-muted-foreground">{act.description}</p>}
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{new Date(act.createdAt).toLocaleDateString()}</span>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Index;
