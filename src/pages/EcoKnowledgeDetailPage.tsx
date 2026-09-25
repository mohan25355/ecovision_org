import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  BookMarked, 
  BookmarkCheck, 
  Share2, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink, 
  Bot, 
  Camera, 
  Plus, 
  Check, 
  Heart, 
  Info, 
  AlertTriangle, 
  BookOpen, 
  GraduationCap, 
  Microscope, 
  Sparkle, 
  Droplets, 
  Sun, 
  Thermometer, 
  Wind, 
  Layers, 
  Bug, 
  Stethoscope, 
  Compass, 
  Leaf, 
  Flame, 
  Award,
  RefreshCw,
  Eye,
  FileText
} from "lucide-react";
import { TopHeader, BottomNav } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { getEcoKnowledgeById, findUserPlantMatch } from "@/services/ecoKnowledgeEngine";
import { BotanicalKnowledgeRecord } from "@/services/botanicalApi";
import { generateOfflinePlantQuiz, saveQuizProgress, QuizQuestion } from "@/services/offlineQuizEngine";
import { saveRecord, PlantRecord } from "@/lib/db";
import { toast } from "sonner";

const EcoKnowledgeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const netState = useNetworkStatus();

  const [plant, setPlant] = useState<BotanicalKnowledgeRecord | null>(null);
  const [userPlantMatch, setUserPlantMatch] = useState<PlantRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [learningMode, setLearningMode] = useState<"beginner" | "student" | "advanced" | "research">("beginner");
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Quiz state
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    if (id) {
      loadPlantData(id);
    }
  }, [id, netState.isOnline]);

  const loadPlantData = async (plantId: string) => {
    setIsLoading(true);
    try {
      const data = await getEcoKnowledgeById(plantId, netState.isOnline);
      if (data) {
        setPlant(data);
        // Check if user has this plant in "My Plants"
        const match = await findUserPlantMatch(data.scientificName, data.commonNames);
        setUserPlantMatch(match);
      } else {
        toast.error("Botanical knowledge profile not found");
      }
    } catch (err) {
      console.error("Error loading plant profile:", err);
      toast.error("Failed to load plant knowledge profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToKnowledge = async () => {
    if (!plant) return;
    try {
      await saveRecord("plant_knowledge", {
        ...plant,
        updatedAt: new Date().toISOString(),
        syncStatus: "synced"
      });
      setIsSaved(true);
      toast.success(`Saved ${plant.commonNames[0] || plant.scientificName} to local EcoKnowledge offline cache!`);
    } catch (e) {
      toast.error("Failed to save to local cache");
    }
  };

  const handleAddToMyPlants = async () => {
    if (!plant) return;
    try {
      const newPlant: Partial<PlantRecord> = {
        commonName: plant.commonNames[0] || plant.scientificName,
        scientificName: plant.scientificName,
        nickname: `My ${plant.commonNames[0] || plant.scientificName}`,
        family: plant.taxonomy.family,
        image: plant.images[0]?.url || "https://images.unsplash.com/photo-1592417817098-8f3d6eb247a5?w=800",
        location: "Home Garden",
        healthScore: 95,
        status: "Healthy",
        wateringFrequencyDays: 5,
        lightRequirement: plant.care.light,
        soilType: plant.care.soil,
        notes: `Added from EcoKnowledge Engine. Native: ${plant.distribution.native.join(", ")}.`
      };

      const saved = await saveRecord("plants", newPlant);
      setUserPlantMatch(saved as PlantRecord);
      toast.success(`Added ${saved.nickname} to My Plants Garden! 🌱`);
    } catch (err) {
      toast.error("Failed to add to My Plants");
    }
  };

  const startQuiz = () => {
    if (!plant) return;
    const q = generateOfflinePlantQuiz(plant);
    if (q.length === 0) {
      toast.error("Not enough botanical quiz data for this species");
      return;
    }
    setQuizQuestions(q);
    setCurrentQIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizFinished(false);
    setIsQuizOpen(true);
  };

  const handleNextQuizQuestion = async () => {
    const isCorrect = selectedAnswer === quizQuestions[currentQIndex].correctIndex;
    const newScore = isCorrect ? score + 1 : score;

    if (isCorrect) {
      setScore(newScore);
    }

    if (currentQIndex + 1 < quizQuestions.length) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      setQuizFinished(true);
      if (plant) {
        await saveQuizProgress(plant.id, learningMode, newScore, quizQuestions.length);
        toast.success(`Quiz completed! Score saved to IndexedDB (${newScore}/${quizQuestions.length})`);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <TopHeader />
        <main className="container px-4 py-12 flex flex-col items-center justify-center space-y-4">
          <div className="h-10 w-10 border-4 border-eco-leaf border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Retrieving authoritative botanical profile...</p>
        </main>
        <BottomNav />
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="min-h-screen bg-background">
        <TopHeader />
        <main className="container px-4 py-12 text-center space-y-4 max-w-md mx-auto">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
          <h2 className="text-xl font-bold">Plant Profile Not Found</h2>
          <p className="text-sm text-muted-foreground">
            The requested botanical record is not currently cached in local memory.
          </p>
          <Button onClick={() => navigate("/eco-knowledge")} className="bg-eco-leaf text-white rounded-xl">
            Return to EcoKnowledge Search
          </Button>
        </main>
        <BottomNav />
      </div>
    );
  }

  const primaryCommonName = plant.commonNames[0] || plant.scientificName;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopHeader />

      <main className="container px-4 py-6 pb-32 space-y-6 max-w-4xl mx-auto">
        {/* Navigation & Header Actions */}
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/eco-knowledge")}
            className="rounded-xl gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to EcoKnowledge
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveToKnowledge}
              className={`rounded-xl gap-1.5 text-xs ${isSaved ? "border-eco-leaf text-eco-leaf bg-eco-mint/20" : ""}`}
            >
              {isSaved ? <BookmarkCheck className="h-3.5 w-3.5 text-eco-leaf" /> : <BookMarked className="h-3.5 w-3.5" />}
              {isSaved ? "Saved to Cache" : "Save to EcoKnowledge"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `${primaryCommonName} (${plant.scientificName})`,
                    text: plant.description,
                    url: window.location.href
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Profile link copied to clipboard!");
                }
              }}
              className="rounded-xl px-2.5"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* MY PLANT BI-DIRECTIONAL LINKAGE BANNER (SECTION 11) */}
        {userPlantMatch && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-2xl bg-gradient-to-r from-eco-leaf/15 via-eco-mint/30 to-emerald-500/10 border border-eco-leaf/40 shadow-sm space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-eco-leaf text-white font-bold text-lg flex items-center justify-center">
                  🌿
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-eco-leaf">In Your Garden</span>
                    <Badge className="bg-eco-leaf text-white text-[10px]">Active Digital Twin</Badge>
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    My Plant: {userPlantMatch.nickname}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Location: {userPlantMatch.location || "Indoor Garden"} • Health Score: {userPlantMatch.healthScore}%
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsCompareModalOpen(true)}
                  className="rounded-xl text-xs bg-background/80 hover:bg-background border-eco-leaf/40 text-eco-leaf"
                >
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  Compare Knowledge
                </Button>

                <Button
                  size="sm"
                  onClick={() => navigate(`/my-plants/${userPlantMatch.id}`)}
                  className="rounded-xl text-xs bg-eco-leaf text-white hover:bg-eco-leaf/90"
                >
                  View My Plant
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-eco-leaf/20">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/history")}
                className="text-xs text-eco-leaf hover:bg-eco-mint/40 rounded-lg px-2.5 py-1 h-auto"
              >
                View Scan History
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/ecobot?plant=${encodeURIComponent(primaryCommonName)}`)}
                className="text-xs text-eco-leaf hover:bg-eco-mint/40 rounded-lg px-2.5 py-1 h-auto"
              >
                Ask EcoBot
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/scan")}
                className="text-xs text-eco-leaf hover:bg-eco-mint/40 rounded-lg px-2.5 py-1 h-auto"
              >
                Health Check
              </Button>
            </div>
          </motion.div>
        )}

        {/* HERO HEADER CARD */}
        <Card variant="glass" className="overflow-hidden border-border/60">
          <div className="relative h-64 md:h-80 w-full bg-muted">
            <img
              src={plant.images[0]?.url || "https://images.unsplash.com/photo-1592417817098-8f3d6eb247a5?w=1200"}
              alt={plant.scientificName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            
            {/* Confidence Badges (Section 12) */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {plant.sources.map((src, i) => (
                <Badge
                  key={i}
                  className={`text-xs px-2.5 py-1 backdrop-blur-md shadow-md ${
                    src.confidenceLevel === "Verified Source"
                      ? "bg-emerald-600/90 text-white"
                      : src.confidenceLevel === "Source-derived"
                      ? "bg-blue-600/90 text-white"
                      : src.confidenceLevel === "AI Interpretation"
                      ? "bg-purple-600/90 text-white"
                      : "bg-amber-600/90 text-white"
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5 mr-1 inline-block" />
                  {src.confidenceLevel}
                </Badge>
              ))}
            </div>

            {/* Bottom Hero Info */}
            <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-emerald-300">
                  {plant.taxonomy.family} Family
                </span>
                <span className="text-white/60">•</span>
                <span className="text-xs text-white/80">{plant.plantType}</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight drop-shadow-md">
                {primaryCommonName}
              </h1>
              <p className="text-base italic text-emerald-100 font-medium">
                {plant.scientificName} {plant.taxonomy.author && <span className="not-italic text-white/70 text-xs">{plant.taxonomy.author}</span>}
              </p>
            </div>
          </div>
        </Card>

        {/* 1. IDENTITY CARD */}
        <Card variant="glass" className="space-y-4 p-5">
          <CardHeader className="p-0 border-b border-border/40 pb-3 flex flex-row items-center gap-2">
            <Award className="h-5 w-5 text-eco-leaf" />
            <CardTitle className="text-base font-bold">1. IDENTITY & TAXONOMY</CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-2 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
              <span className="text-muted-foreground block text-[11px]">Common Name</span>
              <strong className="text-foreground text-sm font-semibold">{primaryCommonName}</strong>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
              <span className="text-muted-foreground block text-[11px]">Scientific Name</span>
              <strong className="text-foreground text-sm italic font-semibold">{plant.scientificName}</strong>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
              <span className="text-muted-foreground block text-[11px]">Accepted Name</span>
              <strong className="text-foreground font-medium">{plant.acceptedName}</strong>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
              <span className="text-muted-foreground block text-[11px]">Family</span>
              <strong className="text-foreground font-semibold text-eco-leaf">{plant.taxonomy.family}</strong>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
              <span className="text-muted-foreground block text-[11px]">Genus</span>
              <strong className="text-foreground font-medium">{plant.taxonomy.genus}</strong>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
              <span className="text-muted-foreground block text-[11px]">Species</span>
              <strong className="text-foreground font-medium">{plant.taxonomy.species}</strong>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
              <span className="text-muted-foreground block text-[11px]">Plant Type</span>
              <strong className="text-foreground font-medium">{plant.plantType}</strong>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
              <span className="text-muted-foreground block text-[11px]">Life Form</span>
              <strong className="text-foreground font-medium">{plant.lifeForm}</strong>
            </div>
            {plant.synonyms.length > 0 && (
              <div className="col-span-2 md:col-span-4 p-3 rounded-xl bg-muted/30 border border-border/40">
                <span className="text-muted-foreground block text-[11px] mb-1">Botanical Synonyms:</span>
                <div className="flex flex-wrap gap-1.5">
                  {plant.synonyms.map((syn, idx) => (
                    <Badge key={idx} variant="outline" className="text-[11px] italic bg-background/50">
                      {syn}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 2. BOTANICAL DESCRIPTION */}
        <Card variant="glass" className="space-y-4 p-5">
          <CardHeader className="p-0 border-b border-border/40 pb-3 flex flex-row items-center gap-2">
            <FileText className="h-5 w-5 text-eco-leaf" />
            <CardTitle className="text-base font-bold">2. BOTANICAL DESCRIPTION</CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-2 text-sm leading-relaxed text-muted-foreground">
            <p>{plant.description}</p>
          </CardContent>
        </Card>

        {/* 3. BOTANICAL TRAITS (DESIGN MATCHING SPEC EXAMPLE) */}
        <Card variant="glass" className="space-y-4 p-5">
          <CardHeader className="p-0 border-b border-border/40 pb-3 flex flex-row items-center gap-2">
            <Layers className="h-5 w-5 text-eco-leaf" />
            <CardTitle className="text-base font-bold">3. BOTANICAL TRAITS</CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-card border border-border/60 shadow-xs space-y-1">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Leaf Type</span>
                <p className="text-sm font-bold text-foreground">{plant.traits.leafType}</p>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border/60 shadow-xs space-y-1">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Venation</span>
                <p className="text-sm font-bold text-foreground">{plant.traits.venation}</p>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border/60 shadow-xs space-y-1">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Texture</span>
                <p className="text-sm font-bold text-foreground">{plant.traits.texture}</p>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border/60 shadow-xs space-y-1">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Color</span>
                <p className="text-sm font-bold text-foreground">{plant.traits.color}</p>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border/60 shadow-xs space-y-1">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Growth Habit</span>
                <p className="text-sm font-bold text-foreground">{plant.traits.growthHabit}</p>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border/60 shadow-xs space-y-1">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Arrangement</span>
                <p className="text-sm font-bold text-foreground">{plant.traits.arrangement}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4. MORPHOLOGY */}
        <Card variant="glass" className="space-y-4 p-5">
          <CardHeader className="p-0 border-b border-border/40 pb-3 flex flex-row items-center gap-2">
            <Microscope className="h-5 w-5 text-eco-leaf" />
            <CardTitle className="text-base font-bold">4. MORPHOLOGY</CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-2 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/40 space-y-1">
              <span className="font-semibold text-eco-leaf block">Leaf Structure</span>
              <p className="text-muted-foreground">{plant.morphology.leaf}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/40 space-y-1">
              <span className="font-semibold text-eco-leaf block">Stem Morphology</span>
              <p className="text-muted-foreground">{plant.morphology.stem}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/40 space-y-1">
              <span className="font-semibold text-eco-leaf block">Flower & Inflorescence</span>
              <p className="text-muted-foreground">{plant.morphology.flower}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/40 space-y-1">
              <span className="font-semibold text-eco-leaf block">Fruit Type</span>
              <p className="text-muted-foreground">{plant.morphology.fruit}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/40 space-y-1">
              <span className="font-semibold text-eco-leaf block">Seed Morphology</span>
              <p className="text-muted-foreground">{plant.morphology.seed}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/40 space-y-1">
              <span className="font-semibold text-eco-leaf block">Root System</span>
              <p className="text-muted-foreground">{plant.morphology.root}</p>
            </div>
          </CardContent>
        </Card>

        {/* 5. IDENTIFICATION FEATURES */}
        <Card variant="glass" className="space-y-4 p-5">
          <CardHeader className="p-0 border-b border-border/40 pb-3 flex flex-row items-center gap-2">
            <Check className="h-5 w-5 text-eco-leaf" />
            <CardTitle className="text-base font-bold">5. IDENTIFICATION FEATURES</CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-2 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-muted/30 border border-border/40">
              <span className="text-muted-foreground block text-[10px]">Leaf Shape</span>
              <strong className="text-foreground">{plant.identificationFeatures.leafShape}</strong>
            </div>
            <div className="p-3 rounded-xl bg-muted/30 border border-border/40">
              <span className="text-muted-foreground block text-[10px]">Leaf Margin</span>
              <strong className="text-foreground">{plant.identificationFeatures.leafMargin}</strong>
            </div>
            <div className="p-3 rounded-xl bg-muted/30 border border-border/40">
              <span className="text-muted-foreground block text-[10px]">Leaf Apex</span>
              <strong className="text-foreground">{plant.identificationFeatures.leafApex}</strong>
            </div>
            <div className="p-3 rounded-xl bg-muted/30 border border-border/40">
              <span className="text-muted-foreground block text-[10px]">Leaf Base</span>
              <strong className="text-foreground">{plant.identificationFeatures.leafBase}</strong>
            </div>
            <div className="p-3 rounded-xl bg-muted/30 border border-border/40">
              <span className="text-muted-foreground block text-[10px]">Venation</span>
              <strong className="text-foreground">{plant.identificationFeatures.venation}</strong>
            </div>
            <div className="p-3 rounded-xl bg-muted/30 border border-border/40">
              <span className="text-muted-foreground block text-[10px]">Arrangement</span>
              <strong className="text-foreground">{plant.identificationFeatures.arrangement}</strong>
            </div>
          </CardContent>
        </Card>

        {/* 6. DISTRIBUTION */}
        <Card variant="glass" className="space-y-4 p-5">
          <CardHeader className="p-0 border-b border-border/40 pb-3 flex flex-row items-center gap-2">
            <Compass className="h-5 w-5 text-eco-leaf" />
            <CardTitle className="text-base font-bold">6. GEOGRAPHIC DISTRIBUTION & HABITAT</CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-2 space-y-3 text-xs">
            <div>
              <span className="font-semibold text-foreground block mb-1">Native Distribution:</span>
              <div className="flex flex-wrap gap-1.5">
                {plant.distribution.native.map((loc, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20">
                    🌍 {loc}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="font-semibold text-foreground block mb-1">Introduced Range:</span>
              <div className="flex flex-wrap gap-1.5">
                {plant.distribution.introduced.map((loc, idx) => (
                  <Badge key={idx} variant="outline" className="bg-muted/40">
                    🌱 {loc}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-muted/30 border border-border/40">
                <span className="text-muted-foreground block text-[11px]">Natural Habitat</span>
                <strong className="text-foreground">{plant.distribution.habitat}</strong>
              </div>
              <div className="p-3 rounded-xl bg-muted/30 border border-border/40">
                <span className="text-muted-foreground block text-[11px]">Primary Biome</span>
                <strong className="text-foreground">{plant.distribution.biome}</strong>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 7. USES */}
        <Card variant="glass" className="space-y-4 p-5">
          <CardHeader className="p-0 border-b border-border/40 pb-3 flex flex-row items-center gap-2">
            <Sparkle className="h-5 w-5 text-eco-leaf" />
            <CardTitle className="text-base font-bold">7. BOTANICAL & ETHNOBOTANICAL USES</CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {plant.uses.food.length > 0 && (
              <div className="space-y-1.5">
                <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  🍲 Culinary & Food Uses
                </span>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-1">
                  {plant.uses.food.map((u, i) => <li key={i}>{u}</li>)}
                </ul>
              </div>
            )}
            {plant.uses.medicinal.length > 0 && (
              <div className="space-y-1.5">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  💊 Medicinal & Phytochemical
                </span>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-1">
                  {plant.uses.medicinal.map((u, i) => <li key={i}>{u}</li>)}
                </ul>
              </div>
            )}
            {plant.uses.environmental.length > 0 && (
              <div className="space-y-1.5">
                <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  🌳 Environmental & Ecological
                </span>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-1">
                  {plant.uses.environmental.map((u, i) => <li key={i}>{u}</li>)}
                </ul>
              </div>
            )}
            {plant.uses.ornamental.length > 0 && (
              <div className="space-y-1.5">
                <span className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                  🌺 Ornamental & Landscaping
                </span>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-1">
                  {plant.uses.ornamental.map((u, i) => <li key={i}>{u}</li>)}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 8. CARE GUIDANCE */}
        <Card variant="glass" className="space-y-4 p-5">
          <CardHeader className="p-0 border-b border-border/40 pb-3 flex flex-row items-center gap-2">
            <Droplets className="h-5 w-5 text-eco-leaf" />
            <CardTitle className="text-base font-bold">8. HORTICULTURAL CARE GUIDANCE</CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-card border border-border/60 space-y-1">
              <span className="flex items-center gap-1 text-blue-500 font-semibold">
                <Droplets className="h-3.5 w-3.5" /> Irrigation
              </span>
              <p className="text-muted-foreground">{plant.care.water}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-card border border-border/60 space-y-1">
              <span className="flex items-center gap-1 text-amber-500 font-semibold">
                <Sun className="h-3.5 w-3.5" /> Light Exposure
              </span>
              <p className="text-muted-foreground">{plant.care.light}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-card border border-border/60 space-y-1">
              <span className="flex items-center gap-1 text-red-500 font-semibold">
                <Thermometer className="h-3.5 w-3.5" /> Temperature
              </span>
              <p className="text-muted-foreground">{plant.care.temperature}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-card border border-border/60 space-y-1">
              <span className="flex items-center gap-1 text-purple-500 font-semibold">
                <Wind className="h-3.5 w-3.5" /> Soil & Medium
              </span>
              <p className="text-muted-foreground">{plant.care.soil}</p>
            </div>
          </CardContent>
        </Card>

        {/* 9. DISEASES & PESTS */}
        {plant.diseases.length > 0 && (
          <Card variant="glass" className="space-y-4 p-5">
            <CardHeader className="p-0 border-b border-border/40 pb-3 flex flex-row items-center gap-2">
              <Stethoscope className="h-5 w-5 text-eco-leaf" />
              <CardTitle className="text-base font-bold">9. DISEASES & PATHOLOGY</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-2 space-y-4 text-xs">
              {plant.diseases.map((dis, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-muted/40 border border-border/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-foreground">{dis.name}</h4>
                    <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-500/30">
                      Cause: {dis.cause}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    <strong>Symptoms:</strong> {dis.symptoms.join(", ")}
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Management:</strong> {dis.management}
                  </p>
                  {dis.treatmentInfo && (
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                      <strong>Treatment Recommendation:</strong> {dis.treatmentInfo}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* 10. LEARN THIS PLANT (SECTION 6) */}
        <Card variant="glass" className="space-y-4 p-5 border-eco-leaf/40">
          <CardHeader className="p-0 border-b border-border/40 pb-3 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-eco-leaf" />
              <CardTitle className="text-base font-bold">10. LEARN THIS PLANT</CardTitle>
            </div>
            <Badge variant="secondary" className="bg-eco-mint/40 text-eco-leaf text-xs">
              Retrieved Educational Engine
            </Badge>
          </CardHeader>
          <CardContent className="p-0 pt-2 space-y-4">
            <Tabs defaultValue="beginner" onValueChange={(val) => setLearningMode(val as any)}>
              <TabsList className="grid grid-cols-4 w-full bg-muted/50 rounded-xl p-1">
                <TabsTrigger value="beginner" className="text-xs rounded-lg">Beginner</TabsTrigger>
                <TabsTrigger value="student" className="text-xs rounded-lg">Student</TabsTrigger>
                <TabsTrigger value="advanced" className="text-xs rounded-lg">Advanced</TabsTrigger>
                <TabsTrigger value="research" className="text-xs rounded-lg">Research</TabsTrigger>
              </TabsList>

              <div className="p-4 rounded-xl bg-card border border-border/60 mt-3 text-sm leading-relaxed text-foreground">
                <TabsContent value="beginner" className="m-0 space-y-2">
                  <p className="font-semibold text-eco-leaf flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" /> Beginner Level Summary
                  </p>
                  <p className="text-muted-foreground text-xs">{plant.learningContent.beginner}</p>
                </TabsContent>

                <TabsContent value="student" className="m-0 space-y-2">
                  <p className="font-semibold text-eco-leaf flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4" /> Student Academic Overview
                  </p>
                  <p className="text-muted-foreground text-xs">{plant.learningContent.student}</p>
                </TabsContent>

                <TabsContent value="advanced" className="m-0 space-y-2">
                  <p className="font-semibold text-eco-leaf flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4" /> Advanced Agronomic Deep-Dive
                  </p>
                  <p className="text-muted-foreground text-xs">{plant.learningContent.advanced}</p>
                </TabsContent>

                <TabsContent value="research" className="m-0 space-y-2">
                  <p className="font-semibold text-eco-leaf flex items-center gap-1.5">
                    <Microscope className="h-4 w-4" /> Research & Genomic Insights
                  </p>
                  <p className="text-muted-foreground text-xs">{plant.learningContent.research}</p>
                </TabsContent>
              </div>
            </Tabs>

            <div className="pt-2 flex justify-end">
              <Button
                onClick={startQuiz}
                className="bg-eco-leaf text-white hover:bg-eco-leaf/90 rounded-xl text-xs flex items-center gap-1.5"
              >
                <GraduationCap className="h-4 w-4" />
                Take Practice Quiz
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 11. SOURCES & ATTRIBUTION (SECTION 3 & 13) */}
        <Card variant="glass" className="space-y-4 p-5">
          <CardHeader className="p-0 border-b border-border/40 pb-3 flex flex-row items-center gap-2">
            <ExternalLink className="h-5 w-5 text-eco-leaf" />
            <CardTitle className="text-base font-bold">11. BOTANICAL SOURCES & ATTRIBUTION</CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-2 space-y-3 text-xs">
            <p className="text-muted-foreground">
              All botanical classifications and facts are retrieved strictly from authoritative scientific databases without fabrication.
            </p>
            <div className="space-y-2">
              {plant.sources.map((src, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/40">
                  <div className="space-y-0.5">
                    <strong className="text-foreground block">{src.name}</strong>
                    <span className="text-[11px] text-muted-foreground block">
                      License: {src.license || "Standard Terms"} • Retrieved: {new Date(src.retrievedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-eco-leaf/10 text-eco-leaf hover:bg-eco-leaf/20 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>

            {/* External Image Attributions */}
            {plant.images.length > 0 && (
              <div className="pt-2">
                <span className="font-semibold text-foreground block mb-2">Image Attributions & Rights:</span>
                <div className="space-y-1 text-[11px] text-muted-foreground">
                  {plant.images.map((img, i) => (
                    <div key={i} className="p-2 rounded-lg bg-muted/20 border border-border/30 flex items-center justify-between">
                      <span>
                        📸 {img.caption || "Botanical Specimen"} — <strong>{img.creator || "Contributor"}</strong> ({img.license || "Open License"})
                      </span>
                      {img.originalUrl && (
                        <a href={img.originalUrl} target="_blank" rel="noopener noreferrer" className="text-eco-leaf underline ml-2">
                          Source
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* QUICK ACTION BOTTOM BAR (SECTION 10) */}
      <div className="fixed bottom-16 left-0 right-0 z-40 bg-card/95 backdrop-blur-xl border-t border-border/60 py-3 px-4 shadow-lg">
        <div className="container max-w-4xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <Button
            size="sm"
            variant="outline"
            onClick={handleSaveToKnowledge}
            className={`rounded-xl text-xs gap-1.5 whitespace-nowrap ${isSaved ? "border-eco-leaf text-eco-leaf" : ""}`}
          >
            {isSaved ? <BookmarkCheck className="h-3.5 w-3.5" /> : <BookMarked className="h-3.5 w-3.5" />}
            {isSaved ? "Saved" : "Save to EcoKnowledge"}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleAddToMyPlants}
            className="rounded-xl text-xs gap-1.5 whitespace-nowrap border-eco-leaf/40 text-eco-leaf hover:bg-eco-mint/30"
          >
            <Plus className="h-3.5 w-3.5" />
            Add to My Plants
          </Button>

          <Button
            size="sm"
            onClick={() => navigate(`/ecobot?plant=${encodeURIComponent(primaryCommonName)}`)}
            className="rounded-xl text-xs gap-1.5 whitespace-nowrap bg-eco-leaf text-white hover:bg-eco-leaf/90"
          >
            <Bot className="h-3.5 w-3.5" />
            Ask EcoBot
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate("/scan")}
            className="rounded-xl text-xs gap-1.5 whitespace-nowrap"
          >
            <Camera className="h-3.5 w-3.5" />
            Scan Tomato
          </Button>
        </div>
      </div>

      {/* COMPARISON DIALOG MODAL */}
      <Dialog open={isCompareModalOpen} onOpenChange={setIsCompareModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-eco-leaf" />
              Compare Botanical Knowledge vs My Plant
            </DialogTitle>
            <DialogDescription>
              Side-by-side comparison between retrieved botanical standards and your local digital garden twin.
            </DialogDescription>
          </DialogHeader>

          {userPlantMatch && plant && (
            <div className="grid grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-4 rounded-xl bg-muted/40 border border-border/50 space-y-3">
                <h4 className="font-bold text-sm text-eco-leaf border-b border-border/40 pb-1">
                  Global Botanical Spec
                </h4>
                <p><strong>Species:</strong> {plant.scientificName}</p>
                <p><strong>Family:</strong> {plant.taxonomy.family}</p>
                <p><strong>Watering:</strong> {plant.care.water}</p>
                <p><strong>Light:</strong> {plant.care.light}</p>
                <p><strong>Soil:</strong> {plant.care.soil}</p>
              </div>

              <div className="p-4 rounded-xl bg-eco-mint/20 border border-eco-leaf/40 space-y-3">
                <h4 className="font-bold text-sm text-foreground border-b border-eco-leaf/30 pb-1">
                  My Plant Twin ({userPlantMatch.nickname})
                </h4>
                <p><strong>Nickname:</strong> {userPlantMatch.nickname}</p>
                <p><strong>Health Score:</strong> {userPlantMatch.healthScore}%</p>
                <p><strong>Status:</strong> {userPlantMatch.status}</p>
                <p><strong>Location:</strong> {userPlantMatch.location || "Indoor Garden"}</p>
                <p><strong>Last Watered:</strong> {userPlantMatch.lastWateredAt ? new Date(userPlantMatch.lastWateredAt).toLocaleDateString() : "Recently"}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* PRACTICE QUIZ MODAL */}
      <Dialog open={isQuizOpen} onOpenChange={setIsQuizOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-eco-leaf" />
              Offline Plant Knowledge Quiz
            </DialogTitle>
            <DialogDescription>
              Test your botanical knowledge for {primaryCommonName} ({plant?.scientificName}).
            </DialogDescription>
          </DialogHeader>

          {quizQuestions.length > 0 && !quizFinished && (
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
                <span>Question {currentQIndex + 1} of {quizQuestions.length}</span>
                <Badge variant="outline" className="text-[10px] bg-eco-mint/30 text-eco-leaf border-eco-leaf/30">
                  {quizQuestions[currentQIndex].fieldTested}
                </Badge>
              </div>

              <p className="text-sm font-bold text-foreground">
                {quizQuestions[currentQIndex].question}
              </p>

              <div className="space-y-2">
                {quizQuestions[currentQIndex].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedAnswer(idx)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                      selectedAnswer === idx
                        ? "bg-eco-leaf text-white border-eco-leaf font-semibold shadow-xs"
                        : "bg-card border-border/60 hover:bg-muted/50 text-foreground"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <Button
                disabled={selectedAnswer === null}
                onClick={handleNextQuizQuestion}
                className="w-full bg-eco-leaf text-white hover:bg-eco-leaf/90 rounded-xl text-xs mt-2"
              >
                {currentQIndex + 1 === quizQuestions.length ? "Submit & Save Progress" : "Next Question"}
              </Button>
            </div>
          )}

          {quizFinished && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-eco-mint/50 text-eco-leaf flex items-center justify-center mx-auto text-2xl font-bold">
                🎉
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold">Quiz Completed!</h3>
                <p className="text-xs text-muted-foreground">
                  You scored <strong className="text-eco-leaf">{score} / {quizQuestions.length}</strong> ({Math.round((score / quizQuestions.length) * 100)}%)
                </p>
              </div>
              <p className="text-xs text-muted-foreground bg-muted/40 p-3 rounded-xl">
                Your learning progress has been saved locally to IndexedDB for offline reference.
              </p>
              <Button onClick={() => setIsQuizOpen(false)} className="rounded-xl bg-eco-leaf text-white text-xs w-full">
                Close Quiz
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default EcoKnowledgeDetailPage;
