import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Camera, Leaf, Sparkles, Bot, BookOpen, ArrowRight, ScanLine, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TopHeader, BottomNav } from "@/components/Navigation";

const features = [
  {
    icon: ScanLine,
    title: "AI Leaf Scanner",
    description: "Advanced image recognition identifies plants from any leaf photo"
  },
  {
    icon: Sparkles,
    title: "Detailed Insights",
    description: "Get botanical info, medicinal uses, and growing conditions"
  },
  {
    icon: Bot,
    title: "EcoBot Assistant",
    description: "Ask questions and learn from our AI plant expert"
  },
  {
    icon: Shield,
    title: "Safety Warnings",
    description: "Know if a plant is toxic, edible, or pet-safe"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopHeader />
      
      <main className="pb-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="leaf-pattern absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-b from-eco-mint/30 via-transparent to-background" />
          
          <div className="relative container px-4 pt-12 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                className="inline-flex p-4 rounded-full bg-eco-mint/50 mb-4"
              >
                <Leaf className="h-12 w-12 text-eco-leaf" />
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                <span className="text-eco-gradient">EcoVision</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-md mx-auto">
                AI-powered plant identification from a single leaf photo
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link to="/scan">
                  <Button variant="eco" size="xl" className="w-full sm:w-auto">
                    <Camera className="h-5 w-5 mr-2" />
                    Start Scanning
                  </Button>
                </Link>
                <Link to="/ecobot">
                  <Button variant="eco-outline" size="xl" className="w-full sm:w-auto">
                    <Bot className="h-5 w-5 mr-2" />
                    Ask EcoBot
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container px-4 py-12">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-center mb-8"
          >
            Discover the Power of AI Botany
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="nature" className="h-full nature-card">
                  <CardContent className="p-6 flex gap-4">
                    <div className="p-3 rounded-xl bg-eco-mint/50 h-fit">
                      <feature.icon className="h-6 w-6 text-eco-leaf" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="container px-4 py-8">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <Link to="/my-plants">
              <Card variant="glass" className="nature-card p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-eco-mint/50">
                    <BookOpen className="h-5 w-5 text-eco-leaf" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">My Plants</h3>
                    <p className="text-xs text-muted-foreground">View collection</p>
                  </div>
                </div>
              </Card>
            </Link>
            
            <Link to="/history">
              <Card variant="glass" className="nature-card p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-eco-mint/50">
                    <Zap className="h-5 w-5 text-eco-leaf" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Recent Scans</h3>
                    <p className="text-xs text-muted-foreground">View history</p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="container px-4 py-8">
          <Card variant="eco" className="overflow-hidden">
            <div className="relative p-6">
              <div className="leaf-pattern absolute inset-0 opacity-20" />
              <div className="relative flex items-center justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold">Ready to explore?</h3>
                  <p className="text-sm text-muted-foreground">
                    Scan your first leaf now
                  </p>
                </div>
                <Link to="/scan">
                  <Button variant="eco" size="icon-lg">
                    <ArrowRight className="h-6 w-6" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </section>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Index;
