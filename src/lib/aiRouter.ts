import { 
  identifyPlant as cloudIdentifyPlant, 
  chatWithEcoBot as cloudChatWithEcoBot,
  PlantIdentificationResult, 
  ChatMessage, 
  PlantContext 
} from "@/lib/ai";
import { networkStateEngine } from "@/services/networkState";
import { checkOllamaStatus, generateOllamaChat, generateOllamaVision } from "@/lib/ollama";
import { LOCAL_PLANT_DATABASE, searchLocalKnowledge } from "@/knowledge/plantDatabase";
import { searchLocalEcoKnowledge } from "@/services/ecoKnowledgeEngine";
import { saveRecord } from "@/lib/db";

export interface AIRouterResult<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  source: 'CLOUD_AI' | 'LOCAL_OLLAMA_AI' | 'OFFLINE_KNOWLEDGE' | 'QUEUED_FOR_SYNC';
}

export class AIRouter {
  
  public async identifyPlant(imageData: string): Promise<AIRouterResult<PlantIdentificationResult>> {
    const netState = await networkStateEngine.checkConnectivity();

    // 1. ONLINE MODE -> Use existing Supabase Gemini Cloud AI pipeline
    if (netState.isOnline) {
      console.log("[AIRouter] Mode: ONLINE -> Using Cloud AI");
      const result = await cloudIdentifyPlant(imageData);
      if (result.success && result.data) {
        // Save scan to IndexedDB local cache for offline viewing later
        saveRecord("plant_scans", {
          ...result.data,
          imageData,
          syncStatus: 'synced'
        }).catch((e) => console.error("Cache scan error:", e));

        return {
          success: true,
          data: result.data,
          source: 'CLOUD_AI'
        };
      }
    }

    // 2. OFFLINE MODE -> Check if Ollama Vision is available
    console.log("[AIRouter] Mode: OFFLINE -> Checking local Ollama AI status");
    const ollamaStatus = await checkOllamaStatus();

    if (ollamaStatus.available && ollamaStatus.hasVisionModel) {
      console.log("[AIRouter] Using Local Ollama Vision Model:", ollamaStatus.detectedVisionModel);
      const prompt = `Analyze this leaf image and identify the plant species. Respond with ONLY valid JSON matching this schema:
{
  "commonName": "name",
  "scientificName": "binomial name",
  "confidence": 85,
  "description": "2 sentences description",
  "uses": { "medicinal": ["use 1"], "agricultural": ["use 1"], "daily": ["use 1"] },
  "habitat": { "climate": "climate", "soil": "soil", "region": "region", "water": "water" },
  "safety": { "toxicity": "toxicity details", "edible": false, "petSafe": false },
  "diseases": [],
  "careInstructions": "care info"
}`;
      
      const res = await generateOllamaVision(imageData, prompt);
      if (res.success && res.content) {
        try {
          let cleanJson = res.content.trim();
          if (cleanJson.startsWith('```json')) cleanJson = cleanJson.slice(7);
          if (cleanJson.startsWith('```')) cleanJson = cleanJson.slice(3);
          if (cleanJson.endsWith('```')) cleanJson = cleanJson.slice(0, -3);
          const parsed: PlantIdentificationResult = JSON.parse(cleanJson.trim());
          
          saveRecord("plant_scans", {
            ...parsed,
            imageData,
            syncStatus: 'synced'
          }).catch(() => {});

          return {
            success: true,
            data: parsed,
            source: 'LOCAL_OLLAMA_AI'
          };
        } catch (parseErr) {
          console.error("Failed to parse Ollama vision JSON response", parseErr);
        }
      }
    }

    // 3. OFFLINE FALLBACK (No Vision Model Installed) -> Queue scan in IndexedDB & return local database match if available
    console.log("[AIRouter] Local Vision Model Unavailable -> Queueing scan for cloud sync");
    
    // Save to offline scan queue
    const queuedScan = await saveRecord("offline_scans", {
      imageData,
      status: 'Waiting for AI analysis',
      syncStatus: 'pending'
    });

    // Provide default fallback plant profile from local offline database (e.g. Peace Lily as reference)
    const fallbackPlant = LOCAL_PLANT_DATABASE[0];

    return {
      success: true,
      data: {
        ...fallbackPlant,
        description: `[Offline Mode] Image queued for cloud analysis (Scan ID: ${queuedScan.id}). Displaying verified offline reference model until internet connection is restored.`
      },
      source: 'QUEUED_FOR_SYNC',
      message: 'Local vision model unavailable. Scan saved and queued for cloud analysis when online.'
    };
  }

