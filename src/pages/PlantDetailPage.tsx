import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Leaf, ChevronLeft, Camera, Droplets, Sparkles, 
  Bot, Clock, ShieldAlert, Pill, Sprout, Edit3, Heart, CheckCircle2 
} from "lucide-react";
import { TopHeader, BottomNav } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EcoBotChat } from "@/components/EcoBotChat";
import { SnapPlantModal } from "@/components/SnapPlantModal";
import { SnapshotComparisonModal } from "@/components/SnapshotComparisonModal";
import { getRecordById, getAllRecords, saveRecord, PlantRecord, PlantActivity, PlantSnapshot } from "@/lib/db";
import { LOCAL_PLANT_DATABASE, searchLocalKnowledge } from "@/knowledge/plantDatabase";
import { toast } from "sonner";
import { TrendingUp } from "lucide-react";

const PlantDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [plant, setPlant] = useState<PlantRecord | null>(null);
  const [activities, setActivities] = useState<PlantActivity[]>([]);
  const [snapshots, setSnapshots] = useState<PlantSnapshot[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'snapshots' | 'care' | 'ecobot'>('overview');
  const [isSnapOpen, setIsSnapOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");

  useEffect(() => {
    if (id) loadPlantDetails();
  }, [id]);

  const loadPlantDetails = async () => {
    if (!id) return;
    try {
      const record = await getRecordById<PlantRecord>("plants", id);
      if (record) {
        setPlant(record);
        setNicknameInput(record.nickname || record.commonName);
      } else {
        // Fallback default plant if viewing demo id
        const defaultProfile: PlantRecord = {
          id: id,
          commonName: "Peace Lily",
          scientificName: "Spathiphyllum wallisii",
          nickname: "Home Peace Lily",
          family: "Araceae",
          image: "https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=800",
          location: "Living Room",
          notes: "Thrives in bright indirect sunlight. Natural indoor air purifier.",
          healthScore: 92,
          status: "Healthy",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          syncStatus: "synced"
        };
        setPlant(defaultProfile);
        setNicknameInput(defaultProfile.nickname);
      }

      // Load activities & snapshots
      const allActivities = await getAllRecords<PlantActivity>("pending_actions");
      setActivities(allActivities.filter((a) => a.plantId === id || a.plantId === "twin_plant_01"));

      const allSnapshots = await getAllRecords<PlantSnapshot>("plant_scans");
      setSnapshots(allSnapshots.filter((s) => s.plantId === id));
    } catch (e) {
      console.error("Error loading plant details", e);
    }
  };

  const handleUpdateNickname = async () => {
    if (!plant || !nicknameInput.trim()) return;
    const updated = { ...plant, nickname: nicknameInput.trim() };
    await saveRecord("plants", updated);
    setPlant(updated);
    setIsEditingNickname(false);
    toast.success("Nickname updated!");
  };

  const handleLogCare = async (type: 'water' | 'fertilize' | 'prune') => {
    if (!plant) return;
    const titleMap = { water: "Watered Plant", fertilize: "Applied Organic Fertilizer", prune: "Pruned Leaves" };
    const descMap = { water: "Soil thoroughly hydrated", fertilize: "Balanced liquid feed applied", prune: "Removed yellowing outer foliage" };
    
    await saveRecord("pending_actions", {
      plantId: plant.id,
      type: type,
      title: titleMap[type],
      description: descMap[type]
    });

    toast.success(`${titleMap[type]} recorded!`);
    loadPlantDetails();
  };

  if (!plant) return null;

  const knowledge = searchLocalKnowledge(plant.commonName) || LOCAL_PLANT_DATABASE[0];

  return (
    <div className="min-h-screen bg-background">
      <TopHeader />

      <main className="pb-24">
        {/* Hero Image */}
        <div className="relative h-72 overflow-hidden">
          <img src={plant.image} alt={plant.nickname} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

          <Button variant="eco-glass" size="icon" className="absolute top-4 left-4" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>

        <div className="container px-4 -mt-10 relative z-10 space-y-6">
          {/* Header Card */}
          <Card variant="elevated" className="overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    {isEditingNickname ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={nicknameInput}
                          onChange={(e) => setNicknameInput(e.target.value)}
                          className="px-2 py-1 rounded-lg bg-muted border text-sm font-bold"
                        />
                        <Button variant="eco" size="sm" onClick={handleUpdateNickname}>Save</Button>
                      </div>
                    ) : (
                      <>
                        <h1 className="text-2xl font-bold">{plant.nickname}</h1>
                        <button onClick={() => setIsEditingNickname(true)} className="text-muted-foreground hover:text-foreground">
                          <Edit3 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                  <p className="text-sm font-medium text-eco-leaf">{plant.commonName}</p>
                  <p className="text-xs text-muted-foreground italic">{plant.scientificName}</p>
                </div>

                <div className="text-right">
                  <div className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-eco-success/20 text-eco-success">
                    {plant.healthScore} / 100 Health
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{plant.location || "Indoor Garden"}</p>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="grid grid-cols-5 gap-2 pt-2 border-t border-border">
                <button onClick={() => setIsSnapOpen(true)} className="flex flex-col items-center py-2 px-1 rounded-xl bg-muted/60 hover:bg-muted text-xs transition-colors">
                  <Camera className="h-4 w-4 text-eco-leaf mb-1" />
                  <span>Snap</span>
                </button>
                <button onClick={() => handleLogCare('water')} className="flex flex-col items-center py-2 px-1 rounded-xl bg-muted/60 hover:bg-muted text-xs transition-colors">
                  <Droplets className="h-4 w-4 text-eco-sky mb-1" />
                  <span>Water</span>
                </button>
                <button onClick={() => handleLogCare('fertilize')} className="flex flex-col items-center py-2 px-1 rounded-xl bg-muted/60 hover:bg-muted text-xs transition-colors">
                  <Sparkles className="h-4 w-4 text-eco-warning mb-1" />
                  <span>Feed</span>
                </button>
                <button onClick={() => setActiveTab('ecobot')} className="flex flex-col items-center py-2 px-1 rounded-xl bg-muted/60 hover:bg-muted text-xs transition-colors">
                  <Bot className="h-4 w-4 text-purple-400 mb-1" />
                  <span>EcoBot</span>
                </button>
                <button onClick={() => setActiveTab('care')} className="flex flex-col items-center py-2 px-1 rounded-xl bg-muted/60 hover:bg-muted text-xs transition-colors">
                  <Sprout className="h-4 w-4 text-eco-leaf mb-1" />
                  <span>Care</span>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Tabs */}
          <div className="flex border-b border-border overflow-x-auto gap-2 text-sm font-medium">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2 px-3 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'overview' ? "border-eco-leaf text-eco-leaf font-bold" : "border-transparent text-muted-foreground"}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`pb-2 px-3 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'timeline' ? "border-eco-leaf text-eco-leaf font-bold" : "border-transparent text-muted-foreground"}`}
            >
              Activity Timeline
            </button>
            <button
              onClick={() => setActiveTab('snapshots')}
              className={`pb-2 px-3 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'snapshots' ? "border-eco-leaf text-eco-leaf font-bold" : "border-transparent text-muted-foreground"}`}
            >
              Snapshots
            </button>
            <button
              onClick={() => setActiveTab('care')}
              className={`pb-2 px-3 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'care' ? "border-eco-leaf text-eco-leaf font-bold" : "border-transparent text-muted-foreground"}`}
            >
              Care & Treatments
            </button>
            <button
              onClick={() => setActiveTab('ecobot')}
              className={`pb-2 px-3 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'ecobot' ? "border-eco-leaf text-eco-leaf font-bold" : "border-transparent text-muted-foreground"}`}
            >
              EcoBot AI
            </button>
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-xs">
              <Card variant="glass" className="p-4 space-y-2">
                <h3 className="font-bold text-sm text-foreground">Botanical Description</h3>
                <p className="text-muted-foreground leading-relaxed">{knowledge.description}</p>
              </Card>

              <div className="grid grid-cols-2 gap-3">
                <Card variant="nature" className="p-3 space-y-1">
                  <p className="text-muted-foreground">Watering Needs</p>
                  <p className="font-bold text-sm text-eco-sky">{knowledge.habitat.water}</p>
                </Card>
                <Card variant="nature" className="p-3 space-y-1">
                  <p className="text-muted-foreground">Sunlight Requirements</p>
                  <p className="font-bold text-sm text-eco-warning">{knowledge.habitat.light}</p>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Tab 2: Activity Timeline */}
          {activeTab === 'timeline' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 text-xs">
              {activities.length > 0 ? (
                activities.map((act) => (
                  <Card key={act.id} variant="glass" className="p-3 space-y-1">
                    <div className="flex justify-between items-center font-semibold text-foreground">
                      <span>{act.title}</span>
                      <span className="text-[10px] text-muted-foreground">{new Date(act.createdAt).toLocaleString()}</span>
                    </div>
                    {act.description && <p className="text-muted-foreground">{act.description}</p>}
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground italic text-center py-6">No care activities recorded yet.</p>
              )}
            </motion.div>
          )}

          {/* Tab 3: Snapshots Gallery */}
          {activeTab === 'snapshots' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              {snapshots.length > 0 ? (
                <div className="space-y-3">
                  {snapshots.length >= 2 && (
                    <div className="flex justify-end">
                      <Button variant="eco-outline" size="sm" onClick={() => setIsCompareOpen(true)}>
                        <TrendingUp className="h-4 w-4 mr-1.5" /> Compare Baseline vs Latest
                      </Button>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    {snapshots.map((snap) => (
                      <Card key={snap.id} variant="glass" className="overflow-hidden">
                        <img src={snap.image} alt="Plant snapshot" className="h-32 w-full object-cover" />
                        <div className="p-2 text-xs">
                          <p className="font-bold">{snap.scanResult?.commonName || plant.commonName}</p>
                          <p className="text-[10px] text-muted-foreground">{new Date(snap.createdAt).toLocaleDateString()}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 space-y-2">
                  <p className="text-xs text-muted-foreground">No snapshots taken yet.</p>
                  <Button variant="eco" size="sm" onClick={() => setIsSnapOpen(true)}>
                    <Camera className="h-4 w-4 mr-2" /> Take First Snapshot
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {/* Tab 4: Care & Treatments */}
          {activeTab === 'care' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-xs">
              <Card variant="glass" className="p-4 space-y-3">
                <h3 className="font-bold text-sm flex items-center gap-1.5 text-blue-400">
                  <Pill className="h-4 w-4" /> Chemical Treatment Rules
                </h3>
                <p className="text-muted-foreground">Apply broad spectrum fungicides only according to registered product label. Wear protective gloves & eye protection.</p>
                <p className="text-[10px] text-muted-foreground italic">Disclaimer: Follow local agricultural regulations.</p>
              </Card>

              <Card variant="glass" className="p-4 space-y-3">
                <h3 className="font-bold text-sm flex items-center gap-1.5 text-eco-leaf">
                  <Sprout className="h-4 w-4" /> Natural Biological Control
                </h3>
                <p className="text-muted-foreground">Isolate plant, spray cold-pressed neem oil (1 tsp per L water), increase air ventilation, wipe leaves monthly.</p>
              </Card>
            </motion.div>
          )}

          {/* Tab 5: EcoBot AI */}
          {activeTab === 'ecobot' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <EcoBotChat 
                plantName={plant.nickname} 
                plantContext={{ commonName: plant.commonName, scientificName: plant.scientificName }} 
              />
            </motion.div>
          )}
        </div>
      </main>

      <SnapPlantModal isOpen={isSnapOpen} onClose={() => setIsSnapOpen(false)} targetPlantId={plant.id} onPlantSaved={loadPlantDetails} />
      <SnapshotComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        previousSnapshot={snapshots[1] || null}
        latestSnapshot={snapshots[0] || null}
        plantName={plant.nickname}
      />
      <BottomNav />
    </div>
  );
};

export default PlantDetailPage;
