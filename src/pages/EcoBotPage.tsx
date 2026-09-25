import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { TopHeader, BottomNav } from "@/components/Navigation";
import { EcoBotChat } from "@/components/EcoBotChat";

const EcoBotPage = () => {
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
            <div className="inline-flex p-3 rounded-full bg-eco-mint/50 mb-2">
              <Bot className="h-8 w-8 text-eco-leaf" />
            </div>
            <h1 className="text-2xl font-bold">EcoBot</h1>
            <p className="text-muted-foreground">
              Your AI plant expert - ask anything!
            </p>
          </div>

          {/* Chat */}
          <EcoBotChat />
        </motion.div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default EcoBotPage;
