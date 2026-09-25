import { motion } from "framer-motion";
import { Leaf, Heart, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export interface PlantData {
  id: string;
  commonName: string;
  scientificName: string;
  confidence: number;
  imageUrl: string;
  scannedAt: Date;
  isSaved?: boolean;
}

interface PlantCardProps {
  plant: PlantData;
  index?: number;
  compact?: boolean;
}

export function PlantCard({ plant, index = 0, compact = false }: PlantCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link to={`/results/${plant.id}`}>
        <Card 
          variant="eco" 
          className={cn(
            "overflow-hidden nature-card cursor-pointer",
            compact ? "flex" : ""
          )}
        >
          <div className={cn(
            "relative overflow-hidden",
            compact ? "w-24 h-24 flex-shrink-0" : "aspect-[4/3]"
          )}>
            <img
              src={plant.imageUrl}
              alt={plant.commonName}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-medium flex items-center gap-1">
              <Leaf className="h-3 w-3 text-eco-leaf" />
              {plant.confidence}%
            </div>
            {plant.isSaved && (
              <div className="absolute top-2 left-2 p-1.5 rounded-full bg-destructive/90 text-destructive-foreground">
                <Heart className="h-3 w-3 fill-current" />
              </div>
            )}
          </div>
          
          <div className={cn("p-4", compact && "flex-1 flex flex-col justify-center")}>
            <h3 className="font-semibold text-foreground truncate">{plant.commonName}</h3>
            <p className="text-sm text-muted-foreground italic truncate">{plant.scientificName}</p>
            {!compact && (
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {plant.scannedAt.toLocaleDateString()}
              </div>
            )}
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