  public async chatWithEcoBot(
    messages: ChatMessage[],
    plantContext?: PlantContext
  ): Promise<AIRouterResult<string>> {
    const netState = await networkStateEngine.checkConnectivity();
    const lastUserMessage = messages[messages.length - 1]?.content || "";

    // 1. ONLINE MODE -> Use existing Supabase Gemini Cloud AI pipeline
    if (netState.isOnline) {
      console.log("[AIRouter Chat] Mode: ONLINE -> Using Cloud Gemini AI");
      const res = await cloudChatWithEcoBot(messages, plantContext);
      if (res.success && res.message) {
        return {
          success: true,
          data: res.message,
          source: 'CLOUD_AI'
        };
      }
    }

    // 2. OFFLINE MODE -> Check local knowledge RAG context first
    console.log("[AIRouter Chat] Mode: OFFLINE -> Searching Local Knowledge & Garden State");
    const queryTerm = plantContext?.commonName || plantContext?.scientificName || lastUserMessage;
    const ecoMatches = await searchLocalEcoKnowledge(queryTerm);
    const localMatch = searchLocalKnowledge(queryTerm);

    // Retrieve User Plant Twin & History Context from IndexedDB (Phase 9)
    let userGardenContext = "";
    try {
      const userPlants = await getAllRecords<PlantRecord>("plants");
      const matchedUserPlant = userPlants.find(p => 
        queryTerm.toLowerCase().includes(p.nickname.toLowerCase()) ||
        queryTerm.toLowerCase().includes(p.commonName.toLowerCase()) ||
        queryTerm.toLowerCase().includes((p.scientificName || "").toLowerCase())
      );

      if (matchedUserPlant) {
        const scans = await getAllRecords("plant_scans");
        const plantScans = scans.filter((s: any) => s.plantId === matchedUserPlant.id || s.commonName === matchedUserPlant.commonName);
        const latestScan = plantScans[plantScans.length - 1];

        const checkIns = await getAllRecords("check_ins");
        const plantCheckIns = checkIns.filter((c: any) => c.plantId === matchedUserPlant.id);
        const latestCheckIn = plantCheckIns[plantCheckIns.length - 1];

        const sensors = await getAllRecords("sensor_history");
        const latestSensor = sensors[sensors.length - 1];

        userGardenContext = `
User Garden Plant Twin History for "${matchedUserPlant.nickname}" (${matchedUserPlant.commonName}):
- Health Status: ${matchedUserPlant.status}, Health Score: ${matchedUserPlant.healthScore}%
- Location: ${matchedUserPlant.location || 'Indoor Garden'}
- Notes: ${matchedUserPlant.notes || 'No recent notes'}
${latestScan ? `- Latest Scan Result: Identified as ${latestScan.commonName || matchedUserPlant.commonName} (Health Score: ${latestScan.healthScore || latestScan.confidence}%)` : ''}
${latestCheckIn ? `- Latest Check-in Notes: ${latestCheckIn.notes || 'Checked'} (Watered: ${latestCheckIn.watered ? 'Yes' : 'No'})` : ''}
${latestSensor ? `- EcoSense IoT Readings: Temp: ${latestSensor.temperature}°C, Moisture: ${latestSensor.moisture}%, Humidity: ${latestSensor.humidity}%` : ''}
`;
      }
    } catch (dbErr) {
      console.warn("RAG User garden state query error:", dbErr);
    }
    
    // Detect Multilingual Tamil / Tanglish keywords
    const isTanglishOrTamil = /thanni|water|leaf|maram|sedi|spray|poochi|sunlight|soil|pot|man/i.test(lastUserMessage) && 
                             /indha|idhuku|evlo|yepdi|vanganum|venum|poodanom/i.test(lastUserMessage);

    let ragContextText = "";
    if (ecoMatches && ecoMatches.length > 0) {
      const p = ecoMatches[0];
      ragContextText = `
Verified Plant Knowledge for ${p.commonNames.join(", ")} (${p.scientificName}):
- Taxonomy: Family ${p.taxonomy.family}, Genus ${p.taxonomy.genus}, Species ${p.taxonomy.species}
- Description: ${p.description}
- Traits: Leaf Type: ${p.traits.leafType}, Venation: ${p.traits.venation}, Habit: ${p.traits.growthHabit}
- Care: Water: ${p.care.water}; Light: ${p.care.light}; Temp: ${p.care.temperature}; Soil: ${p.care.soil}
- Diseases: ${p.diseases.map(d => `${d.name} (Cause: ${d.cause}, Symptoms: ${d.symptoms.join(", ")}, Treatment: ${d.management})`).join("; ")}
- Pests: ${p.pests.map(pst => `${pst.name} (Symptoms: ${pst.symptoms.join(", ")}, Management: ${pst.management})`).join("; ")}
- Uses: Food: ${p.uses.food.join(", ")}; Medicinal: ${p.uses.medicinal.join(", ")}; Environmental: ${p.uses.environmental.join(", ")}
${userGardenContext}
`;
    } else if (localMatch) {
      ragContextText = `
Verified Plant Information for ${localMatch.commonName} (${localMatch.scientificName}):
- Family: ${localMatch.family}
- Description: ${localMatch.description}
- Care: ${localMatch.careInstructions}
- Climate & Soil: ${localMatch.habitat.climate}, Soil: ${localMatch.habitat.soil}, Water: ${localMatch.habitat.water}
- Safety: Toxicity: ${localMatch.safety.toxicity}, Edible: ${localMatch.safety.edible}, Pet Safe: ${localMatch.safety.petSafe}
- Medicinal Uses: ${localMatch.uses.medicinal.join("; ")}
- Agricultural Uses: ${localMatch.uses.agricultural.join("; ")}
${userGardenContext}
`;
    } else if (userGardenContext) {
      ragContextText = userGardenContext;
    }

    // Check Ollama status
    const ollamaStatus = await checkOllamaStatus();

    if (ollamaStatus.available) {
      console.log("[AIRouter Chat] Using Local Ollama LLM:", ollamaStatus.detectedTextModel);
      
      const systemPrompt = `You are EcoBot 🌿, an offline AI plant expert. 
Answer questions using science-based botanical facts.
${ragContextText}
${isTanglishOrTamil ? 'The user is asking in Tanglish (Tamil + English). Respond in friendly, helpful Tanglish / English.' : ''}
Guidelines:
- If insufficient verified info exists in context, state: "Insufficient verified information in local knowledge base."
- Do not translate scientific names. Keep botanical scientific names intact.`;

      const res = await generateOllamaChat(messages, systemPrompt);
      if (res.success && res.content) {
        return {
          success: true,
          data: res.content + "\n\n*(Powered by Local AI — Ollama & EcoKnowledge Engine)*",
          source: 'LOCAL_OLLAMA_AI'
        };
      }
    }

    // 3. OFFLINE KNOWLEDGE ENGINE FALLBACK (Without Ollama)
    console.log("[AIRouter Chat] Using Local Knowledge Engine Fallback");
    let fallbackAnswer = "";
    if (ecoMatches && ecoMatches.length > 0) {
      const p = ecoMatches[0];
      fallbackAnswer = `🌿 **${p.commonNames[0] || p.scientificName}** (*${p.scientificName}*)\n\n` +
        `**Family:** ${p.taxonomy.family} (${p.taxonomy.genus})\n` +
        `**Description:** ${p.description}\n\n` +
        `**Care Guidance:**\n` +
        `• Water: ${p.care.water}\n` +
        `• Light: ${p.care.light}\n` +
        `• Soil: ${p.care.soil}\n\n` +
        (p.diseases.length > 0 ? `**Common Diseases:** ${p.diseases.map(d => d.name).join(", ")}\n\n` : "") +
        `*(Retrieved from Local EcoKnowledge Engine)*`;
    } else if (localMatch) {
      fallbackAnswer = `🌿 **${localMatch.commonName}** (*${localMatch.scientificName}*)\n\n` +
        `**Care & Growth:** ${localMatch.careInstructions}\n` +
        `**Watering:** ${localMatch.habitat.water}\n` +
        `**Light Requirements:** ${localMatch.habitat.light}\n` +
        `**Safety Notice:** ${localMatch.safety.toxicity}`;
    } else {
      fallbackAnswer = `🌿 **EcoKnowledge Plant Assistant**\n\n` +
        `Currently operating in offline mode. Here are key plant care guidelines:\n` +
        `• Water when the top inch of soil feels dry.\n` +
        `• Provide bright, indirect light for optimal photosynthesis.\n` +
        `• Ensure pots have functioning bottom drainage holes.\n\n` +
        `*(Powered by Local EcoKnowledge Engine)*`;
    }

    return {
      success: true,
      data: fallbackAnswer,
      source: 'OFFLINE_KNOWLEDGE'
    };
  }
}

export const aiRouter = new AIRouter();
