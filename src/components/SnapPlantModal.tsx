import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, X, RefreshCw, CheckCircle2, Leaf, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { aiRouter } from "@/lib/aiRouter";
import { PlantIdentificationResult } from "@/lib/ai";
import { saveRecord, getRecordById, PlantRecord } from "@/lib/db";
import { compressBase64Image } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface SnapPlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPlantId?: string; // If scanning for a specific existing plant
  onPlantSaved?: (plant: PlantRecord) => void;
}

export function SnapPlantModal({ isOpen, onClose, targetPlantId, onPlantSaved }: SnapPlantModalProps) {
  const navigate = useNavigate();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PlantIdentificationResult | null>(null);
  const [aiSource, setAiSource] = useState<string>("");
  const [nickname, setNickname] = useState("");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, capturedImage]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.log("Camera access unavailable, fallback to file upload", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setCapturedImage(dataUrl);
        stopCamera();
        handleAnalyze(dataUrl);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const dataUrl = evt.target?.result as string;
        setCapturedImage(dataUrl);
        stopCamera();
        handleAnalyze(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async (imageData: string) => {
    setIsAnalyzing(true);
    toast.info("Analyzing plant with EcoVision Intelligence...");

    try {
      const routerRes = await aiRouter.identifyPlant(imageData);
      if (routerRes.success && routerRes.data) {
        setResult(routerRes.data);
        setAiSource(routerRes.source);
        setNickname(routerRes.data.commonName);
        toast.success(`Plant identified: ${routerRes.data.commonName}`);
      } else {
        toast.error(routerRes.error || "Could not analyze image");
      }
    } catch (e) {
      toast.error("Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveToGarden = async () => {
    if (!result || !capturedImage) return;

    try {
      const compressedImg = await compressBase64Image(capturedImage);
      
      let existingPlant: PlantRecord | null = null;
      if (targetPlantId) {
        existingPlant = await getRecordById<PlantRecord>("plants", targetPlantId);
      }

      const plantRecord: Partial<PlantRecord> = {
        id: targetPlantId || existingPlant?.id || `plant_${Date.now()}`,
        commonName: result.commonName,
        scientificName: result.scientificName,
        nickname: existingPlant?.nickname || nickname.trim() || result.commonName,
        family: existingPlant?.family || (result.habitat.climate ? "Botanical" : "Flora"),
        image: compressedImg,
        location: existingPlant?.location || "Living Room Garden",
        notes: existingPlant?.notes || result.description,
        healthScore: result.confidence,
        status: result.confidence > 80 ? 'Healthy' : 'Needs Attention',
        lastScanAt: new Date().toISOString(),
        syncStatus: 'pending'
      };

      const saved = await saveRecord("plants", plantRecord);
      
      // Save snapshot & activity log
      await saveRecord("plant_scans", {
        plantId: saved.id,
        image: compressedImg,
        scanResult: result,
        confidence: result.confidence,
        healthScore: result.confidence,
        createdAt: new Date().toISOString(),
        syncStatus: 'pending'
      });

      await saveRecord("pending_actions", {
        plantId: saved.id,
        type: 'scan',
        title: targetPlantId ? `Rescan Completed: ${saved.nickname}` : `Plant Snapped: ${saved.nickname}`,
        description: `Identified as ${saved.commonName} (${saved.scientificName}) with ${result.confidence}% confidence`,
        createdAt: new Date().toISOString(),
        syncStatus: 'pending'
      });

      toast.success(targetPlantId ? `Updated snapshot for "${saved.nickname}"!` : `Saved "${saved.nickname}" to My Plants!`);
      if (onPlantSaved) onPlantSaved(saved as PlantRecord);
      onClose();
    } catch (e) {
      toast.error("Failed to save plant profile");
    }
  };

  const handleReset = () => {
    setCapturedImage(null);
    setResult(null);
    startCamera();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-card rounded-2xl border border-border overflow-hidden shadow-2xl space-y-4 p-5 relative max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Camera className="h-5 w-5 text-eco-leaf" /> Snap Plant Photo
            </h3>
            <button onClick={onClose} className="p-1 rounded-full text-muted-foreground hover:bg-muted">
              <X className="h-5 w-5" />
            </button>
          </div>

          {!capturedImage ? (
            <div className="space-y-4">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black flex items-center justify-center border border-border">
                {stream ? (
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-6 space-y-2">
                    <Leaf className="h-10 w-10 text-eco-leaf mx-auto opacity-50" />
                    <p className="text-xs text-muted-foreground">Camera loading or permission requested...</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button variant="eco" className="flex-1" onClick={capturePhoto}>
                  <Camera className="h-4 w-4 mr-2" /> Take Snapshot
                </Button>
                <Button variant="eco-outline" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" /> Upload
                </Button>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border">
                <img src={capturedImage} alt="Captured Plant" className="w-full h-full object-cover" />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-2">
                    <RefreshCw className="h-8 w-8 animate-spin text-eco-leaf" />
                    <p className="text-xs font-semibold">EcoVision Intelligence Analyzing...</p>
                  </div>
                )}
              </div>

              {result && !isAnalyzing && (
                <Card variant="eco" className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-base">{result.commonName}</h4>
                      <p className="text-xs italic text-muted-foreground">{result.scientificName}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-eco-mint text-eco-leaf">
                      {result.confidence}% Match
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">
                      Give your plant a nickname:
                    </label>
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="e.g. Home Tulsi, Living Room Peace Lily..."
                      className="w-full px-3 py-1.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-eco-leaf"
                    />
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <Button variant="eco" size="sm" onClick={handleSaveToGarden}>
                      <CheckCircle2 className="h-4 w-4 mr-2" /> Save to My Plants
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="eco-outline" size="sm" className="flex-1" onClick={() => {
                        onClose();
                        navigate(`/results/${Date.now()}`, { state: { imageData: capturedImage, result, aiSource } });
                      }}>
                        Full Intelligence
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleReset}>
                        Retake
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
