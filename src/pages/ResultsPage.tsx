import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Leaf, Heart, Share2, ChevronLeft, Sprout, 
  Pill, Home, AlertTriangle, MapPin, Thermometer,
  Droplets, Bug, MessageCircle
} from "lucide-react";
import { TopHeader, BottomNav } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConfidenceMeter } from "@/components/ConfidenceMeter";
import { ResultCard } from "@/components/ResultCard";
import { EcoBotChat } from "@/components/EcoBotChat";
import { useState } from "react";
import { toast } from "sonner";

const ResultsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Get data from navigation state
  const result = location.state?.result;
  const imageData = location.state?.imageData;

  // If no result data, redirect back to scan
  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card variant="glass" className="p-8 text-center">
          <Leaf className="h-12 w-12 text-eco-leaf mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No scan data found</h2>
          <p className="text-muted-foreground mb-4">Please scan a leaf first</p>
          <Button variant="eco" onClick={() => navigate("/scan")}>
            Go to Scanner
          </Button>
        </Card>
      </div>
    );
  }

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? "Removed from My Plants" : "Added to My Plants");
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: result.commonName,
        text: `I identified ${result.commonName} (${result.scientificName}) with EcoVision!`,
        url: window.location.href
      });
    } catch {
      toast.success("Link copied to clipboard!");
    }
  };

  // Prepare plant context for EcoBot
  const plantContext = {
    commonName: result.commonName,
    scientificName: result.scientificName
  };

  return (
    <div className="min-h-screen bg-background">
      <TopHeader />
      
      <main className="pb-24">
        {/* Hero Image */}
        <div className="relative h-64 overflow-hidden">
          <img 
            src={imageData || "https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=800"} 
            alt={result.commonName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          
          <Button
            variant="eco-glass"
            size="icon"
            className="absolute top-4 left-4"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button
              variant="eco-glass"
              size="icon"
              onClick={handleSave}
            >
              <Heart className={`h-5 w-5 ${isSaved ? "fill-destructive text-destructive" : ""}`} />
            </Button>
            <Button
              variant="eco-glass"
              size="icon"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="container px-4 -mt-8 relative z-10 space-y-6">
          {/* Plant Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card variant="elevated" className="overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl font-bold text-foreground">{result.commonName}</h1>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-eco-mint/60 text-eco-leaf border border-eco-leaf/20">
                        {location.state?.aiSource ? location.state.aiSource.replace(/_/g, ' ') : 'Verified Intelligence'}
                      </span>
                    </div>
                    <p className="text-muted-foreground italic">{result.scientificName}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-eco-mint/50">
                    <Leaf className="h-6 w-6 text-eco-leaf" />
                  </div>
                </div>
                
                <ConfidenceMeter confidence={result.confidence} />

                {/* Treatment Safety Engine Warnings */}
                {result.confidence < 70 && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-500 font-medium">
                    ⚠️ Low confidence diagnosis ({result.confidence}%). Verify plant symptoms prior to applying chemical treatments.
                  </div>
                )}
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {result.description}
                </p>

                {result.careInstructions && (
                  <div className="p-3 rounded-xl bg-eco-mint/20 border border-eco-leaf/20">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">Care tip:</span> {result.careInstructions}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Uses Card */}
            <ResultCard title="Uses & Benefits" icon={Pill} delay={0.1}>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-eco-leaf mb-2 flex items-center gap-2">
                    <Pill className="h-4 w-4" /> Medicinal Uses
                  </h4>
                  <ul className="space-y-1">
                    {result.uses?.medicinal?.map((use: string, i: number) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-eco-leaf">•</span>{use}
                      </li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-muted-foreground italic mt-1">Disclaimer: Educational information only; do not use as medical advice.</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-eco-leaf mb-2 flex items-center gap-2">
                    <Home className="h-4 w-4" /> Daily Life & Agricultural
                  </h4>
                  <ul className="space-y-1">
                    {result.uses?.daily?.map((use: string, i: number) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-eco-leaf">•</span>{use}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ResultCard>

            {/* Habitat Card */}
            <ResultCard title="Growth & Habitat" icon={Sprout} delay={0.2}>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Thermometer className="h-4 w-4 text-eco-warning" />
                  <div>
                    <p className="text-xs text-muted-foreground">Climate</p>
                    <p className="text-sm font-medium">{result.habitat?.climate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Droplets className="h-4 w-4 text-eco-sky" />
                  <div>
                    <p className="text-xs text-muted-foreground">Soil Type</p>
                    <p className="text-sm font-medium">{result.habitat?.soil}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-destructive" />
                  <div>
                    <p className="text-xs text-muted-foreground">Native Region</p>
                    <p className="text-sm font-medium">{result.habitat?.region}</p>
                  </div>
                </div>
                {result.habitat?.water && (
                  <div className="flex items-center gap-3">
                    <Droplets className="h-4 w-4 text-eco-leaf" />
                    <div>
                      <p className="text-xs text-muted-foreground">Watering</p>
                      <p className="text-sm font-medium">{result.habitat.water}</p>
                    </div>
                  </div>
                )}
              </div>
            </ResultCard>

            {/* Safety Card */}
            <ResultCard 
              title="Health & Safety" 
              icon={AlertTriangle} 
              delay={0.3}
              iconColor="text-eco-warning"
            >
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-eco-warning/10 border border-eco-warning/20">
                  <p className="text-sm text-foreground">{result.safety?.toxicity}</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${result.safety?.edible ? "bg-eco-success" : "bg-destructive"}`} />
                    <span className="text-sm text-muted-foreground">
                      {result.safety?.edible ? "Edible Crop" : "Not Edible"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${result.safety?.petSafe ? "bg-eco-success" : "bg-eco-warning"}`} />
                    <span className="text-sm text-muted-foreground">
                      {result.safety?.petSafe ? "Pet Safe" : "Pet Caution"}
                    </span>
                  </div>
                </div>
              </div>
            </ResultCard>

            {/* Treatment & Diseases Engine */}
            <ResultCard title="Disease Diagnosis & Treatment" icon={Bug} delay={0.4}>
              <div className="space-y-3">
                {result.diseases && result.diseases.length > 0 ? (
                  result.diseases.map((disease: string, i: number) => (
                    <div key={i} className="p-3 rounded-xl bg-muted/60 space-y-2 text-xs">
                      <p className="font-bold text-destructive flex items-center gap-1.5">
                        <Bug className="h-4 w-4" /> Detected: {disease}
                      </p>
                      <div className="p-2 rounded bg-blue-500/10 border border-blue-500/20">
                        <p className="font-semibold text-blue-400">Chemical Treatment:</p>
                        <p className="text-muted-foreground">Apply broad-spectrum copper hydroxide or fungicide drench. Use only according to registered product label.</p>
                      </div>
                      <div className="p-2 rounded bg-eco-mint/20 border border-eco-leaf/20">
                        <p className="font-semibold text-eco-leaf">Natural Biological Treatment:</p>
                        <p className="text-muted-foreground">Isolate plant, improve air ventilation, spray diluted neem oil (1 tsp per L water), wipe foliage.</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-eco-success font-medium flex items-center gap-1.5">
                    ✓ No active foliar diseases detected on leaf sample.
                  </p>
                )}
              </div>
            </ResultCard>
          </div>

          {/* EcoBot Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {!showChat ? (
              <Card variant="eco" className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-eco-mint/50">
                        <MessageCircle className="h-6 w-6 text-eco-leaf" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Have questions?</h3>
                        <p className="text-sm text-muted-foreground">Ask EcoBot about {result.commonName}</p>
                      </div>
                    </div>
                    <Button variant="eco" onClick={() => setShowChat(true)}>
                      Start Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <EcoBotChat plantName={result.commonName} plantContext={plantContext} />
            )}
          </motion.div>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default ResultsPage;
