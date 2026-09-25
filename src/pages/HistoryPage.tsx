import { motion } from "framer-motion";
import { History, Calendar, Trash2 } from "lucide-react";
import { TopHeader, BottomNav } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { PlantCard, PlantData } from "@/components/PlantCard";

// Mock scan history
const scanHistory: PlantData[] = [
  {
    id: "1",
    commonName: "Peace Lily",
    scientificName: "Spathiphyllum wallisii",
    confidence: 94,
    imageUrl: "https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=800",
    scannedAt: new Date("2024-01-15"),
    isSaved: true
  },
  {
    id: "4",
    commonName: "Fiddle Leaf Fig",
    scientificName: "Ficus lyrata",
    confidence: 88,
    imageUrl: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800",
    scannedAt: new Date("2024-01-14"),
    isSaved: false
  },
  {
    id: "2",
    commonName: "Snake Plant",
    scientificName: "Dracaena trifasciata",
    confidence: 97,
    imageUrl: "https://images.unsplash.com/photo-1572688484438-313a6e50c333?w=800",
    scannedAt: new Date("2024-01-10"),
    isSaved: true
  },
  {
    id: "5",
    commonName: "Pothos",
    scientificName: "Epipremnum aureum",
    confidence: 92,
    imageUrl: "https://images.unsplash.com/photo-1600411833114-6fbbab4ab5f5?w=800",
    scannedAt: new Date("2024-01-08"),
    isSaved: false
  },
  {
    id: "3",
    commonName: "Monstera",
    scientificName: "Monstera deliciosa",
    confidence: 91,
    imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800",
    scannedAt: new Date("2024-01-05"),
    isSaved: true
  }
];

// Group by date
const groupByDate = (plants: PlantData[]) => {
  const groups: { [key: string]: PlantData[] } = {};
  
  plants.forEach(plant => {
    const date = plant.scannedAt.toLocaleDateString("en-US", { 
      month: "long", 
      day: "numeric",
      year: "numeric"
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(plant);
  });
  
  return groups;
};

const HistoryPage = () => {
  const groupedHistory = groupByDate(scanHistory);

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <History className="h-6 w-6 text-eco-leaf" />
                Scan History
              </h1>
              <p className="text-muted-foreground text-sm">
                {scanHistory.length} total scans
              </p>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>

          {/* History List */}
          <div className="space-y-6">
            {Object.entries(groupedHistory).map(([date, plants], groupIndex) => (
              <div key={date}>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">{date}</span>
                </div>
                <div className="space-y-3">
                  {plants.map((plant, index) => (
                    <PlantCard 
                      key={plant.id} 
                      plant={plant} 
                      index={groupIndex + index * 0.1}
                      compact
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default HistoryPage;
