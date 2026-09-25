import { motion } from "framer-motion";
import { Leaf, Sparkles } from "lucide-react";

interface ConfidenceMeterProps {
  confidence: number;
  animated?: boolean;
}

export function ConfidenceMeter({ confidence, animated = true }: ConfidenceMeterProps) {
  const getConfidenceColor = () => {
    if (confidence >= 80) return "from-eco-success to-eco-leaf";
    if (confidence >= 60) return "from-eco-leaf to-eco-warning";
    return "from-eco-warning to-destructive";
  };

  const getConfidenceLabel = () => {
    if (confidence >= 90) return "Excellent Match";
    if (confidence >= 80) return "High Confidence";
    if (confidence >= 60) return "Good Match";
    if (confidence >= 40) return "Moderate";
    return "Low Confidence";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Leaf className="h-4 w-4 text-eco-leaf" />
          <span className="text-sm font-medium text-muted-foreground">Confidence</span>
        </div>
        <div className="flex items-center gap-2">
          {confidence >= 80 && <Sparkles className="h-4 w-4 text-eco-leaf animate-pulse" />}
          <span className="font-bold text-foreground">{confidence}%</span>
        </div>
      </div>
      
      <div className="confidence-meter">
        <motion.div
          className={`confidence-fill bg-gradient-to-r ${getConfidenceColor()}`}
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${confidence}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
      
      <p className="text-xs text-muted-foreground text-center">
        {getConfidenceLabel()}
      </p>
    </div>
  );
}
