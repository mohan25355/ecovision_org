import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Leaf, Plus, Search, Camera, Filter, ArrowUpDown, Sparkles, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { TopHeader, BottomNav } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAllRecords, PlantRecord } from "@/lib/db";
import { SnapPlantModal } from "@/components/SnapPlantModal";
import { AddPlantModal } from "@/components/AddPlantModal";
import { LOCAL_PLANT_DATABASE } from "@/knowledge/plantDatabase";

const MyPlantsPage = () => {
  const navigate = useNavigate();
  const [plants, setPlants] = useState<PlantRecord[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<'all' | 'healthy' | 'attention' | 'archived'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'health' | 'name'>('recent');
  
  const [isSnapModalOpen, setIsSnapModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    loadPlants();
  }, []);

  const loadPlants = async () => {
    try {
      const records = await getAllRecords<PlantRecord>("plants");
      if (records.length > 0) {
        setPlants(records);
      } else {
        // Populate default digital garden entries for initial user experience
        const defaultGarden: PlantRecord[] = LOCAL_PLANT_DATABASE.slice(0, 3).map((p, index) => ({
          id: `default_plant_${index + 1}`,
          commonName: p.commonName,
          scientificName: p.scientificName,
          nickname: index === 0 ? "Home Peace Lily" : index === 1 ? "Living Room Snake Plant" : "Balcony Monstera",
          family: p.family,
          image: index === 0 
            ? "https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=800" 
            : index === 1 
            ? "https://images.unsplash.com/photo-1572688484438-313a6e50c333?w=800" 
            : "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800",
          location: "Indoor Garden",
          healthScore: p.confidence,
          status: 'Healthy',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          syncStatus: 'synced'
        }));
        setPlants(defaultGarden);
      }
    } catch (e) {
      console.error("Error loading plants", e);
    }
  };

  const filteredPlants = plants
    .filter((p) => {
      const query = search.toLowerCase();
      const matchesSearch = 
        p.commonName.toLowerCase().includes(query) ||
        p.scientificName.toLowerCase().includes(query) ||
        p.nickname.toLowerCase().includes(query) ||
        (p.location && p.location.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      if (filter === 'healthy') return p.healthScore >= 85 && !p.isArchived;
      if (filter === 'attention') return p.healthScore < 85 && !p.isArchived;
      if (filter === 'archived') return !!p.isArchived;
      return !p.isArchived;
    })
    .sort((a, b) => {
      if (sortBy === 'health') return b.healthScore - a.healthScore;
      if (sortBy === 'name') return a.nickname.localeCompare(b.nickname);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const healthyCount = plants.filter((p) => p.healthScore >= 85 && !p.isArchived).length;
  const attentionCount = plants.filter((p) => p.healthScore < 85 && !p.isArchived).length;

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
                <Leaf className="h-6 w-6 text-eco-leaf" />
                My Plants Garden
              </h1>
              <p className="text-xs text-muted-foreground">Personal Digital Plant Collection</p>
            </div>

            <div className="flex gap-2">
              <Button variant="eco" size="sm" onClick={() => setIsSnapModalOpen(true)}>
                <Camera className="h-4 w-4 mr-1.5" /> Snap Plant
              </Button>
              <Button variant="eco-outline" size="sm" onClick={() => setIsAddModalOpen(true)}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
          </div>

          {/* Plant Garden Statistics Overview */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <Card variant="eco" className="p-3">
              <p className="text-[10px] text-muted-foreground font-semibold">TOTAL PLANTS</p>
              <p className="text-xl font-bold">{plants.filter(p => !p.isArchived).length}</p>
            </Card>

            <Card variant="glass" className="p-3">
              <p className="text-[10px] text-muted-foreground font-semibold">HEALTHY</p>
              <p className="text-xl font-bold text-eco-success">{healthyCount}</p>
            </Card>

            <Card variant="glass" className="p-3">
              <p className="text-[10px] text-muted-foreground font-semibold">ATTENTION</p>
              <p className="text-xl font-bold text-amber-500">{attentionCount}</p>
            </Card>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search my plants by name, species, location..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted border border-border/50 focus:outline-none focus:ring-2 focus:ring-eco-leaf/50 text-sm"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center justify-between text-xs overflow-x-auto gap-2 pb-1">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-full font-semibold transition-colors ${filter === 'all' ? "bg-eco-leaf text-white" : "bg-muted text-muted-foreground"}`}
              >
                All Plants ({plants.length})
              </button>
              <button
                onClick={() => setFilter('healthy')}
                className={`px-3 py-1.5 rounded-full font-semibold transition-colors ${filter === 'healthy' ? "bg-eco-success text-white" : "bg-muted text-muted-foreground"}`}
              >
                Healthy ({healthyCount})
              </button>
              <button
                onClick={() => setFilter('attention')}
                className={`px-3 py-1.5 rounded-full font-semibold transition-colors ${filter === 'attention' ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground"}`}
              >
                Attention ({attentionCount})
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-muted text-muted-foreground px-2 py-1 rounded-lg border border-border text-xs focus:outline-none"
            >
              <option value="recent">Sort: Recent</option>
              <option value="health">Sort: Health</option>
              <option value="name">Sort: Name</option>
            </select>
          </div>

          {/* Plant Grid */}
          {filteredPlants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredPlants.map((plant, index) => (
                <motion.div
                  key={plant.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/my-plants/${plant.id}`)}
                  className="cursor-pointer"
                >
                  <Card variant="glass" className="overflow-hidden hover:border-eco-leaf/50 transition-all duration-300">
                    <div className="relative h-40 overflow-hidden">
                      <img src={plant.image} alt={plant.nickname} className="w-full h-full object-cover" />
                      <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-sm text-white">
                        {plant.healthScore} / 100 Health
                      </div>
                    </div>
                    <CardContent className="p-4 space-y-1">
                      <h3 className="font-bold text-base text-foreground">{plant.nickname}</h3>
                      <p className="text-xs font-semibold text-eco-leaf">{plant.commonName}</p>
                      <p className="text-[11px] text-muted-foreground italic">{plant.scientificName}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card variant="glass" className="text-center py-12">
              <CardContent className="space-y-4">
                <div className="inline-flex p-4 rounded-full bg-eco-mint/50">
                  <Leaf className="h-8 w-8 text-eco-leaf" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No plants found</h3>
                  <p className="text-xs text-muted-foreground">Start building your personal digital plant garden</p>
                </div>
                <div className="flex justify-center gap-3">
                  <Button variant="eco" size="sm" onClick={() => setIsSnapModalOpen(true)}>
                    <Camera className="h-4 w-4 mr-1.5" /> Snap Plant
                  </Button>
                  <Button variant="eco-outline" size="sm" onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-1" /> Add Manually
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </main>

      <SnapPlantModal isOpen={isSnapModalOpen} onClose={() => setIsSnapModalOpen(false)} onPlantSaved={loadPlants} />
      <AddPlantModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onPlantAdded={loadPlants} />
      <BottomNav />
    </div>
  );
};

export default MyPlantsPage;
