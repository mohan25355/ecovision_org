import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, X, Loader2, Leaf, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface LeafScannerProps {
  onImageCapture: (imageData: string) => void;
  isScanning?: boolean;
}

export function LeafScanner({ onImageCapture, isScanning = false }: LeafScannerProps) {
  const [dragOver, setDragOver] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleScan = () => {
    if (previewImage) {
      onImageCapture(previewImage);
    }
  };

  const clearImage = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!previewImage ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card
              variant="glass"
              className={cn(
                "relative overflow-hidden cursor-pointer transition-all duration-300",
                "border-2 border-dashed",
                dragOver ? "border-eco-leaf bg-eco-mint/20" : "border-border hover:border-eco-leaf/50"
              )}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="leaf-pattern absolute inset-0 opacity-30" />
              
              <div className="relative p-12 flex flex-col items-center justify-center min-h-[300px] space-y-6">
                <motion.div
                  className="p-6 rounded-full bg-eco-mint/50"
                  animate={{ 
                    scale: dragOver ? 1.1 : 1,
                    rotate: dragOver ? 5 : 0 
                  }}
                >
                  <Leaf className="h-12 w-12 text-eco-leaf" />
                </motion.div>
                
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    Drop your leaf photo here
                  </h3>
                  <p className="text-muted-foreground">
                    or click to browse your files
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <Button variant="eco-outline" size="lg" onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}>
                    <Upload className="h-5 w-5 mr-2" />
                    Upload Photo
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Supports JPG, PNG, WEBP • Max 10MB
                </p>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card variant="eco" className="relative overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm"
                onClick={clearImage}
              >
                <X className="h-5 w-5" />
              </Button>
              
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl m-4">
                <img
                  src={previewImage}
                  alt="Leaf preview"
                  className="w-full h-full object-cover"
                />
                
                {isScanning && (
                  <div className="absolute inset-0 bg-primary/10">
                    <motion.div
                      className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-eco-leaf to-transparent"
                      initial={{ top: 0 }}
                      animate={{ top: "100%" }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="p-4 rounded-full bg-background/90 backdrop-blur-sm">
                        <ScanLine className="h-8 w-8 text-eco-leaf animate-pulse" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4 pt-0">
                <Button
                  variant="eco"
                  size="xl"
                  className="w-full"
                  onClick={handleScan}
                  disabled={isScanning}
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Analyzing Leaf...
                    </>
                  ) : (
                    <>
                      <Camera className="h-5 w-5 mr-2" />
                      Identify Plant
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
