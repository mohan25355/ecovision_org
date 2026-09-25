import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ResultCardProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  delay?: number;
  variant?: "default" | "glass" | "eco" | "nature" | "result";
  iconColor?: string;
}

export function ResultCard({ 
  title, 
  icon: Icon, 
  children, 
  delay = 0,
  variant = "result",
  iconColor = "text-eco-leaf"
}: ResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card variant={variant} className="nature-card h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className={cn(
              "p-2 rounded-xl bg-eco-mint/50",
              iconColor
            )}>
              <Icon className="h-5 w-5" />
            </div>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}
