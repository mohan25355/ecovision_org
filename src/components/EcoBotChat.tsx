import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { aiRouter } from "@/lib/aiRouter";
import { ChatMessage, PlantContext } from "@/lib/ai";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface EcoBotChatProps {
  plantName?: string;
  plantContext?: PlantContext;
}

export function EcoBotChat({ plantName, plantContext }: EcoBotChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: plantName 
        ? `Hello! I'm EcoBot 🌿 I can help you learn more about ${plantName}. Ask me anything about its benefits, growing conditions, or uses!`
        : "Hello! I'm EcoBot 🌿 Your AI plant expert. Ask me anything about plants, gardening, or ecology! (Works Online & Offline)"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const suggestedQuestions = plantName 
    ? [
        `What are the benefits of ${plantName}?`,
        `Can I grow ${plantName} at home?`,
        `Is ${plantName} safe for pets?`,
        "Explain like I'm a farmer"
      ]
    : [
        "How do I identify poisonous plants?",
        "Best indoor plants for beginners",
        "How to care for succulents?",
        "Natural pest control methods"
      ];

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput("");
    setIsLoading(true);

    try {
      // Build chat history for context (exclude welcome message)
      const chatHistory: ChatMessage[] = messages
        .filter(m => m.id !== "welcome")
        .map(m => ({ role: m.role, content: m.content }));
      
      // Add the new user message
      chatHistory.push({ role: "user", content: userInput });

      const routerRes = await aiRouter.chatWithEcoBot(chatHistory, plantContext);

      if (routerRes.success && routerRes.data) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: routerRes.data
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        toast.error(routerRes.error || "Failed to get response");
        // Remove the user message if we failed
        setMessages((prev) => prev.filter(m => m.id !== userMessage.id));
      }
    } catch (error) {
      console.error("Error chatting with EcoBot:", error);
      toast.error("Failed to connect to AI. Please try again.");
      setMessages((prev) => prev.filter(m => m.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <Card variant="glass" className="flex flex-col h-[500px]">
      {/* Header */}
      <div className="p-4 border-b border-border/50 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-eco-mint/50">
          <Bot className="h-5 w-5 text-eco-leaf" />
        </div>
        <div>
          <h3 className="font-semibold">EcoBot</h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-eco-leaf" />
            EcoVision Plant Intelligence
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0",
                message.role === "user" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-eco-mint/50 text-eco-leaf"
              )}>
                {message.role === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>
              <div className={cn(
                "rounded-2xl px-4 py-3 max-w-[80%]",
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="p-2 rounded-full h-8 w-8 flex items-center justify-center bg-eco-mint/50 text-eco-leaf">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-2xl px-4 py-3 bg-muted flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-eco-leaf" />
              <span className="text-sm text-muted-foreground">Thinking...</span>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-muted-foreground mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSuggestedQuestion(q)}
                className="text-xs px-3 py-1.5 rounded-full bg-eco-mint/30 text-foreground hover:bg-eco-mint/50 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about plants..."
            className="flex-1 px-4 py-2 rounded-xl bg-muted border border-border/50 focus:outline-none focus:ring-2 focus:ring-eco-leaf/50 text-sm"
            disabled={isLoading}
          />
          <Button
            variant="eco"
            size="icon"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
