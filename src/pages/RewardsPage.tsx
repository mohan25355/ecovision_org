import { motion } from "framer-motion";
import { Trophy, Star, Leaf, Camera, Target, Gift } from "lucide-react";
import { TopHeader, BottomNav } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const achievements = [
  { icon: Camera, title: "First Scan", description: "Complete your first plant scan", points: 10, completed: true },
  { icon: Leaf, title: "Plant Collector", description: "Save 5 plants to your collection", points: 25, completed: true },
  { icon: Target, title: "Sharp Eye", description: "Get 95%+ confidence on 3 scans", points: 50, completed: false },
  { icon: Star, title: "Expert", description: "Identify 50 different plants", points: 100, completed: false },
];

const RewardsPage = () => {
  const totalPoints = 150;
  const level = Math.floor(totalPoints / 100) + 1;
  const progress = totalPoints % 100;

  return (
    <div className="min-h-screen bg-background">
      <TopHeader />
      
      <main className="container px-4 py-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Points Overview */}
          <Card variant="eco" className="overflow-hidden">
            <div className="leaf-pattern absolute inset-0 opacity-20" />
            <CardContent className="relative p-6 text-center">
              <div className="inline-flex p-4 rounded-full bg-eco-mint/50 mb-4">
                <Trophy className="h-10 w-10 text-eco-warning" />
              </div>
              <h1 className="text-4xl font-bold mb-1">{totalPoints}</h1>
              <p className="text-muted-foreground mb-4">EcoPoints</p>
              
              <div className="max-w-xs mx-auto">
                <div className="flex justify-between text-sm mb-2">
                  <span>Level {level}</span>
                  <span>Level {level + 1}</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-eco-leaf to-eco-warning rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {100 - progress} points to next level
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-eco-warning" />
              Achievements
            </h2>
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card variant={achievement.completed ? "eco" : "glass"} className="nature-card">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${achievement.completed ? "bg-eco-mint/50" : "bg-muted"}`}>
                        <achievement.icon className={`h-6 w-6 ${achievement.completed ? "text-eco-leaf" : "text-muted-foreground"}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-bold ${achievement.completed ? "text-eco-warning" : "text-muted-foreground"}`}>
                          +{achievement.points}
                        </span>
                        {achievement.completed && (
                          <p className="text-xs text-eco-success">Completed</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Rewards */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Gift className="h-5 w-5 text-eco-leaf" />
              Redeem Rewards
            </h2>
            <Card variant="glass" className="text-center py-8">
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Rewards coming soon! Keep earning EcoPoints.
                </p>
                <Button variant="eco-outline" disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default RewardsPage;
