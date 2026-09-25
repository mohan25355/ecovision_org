import { networkStateEngine } from "@/services/networkState";

export interface OllamaConfig {
  baseUrl: string;
  textModel: string;
  visionModel: string;
}

const DEFAULT_CONFIG: OllamaConfig = {
  baseUrl: "http://localhost:11434",
  textModel: "llama3.2",
  visionModel: "llava"
};

export function getOllamaConfig(): OllamaConfig {
  try {
    const saved = localStorage.getItem("ecovision_ollama_config");
    if (saved) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error("Failed to read Ollama config", e);
  }
  return DEFAULT_CONFIG;
}

export function saveOllamaConfig(config: Partial<OllamaConfig>): OllamaConfig {
  const current = getOllamaConfig();
  const updated = { ...current, ...config };
  try {
    localStorage.setItem("ecovision_ollama_config", JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save Ollama config", e);
  }
  return updated;
}

export interface OllamaStatus {
  available: boolean;
  models: string[];
  hasVisionModel: boolean;
  detectedVisionModel?: string;
  detectedTextModel?: string;
  error?: string;
}

export async function checkOllamaStatus(customUrl?: string): Promise<OllamaStatus> {
  const config = getOllamaConfig();
  const url = customUrl || config.baseUrl;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`${url}/api/tags`, {
      method: 'GET',
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      networkStateEngine.setLocalAiAvailable(false);
      return { available: false, models: [], hasVisionModel: false, error: "Server returned error" };
    }

    const data = await response.json();
    const models: string[] = (data.models || []).map((m: any) => m.name || m.model);

    const visionKeywords = ['llava', 'vision', 'bakllava', 'llama3.2-vision', 'moondream'];
    const detectedVision = models.find((m) => visionKeywords.some((v) => m.toLowerCase().includes(v)));
    const detectedText = models.find((m) => !visionKeywords.some((v) => m.toLowerCase().includes(v))) || models[0];

    const isAvailable = true;
    networkStateEngine.setLocalAiAvailable(isAvailable);

    return {
      available: true,
      models,
      hasVisionModel: !!detectedVision,
      detectedVisionModel: detectedVision || config.visionModel,
      detectedTextModel: detectedText || config.textModel
    };
  } catch (err) {
    networkStateEngine.setLocalAiAvailable(false);
    return {
      available: false,
      models: [],
      hasVisionModel: false,
      error: "Ollama not running locally at " + url
    };
  }
}

export async function generateOllamaChat(
  messages: Array<{ role: string; content: string }>,
  systemPrompt?: string
): Promise<{ success: boolean; content?: string; error?: string }> {
  const config = getOllamaConfig();
  
  try {
    const payloadMessages = systemPrompt 
      ? [{ role: 'system', content: systemPrompt }, ...messages]
      : messages;

    const res = await fetch(`${config.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: config.textModel,
        messages: payloadMessages,
        stream: false
      })
    });

    if (!res.ok) {
      return { success: false, error: `Ollama HTTP error ${res.status}` };
    }

    const data = await res.json();
    return { success: true, content: data.message?.content };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to query Ollama" };
  }
}

export async function generateOllamaVision(
  base64Image: string,
  prompt: string
): Promise<{ success: boolean; content?: string; error?: string }> {
  const config = getOllamaConfig();
  
  // Clean base64 string
  let cleanImage = base64Image;
  if (base64Image.includes(',')) {
    cleanImage = base64Image.split(',')[1];
  }

  try {
    const res = await fetch(`${config.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: config.visionModel,
        prompt: prompt,
        images: [cleanImage],
        stream: false
      })
    });

    if (!res.ok) {
      return { success: false, error: `Ollama Vision HTTP error ${res.status}` };
    }

    const data = await res.json();
    return { success: true, content: data.response };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to query Ollama Vision" };
  }
}
