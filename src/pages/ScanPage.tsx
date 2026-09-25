import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Lightbulb, AlertCircle } from "lucide-react";
import { TopHeader, BottomNav } from "@/components/Navigation";
import { LeafScanner } from "@/components/LeafScanner";
import { Card, CardContent } from "@/components/ui/card";
import { aiRouter } from "@/lib/aiRouter";
import { toast } from "sonner";

const tips = [
  "Take photos in good lighting for best results",
  "Capture the entire leaf in frame",
  "Include both sides if possible",
  "Flat leaves work better than curled ones"
];

const ScanPage = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);

  const handleImageCapture = async (imageData: string) => {
    setIsScanning(true);
    
    try {
      toast.info("Analyzing leaf photo with Plant Intelligence Engine...", { duration: 2500 });
      
      const routerRes = await aiRouter.identifyPlant(imageData);
      
      if (routerRes.success && routerRes.data) {
        if (routerRes.source === 'QUEUED_FOR_SYNC') {
          toast.warning(routerRes.message || "Local vision unavailable. Scan saved & queued for cloud processing.");
        } else {
          toast.success(`Identified: ${routerRes.data.commonName}! (${routerRes.source.replace('_', ' ')})`);
        }
        
        // Generate a unique ID for this scan
        const scanId = Date.now().toString();
        
        // Navigate to results with the AI-generated data & source
        navigate(`/results/${scanId}`, { 
          state: { 
            imageData,
            result: routerRes.data,
            aiSource: routerRes.source
          }
        });
      } else {
        toast.error(routerRes.error || "Failed to identify plant. Please try again.");
      }
    } catch (error) {
      console.error("Error during scan:", error);
      toast.error("An error occurred during scanning. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopHeader />
      
      <main className="container px-4 py-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
              <Leaf className="h-6 w-6 text-eco-leaf" />
              Scan a Leaf
            </h1>
            <p className="text-muted-foreground">
              Upload or capture a photo to identify the plant with AI
            </p>
          </div>

          {/* AI Notice */}
          <Card variant="glass" className="border-eco-leaf/30">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-eco-leaf flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-foreground">Powered by Cloud Vision AI</p>
                <p className="text-muted-foreground">EcoVision analyzes leaf shape, venation, texture, and color patterns for accurate identification.</p>
              </div>
            </CardContent>
          </Card>

          {/* Scanner */}
          <LeafScanner 
            onImageCapture={handleImageCapture}
            isScanning={isScanning}
          />

          {/* Tips */}
          <Card variant="glass">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-4 w-4 text-eco-warning" />
                <span className="text-sm font-medium">Scanning Tips</span>
              </div>
              <ul className="space-y-2">
                {tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-eco-leaf mt-0.5">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default ScanPage;
