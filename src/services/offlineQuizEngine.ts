import { BotanicalKnowledgeRecord } from "@/services/botanicalApi";
import { saveRecord, LearningRecord } from "@/lib/db";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  fieldTested: string;
}

export interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
}

export function generateOfflinePlantQuiz(plant: BotanicalKnowledgeRecord): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const plantName = plant.commonNames[0] || plant.scientificName;

  // Question 1: Taxonomy Family
  if (plant.taxonomy.family) {
    const wrongFamilies = ["Solanaceae", "Lamiaceae", "Araceae", "Poaceae", "Meliaceae", "Anacardiaceae", "Asparagaceae"]
      .filter(f => f !== plant.taxonomy.family)
      .slice(0, 3);
    
    const options = [plant.taxonomy.family, ...wrongFamilies].sort(() => 0.5 - Math.random());
    const correctIndex = options.indexOf(plant.taxonomy.family);

    questions.push({
      id: `q_family_${plant.id}`,
      question: `Which botanical family does ${plantName} (${plant.scientificName}) belong to?`,
      options,
      correctIndex,
      explanation: `${plantName} belongs to the family ${plant.taxonomy.family} under order ${plant.taxonomy.order || 'Plantae'}.`,
      fieldTested: "Taxonomy"
    });
  }

  // Question 2: Care / Water
  if (plant.care.water) {
    const options = [
      plant.care.water,
      "Requires constant standing water at all times",
      "Must be kept in complete darkness and watered once a year",
      "Do not water at all under any circumstances"
    ].sort(() => 0.5 - Math.random());
    const correctIndex = options.indexOf(plant.care.water);

    questions.push({
      id: `q_water_${plant.id}`,
      question: `What are the verified irrigation guidelines for ${plantName}?`,
      options,
      correctIndex,
      explanation: `Horticultural care guidance specifies: "${plant.care.water}".`,
      fieldTested: "Care Guidance"
    });
  }

  // Question 3: Leaf Morphology / Traits
  if (plant.traits.leafType) {
    const options = [
      plant.traits.leafType,
      "Needle-like evergreen spine scales",
      "Translucent aquatic submerged fronds",
      "Carnivorous pitcher traps"
    ].sort(() => 0.5 - Math.random());
    const correctIndex = options.indexOf(plant.traits.leafType);

    questions.push({
      id: `q_leaf_${plant.id}`,
      question: `What is the leaf morphology characteristic of ${plantName}?`,
      options,
      correctIndex,
      explanation: `Diagnostic trait recorded: ${plant.traits.leafType}.`,
      fieldTested: "Morphology"
    });
  }

  // Question 4: Uses
  const medicinalUse = plant.uses.medicinal[0] || plant.uses.food[0] || plant.uses.ornamental[0];
  if (medicinalUse) {
    const options = [
      medicinalUse,
      "Manufacture of synthetic rubber tires",
      "Rocket propellant fuel additive",
      "Heavy industrial steel smelting agent"
    ].sort(() => 0.5 - Math.random());
    const correctIndex = options.indexOf(medicinalUse);

    questions.push({
      id: `q_use_${plant.id}`,
      question: `Which of the following is a verified usage of ${plantName}?`,
      options,
      correctIndex,
      explanation: `Recorded usage for ${plantName}: "${medicinalUse}".`,
      fieldTested: "Plant Uses"
    });
  }

  // Question 5: Diseases / Pathology
  if (plant.diseases && plant.diseases.length > 0) {
    const diseaseName = plant.diseases[0].name;
    const options = [
      diseaseName,
      "Viral Leaf Chlorosis X",
      "Bacterial Stem Girdle Delta",
      "Fungal Crown Scorching Type 4"
    ].sort(() => 0.5 - Math.random());
    const correctIndex = options.indexOf(diseaseName);

    questions.push({
      id: `q_disease_${plant.id}`,
      question: `Which disease is known to affect ${plantName}?`,
      options,
      correctIndex,
      explanation: `${diseaseName} is caused by ${plant.diseases[0].cause}. Symptoms: ${plant.diseases[0].symptoms.join(", ")}.`,
      fieldTested: "Pathology"
    });
  }

  return questions;
}

export async function saveQuizProgress(
  plantId: string,
  mode: 'beginner' | 'student' | 'advanced' | 'research',
  score: number,
  total: number
): Promise<LearningRecord> {
  const percentage = Math.round((score / total) * 100);
  
  const record: Partial<LearningRecord> = {
    plantId,
    mode,
    sectionsViewed: ["IDENTITY", "DESCRIPTION", "TRAITS", "CARE", "DISEASES"],
    quizAttempts: [
      {
        score,
        total,
        timestamp: new Date().toISOString()
      }
    ],
    progress: percentage,
    completedAt: percentage >= 70 ? new Date().toISOString() : undefined,
    syncStatus: 'pending'
  };

  return await saveRecord("learning_records", record);
}
