import { supabase } from "@/integrations/supabase/client";

export interface PlantIdentificationResult {
  commonName: string;
  scientificName: string;
  confidence: number;
  description: string;
  uses: {
    medicinal: string[];
    agricultural: string[];
    daily: string[];
  };
  habitat: {
    climate: string;
    soil: string;
    region: string;
    water: string;
  };
  safety: {
    toxicity: string;
    edible: boolean;
    petSafe: boolean;
  };
  diseases: string[];
  careInstructions?: string;
}

export async function identifyPlant(imageData: string): Promise<{ success: boolean; data?: PlantIdentificationResult; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('identify-plant', {
      body: { imageData }
    });

    if (error) {
      console.error('Error calling identify-plant function:', error);
      return { success: false, error: error.message };
    }

    if (!data.success) {
      return { success: false, error: data.error || 'Failed to identify plant' };
    }

    return { success: true, data: data.data };
  } catch (err) {
    console.error('Error identifying plant:', err);
    return { success: false, error: 'Failed to connect to AI service' };
  }
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface PlantContext {
  commonName: string;
  scientificName: string;
}

export async function chatWithEcoBot(
  messages: ChatMessage[], 
  plantContext?: PlantContext
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('ecobot-chat', {
      body: { messages, plantContext }
    });

    if (error) {
      console.error('Error calling ecobot-chat function:', error);
      return { success: false, error: error.message };
    }

    if (!data.success) {
      return { success: false, error: data.error || 'Failed to get response' };
    }

    return { success: true, message: data.message };
  } catch (err) {
    console.error('Error chatting with EcoBot:', err);
    return { success: false, error: 'Failed to connect to AI service' };
  }
}
