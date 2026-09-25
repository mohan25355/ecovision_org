import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Upload, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveRecord, PlantRecord } from "@/lib/db";
import { toast } from "sonner";

interface AddPlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlantAdded?: (plant: PlantRecord) => void;
}

export function AddPlantModal({ isOpen, onClose, onPlantAdded }: AddPlantModalProps) {
  const [nickname, setNickname] = useState("");
  const [commonName, setCommonName] = useState("");
  const [scientificName, setScientificName] = useState("");
  const [location, setLocation] = useState("Living Room");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState("https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=800");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) setImage(evt.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commonName.trim()) {
      toast.error("Please enter a plant name");
      return;
    }

    try {
      const newPlant: Partial<PlantRecord> = {
        id: `plant_manual_${Date.now()}`,
        commonName: commonName.trim(),
        scientificName: scientificName.trim() || "Unknown species",
        nickname: nickname.trim() || commonName.trim(),
        image: image,
        location: location.trim(),
        notes: notes.trim(),
        healthScore: 90,
        status: 'Healthy',
        lastCheckInAt: new Date().toISOString(),
        syncStatus: 'pending'
      };

      const saved = await saveRecord("plants", newPlant);
      
      await saveRecord("pending_actions", {
        plantId: saved.id,
        type: 'note',
        title: `Plant Added: ${saved.nickname}`,
        description: `Created manual profile for ${saved.commonName}`
      });

      toast.success(`Added "${saved.nickname}" to your garden!`);
      if (onPlantAdded) onPlantAdded(saved as PlantRecord);
      onClose();
    } catch (err) {
      toast.error("Failed to add plant record");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-card rounded-2xl border border-border overflow-hidden shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Plus className="h-5 w-5 text-eco-leaf" /> Add Plant Manually
            </h3>
            <button onClick={onClose} className="p-1 rounded-full text-muted-foreground hover:bg-muted">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-muted-foreground block mb-1">Plant Name (Required)</label>
              <input
                type="text"
                required
                value={commonName}
                onChange={(e) => setCommonName(e.target.value)}
                placeholder="e.g. Peace Lily, Tomato, Holy Basil"
                className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-eco-leaf"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Nickname (Optional)</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g. Home Tulsi"
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-eco-leaf"
                />
              </div>

              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Scientific Name</label>
                <input
                  type="text"
                  value={scientificName}
                  onChange={(e) => setScientificName(e.target.value)}
                  placeholder="e.g. Spathiphyllum"
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-eco-leaf"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Living Room, Balcony"
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-eco-leaf"
                />
              </div>

              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Photo Upload</label>
                <label className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-xs flex items-center justify-center gap-1.5 cursor-pointer hover:bg-muted/80">
                  <Upload className="h-3.5 w-3.5 text-eco-leaf" /> Choose Photo
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </div>
            </div>

            <div>
              <label className="font-semibold text-muted-foreground block mb-1">Care Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Special watering requirements, soil mix, light placement..."
                className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-eco-leaf h-16"
              />
            </div>

            <div className="pt-2">
              <Button type="submit" variant="eco" className="w-full">
                <CheckCircle2 className="h-4 w-4 mr-2" /> Add to Garden
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
