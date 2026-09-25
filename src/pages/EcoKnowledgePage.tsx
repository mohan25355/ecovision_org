import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  BookMarked, 
  Search, 
  Sparkles, 
  Leaf, 
  Globe2, 
  Database, 
  ArrowRight, 
  BookOpen, 
  Bot, 
  CheckCircle2, 
  Info,
  ShieldCheck,
  WifiOff,
  Plus
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { TopHeader, BottomNav } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { 
  searchEcoKnowledgeEngine, 
  PRESEEDED_BOTANICAL_KNOWLEDGE 
} from "@/services/ecoKnowledgeEngine";
import { BotanicalKnowledgeRecord } from "@/services/botanicalApi";
import { toast } from "sonner";

const QUICK_CATEGORIES = [
  { id: "all", label: "All Plants" },
  { id: "medicinal", label: "Medicinal Plants" },
  { id: "solanaceae", label: "Solanaceae" },
  { id: "edible", label: "Edible Crops" },
  { id: "india", label: "Plants of India" },
  { id: "air", label: "Air Purifying" },
];

const EcoKnowledgePage = () => {
  const navigate = useNavigate();
  const netState = useNetworkStatus();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [records, setRecords] = useState<BotanicalKnowledgeRecord[]>(PRESEEDED_BOTANICAL_KNOWLEDGE);
  const [isLoading, setIsLoading] = useState(false);
  const [isCachedResult, setIsCachedResult] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchQuery, selectedCategory);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, netState.isOnline]);

  const performSearch = async (query: string, category: string) => {
    setIsLoading(true);
    setStatusMessage(null);

    let effectiveQuery = query.trim();
    if (category !== "all" && !effectiveQuery) {
      if (category === "medicinal") effectiveQuery = "medicinal";
      else if (category === "solanaceae") effectiveQuery = "solanaceae";
      else if (category === "edible") effectiveQuery = "edible";
      else if (category === "india") effectiveQuery = "india";
      else if (category === "air") effectiveQuery = "air";
    }

    try {
      const res = await searchEcoKnowledgeEngine(effectiveQuery, netState.isOnline);
      setRecords(res.records);
      setIsCachedResult(res.isCached);
      if (res.message) setStatusMessage(res.message);
    } catch (err) {
      console.error("Search error:", err);
      toast.error("Error retrieving botanical knowledge records");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopHeader />

      <main className="container px-4 py-6 pb-28 space-y-6 max-w-5xl mx-auto">
        {/* Header Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="bg-eco-mint/40 text-eco-leaf border-eco-leaf/30 px-2.5 py-0.5 rounded-full text-xs flex items-center gap-1.5 font-medium">
                  <Globe2 className="h-3.5 w-3.5" />
                  Global Botanical Engine
                </Badge>
                {!netState.isOnline && (
                  <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs flex items-center gap-1">
                    <WifiOff className="h-3 w-3" />
                    Offline Cache Mode
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2.5 text-foreground">
                <BookMarked className="h-8 w-8 text-eco-leaf" />
                EcoKnowledge
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Search authoritative botanical species, diagnostic traits, diseases, care guides & uses.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-border/60 shadow-sm text-xs text-muted-foreground self-start sm:self-auto">
              <Database className="h-4 w-4 text-eco-leaf" />
              <span>
                <strong className="text-foreground">{records.length}</strong> Species Available
              </span>
            </div>
          </div>

          {/* Search Bar Interface */}
          <div className="relative">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by Common name, Scientific name, Genus (Solanum), Family (Solanaceae), Trait or Use..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-10 py-6 text-base rounded-2xl bg-card border-border/60 shadow-sm focus:border-eco-leaf"
              />
              {isLoading && (
                <div className="absolute right-3.5">
                  <div className="h-5 w-5 border-2 border-eco-leaf border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pt-3 pb-1 no-scrollbar">
              {QUICK_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                    selectedCategory === cat.id
                      ? "bg-eco-leaf text-white border-eco-leaf shadow-sm"
                      : "bg-card text-muted-foreground border-border/50 hover:border-border hover:bg-muted/50"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Results Metadata / Offline Notice */}
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-sm flex items-start gap-3"
          >
            <Info className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{statusMessage}</p>
              {!netState.isOnline && (
                <p className="text-xs text-amber-600 dark:text-amber-500/90 mt-1">
                  Connect to Wi-Fi or cellular internet to automatically pull live data from Kew POWO & GBIF Botanical Registry.
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Botanical Species Grid */}
        {records.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {records.map((plant, index) => (
              <motion.div
                key={plant.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card variant="glass" className="h-full flex flex-col justify-between overflow-hidden hover:border-eco-leaf/50 transition-all duration-300 group shadow-sm hover:shadow-md">
                  <div className="p-5 space-y-4">
                    {/* Plant Thumbnail & Header */}
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-muted border border-border/40">
                        <img
                          src={plant.images[0]?.url || "https://images.unsplash.com/photo-1592417817098-8f3d6eb247a5?w=500"}
                          alt={plant.scientificName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-1 left-1">
                          <Badge variant="secondary" className="bg-black/60 text-white backdrop-blur-md text-[10px] px-1.5 py-0 border-0">
                            {plant.sources[0]?.confidenceLevel || 'Verified'}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-semibold uppercase tracking-wider text-eco-leaf">
                            {plant.taxonomy.family}
                          </span>
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3 text-eco-success" />
                            {plant.sources[0]?.name.split(" ")[0] || 'GBIF'}
                          </span>
                        </div>

                        <h2 className="text-lg font-bold text-foreground truncate group-hover:text-eco-leaf transition-colors">
                          {plant.commonNames[0] || plant.scientificName}
                        </h2>

                        <p className="text-xs italic text-muted-foreground truncate">
                          {plant.scientificName}
                        </p>

                        <div className="pt-1 flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-[10px] bg-muted/50 border-border/50">
                            {plant.taxonomy.genus}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] bg-muted/50 border-border/50">
                            {plant.plantType.split(" ")[0]}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Description snippet */}
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {plant.description}
                    </p>

                    {/* Key Traits & Features badges */}
                    <div className="bg-muted/40 p-3 rounded-xl border border-border/40 space-y-2 text-xs">
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-muted-foreground">Leaf Type:</span>{" "}
                          <strong className="text-foreground font-medium truncate block">{plant.traits.leafType}</strong>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Growth Habit:</span>{" "}
                          <strong className="text-foreground font-medium truncate block">{plant.traits.growthHabit}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="px-5 py-3.5 bg-muted/30 border-t border-border/40 flex items-center justify-between gap-2">
                    <Link
                      to={`/eco-knowledge/${plant.id}`}
                      className="flex-1"
                    >
                      <Button size="sm" className="w-full bg-eco-leaf hover:bg-eco-leaf/90 text-white rounded-xl text-xs flex items-center justify-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5" />
                        Explore Profile
                        <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
                      </Button>
                    </Link>

                    <Link to={`/ecobot?plant=${encodeURIComponent(plant.commonNames[0] || plant.scientificName)}`}>
                      <Button size="sm" variant="outline" className="rounded-xl border-border/60 hover:bg-eco-mint/30 hover:border-eco-leaf/40 text-xs px-2.5">
                        <Bot className="h-3.5 w-3.5 text-eco-leaf" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card variant="glass" className="p-8 text-center space-y-4 max-w-md mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
              <Search className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold">No Matching Botanical Records</h3>
              <p className="text-xs text-muted-foreground">
                We couldn't find exact matches for "{searchQuery}". Try searching by family name like <code className="text-eco-leaf">Solanaceae</code> or genus <code className="text-eco-leaf">Solanum</code>.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="rounded-xl text-xs"
            >
              Reset Search Filter
            </Button>
          </Card>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default EcoKnowledgePage;
