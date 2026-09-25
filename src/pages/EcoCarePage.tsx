import { motion } from "framer-motion";
import { Stethoscope, Pill, ShieldAlert, Sprout, Search } from "lucide-react";
import { TopHeader, BottomNav } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LOCAL_PLANT_DATABASE } from "@/knowledge/plantDatabase";
import { useState } from "react";

const EcoCarePage = () => {
  const [search, setSearch] = useState("");

  const filteredPlants = LOCAL_PLANT_DATABASE.filter(p => 
    p.commonName.toLowerCase().includes(search.toLowerCase()) ||
    p.scientificName.toLowerCase().includes(search.toLowerCase())
  );

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
                <Stethoscope className="h-6 w-6 text-eco-leaf" />
                EcoCare Disease & Treatment Hub
              </h1>
              <p className="text-sm text-muted-foreground">Chemical & Biological treatment guidelines</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search plant diseases or care guides..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted border border-border/50 focus:outline-none focus:ring-2 focus:ring-eco-leaf/50 text-sm"
            />
          </div>

          {/* Disease Treatments Directory */}
          <div className="space-y-4">
            {filteredPlants.map((plant) => (
              <Card key={plant.commonName} variant="glass" className="space-y-3">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex justify-between items-center">
                    <span>{plant.commonName}</span>
                    <span className="text-xs font-normal italic text-muted-foreground">{plant.scientificName}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 rounded-xl bg-muted text-xs space-y-1">
                    <p className="font-semibold text-eco-leaf">Care Recommendation:</p>
                    <p className="text-muted-foreground">{plant.careInstructions}</p>
                  </div>

                  {plant.diseaseDetails.map((disease) => (
                    <div key={disease.diseaseName} className="p-4 rounded-xl border border-border bg-card space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-sm text-destructive flex items-center gap-1.5">
                          <ShieldAlert className="h-4 w-4" /> {disease.diseaseName}
                        </h4>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 font-bold">
                          {disease.severity} Severity
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        {/* Chemical */}
                        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 space-y-1">
                          <p className="font-bold text-blue-400 flex items-center gap-1">
                            <Pill className="h-3.5 w-3.5" /> Chemical Treatment
                          </p>
                          <p><span className="font-semibold">Active Ingredient:</span> {disease.chemicalTreatment.activeIngredient}</p>
                          <p><span className="font-semibold">Purpose:</span> {disease.chemicalTreatment.purpose}</p>
                          <p className="text-[10px] text-muted-foreground italic mt-1">{disease.chemicalTreatment.labelDisclaimer}</p>
                        </div>

                        {/* Natural */}
                        <div className="p-3 rounded-lg bg-eco-mint/20 border border-eco-leaf/20 space-y-1">
                          <p className="font-bold text-eco-leaf flex items-center gap-1">
                            <Sprout className="h-3.5 w-3.5" /> Natural Treatment
                          </p>
                          <p><span className="font-semibold">Cultural:</span> {disease.naturalTreatment.culturalControl}</p>
                          <p><span className="font-semibold">Organic:</span> {disease.naturalTreatment.organicOption}</p>
                          <p className="text-[10px] text-muted-foreground italic mt-1">{disease.naturalTreatment.safetyNote}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
};

export default EcoCarePage;
