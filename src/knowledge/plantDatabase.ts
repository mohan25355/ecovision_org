import { PlantIdentificationResult } from "@/lib/ai";

export interface DiseaseKnowledge {
  diseaseName: string;
  confidence: number;
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
  symptoms: string[];
  possibleCauses: string[];
  recommendedAction: string;
  chemicalTreatment: {
    activeIngredient: string;
    purpose: string;
    applicationCategory: string;
    safetyPrecautions: string[];
    preHarvestInterval?: string;
    resistanceNotes?: string;
    labelDisclaimer: string;
    source: string;
  };
  naturalTreatment: {
    culturalControl: string;
    sanitation: string;
    biologicalControl: string;
    organicOption: string;
    limitations: string;
    safetyNote: string;
    source: string;
  };
  prevention: string[];
  verificationRequired: boolean;
}

export interface DetailedPlantKnowledge extends PlantIdentificationResult {
  family: string;
  identificationFeatures: string[];
  habitat: {
    climate: string;
    soil: string;
    region: string;
    water: string;
    light: string;
    temperature: string;
  };
  pests: string[];
  diseaseDetails: DiseaseKnowledge[];
  sources: string[];
  lastVerified: string;
}

export const LOCAL_PLANT_DATABASE: DetailedPlantKnowledge[] = [
  {
    commonName: "Peace Lily",
    scientificName: "Spathiphyllum wallisii",
    family: "Araceae",
    confidence: 96,
    description: "Peace Lily is a popular indoor foliage plant known for its glossy dark green leaves and white spathe flowers. It thrives in low-light environments and acts as a natural indoor air purifier.",
    identificationFeatures: [
      "Large dark green glossy elliptical leaves",
      "Distinct central leaf vein with prominent lateral venation",
      "White spathe with central spadix flower"
    ],
    uses: {
      medicinal: [
        "Air Purification - Removes VOCs like benzene, formaldehyde, and trichloroethylene from indoor air",
        "Humidity Regulation - Increases ambient room moisture naturally",
        "Stress Reduction - Bio-centric indoor foliage reduces cortisol levels"
      ],
      agricultural: [
        "Ornamental horticulture crop",
        "Shade-adapted understory landscaping plant",
        "Hydroponic candidate for indoor water gardening"
      ],
      daily: [
        "Indoor decorative plant for homes and offices",
        "Natural air filtering bio-shield",
        "Foliage focal point for terrariums"
      ]
    },
    habitat: {
      climate: "Tropical understory, warm and humid (65°F - 85°F)",
      soil: "Well-draining, peat-rich loamy soil mix with organic compost",
      region: "Native to tropical rainforests of Central and South America",
      water: "Keep soil consistently moist but never waterlogged; water when top inch feels dry",
      light: "Medium to low indirect sunlight; avoid direct scorching rays",
      temperature: "18°C - 29°C (65°F - 85°F)"
    },
    safety: {
      toxicity: "Contains insoluble calcium oxalate crystals causing oral irritation, drooling, and difficulty swallowing if ingested.",
      edible: false,
      petSafe: false
    },
    diseases: [
      "Root Rot (Pythium / Phytophthora)",
      "Leaf Spot (Cylindrocladium / Xanthomonas)"
    ],
    pests: ["Spider Mites", "Scale Insects", "Mealybugs"],
    careInstructions: "Place in indirect light. Keep soil slightly moist. Wipe leaves monthly to remove dust and support photosynthesis.",
    diseaseDetails: [
      {
        diseaseName: "Root Rot (Pythium spp.)",
        confidence: 92,
        severity: "High",
        symptoms: ["Blackened wilting stems", "Yellowing lower leaves", "Foul odor from soil"],
        possibleCauses: ["Overwatering", "Poor soil drainage", "Contaminated pots"],
        recommendedAction: "Isolate plant, stop watering immediately, remove infected roots, and repot in fresh sterile soil.",
        chemicalTreatment: {
          activeIngredient: "Mefenoxam or Metalaxyl",
          purpose: "Systemic oomycete fungicide",
          applicationCategory: "Fungicidal drench",
          safetyPrecautions: ["Wear protective gloves and eye protection during drench", "Do not apply near food crops"],
          preHarvestInterval: "N/A (Non-edible ornamental)",
          resistanceNotes: "Rotate with Copper octanoate to reduce fungal resistance risk.",
          labelDisclaimer: "Use only according to the registered product label and local agricultural laws.",
          source: "Agricultural Extension Plant Pathology Standards"
        },
        naturalTreatment: {
          culturalControl: "Reduce irrigation frequency and allow soil medium to dry out partially between waterings.",
          sanitation: "Trim dead root tissue with sterilized shears disinfected in 70% isopropyl alcohol.",
          biologicalControl: "Incorporate Trichoderma harzianum bio-fungicide into fresh potting mix.",
          organicOption: "Apply hydrogen peroxide (3% diluted 1:4 with water) soil flush to oxygenate roots.",
          limitations: "Effective only in early to moderate stages of root decay.",
          safetyNote: "Ensure complete drainage to prevent re-infection.",
          source: "Organic Horticulture Care Manual"
        },
        prevention: [
          "Use pots with functional bottom drainage holes",
          "Avoid letting plant sit in stagnant drainage saucer water",
          "Use well-aerated perlite potting mix"
        ],
        verificationRequired: false
      }
    ],
    sources: ["Botanical Garden Knowledge Base", "FAO Plant Pathology Database"],
    lastVerified: "2026-09-25"
  },
  {
    commonName: "Snake Plant",
    scientificName: "Dracaena trifasciata",
    family: "Asparagaceae",
    confidence: 98,
    description: "Snake Plant (Mother-in-Law's Tongue) is an extremely resilient succulent featuring upright sword-like leaves with yellow margins and horizontal green striping.",
    identificationFeatures: [
      "Rigid vertical sword-shaped fibrous leaves",
      "Dark green horizontal cross-bands and yellow outer edges",
      "Fleshy rhizomatous root structure"
    ],
    uses: {
      medicinal: [
        "Nighttime Oxygen Release - Converts CO2 to O2 during nighttime CAM photosynthesis",
        "Air Decontamination - Absorbs airborne toxins like Xylene and Toluene",
        "Traditional Topical Gel - Leaf sap historically applied for minor skin abrasions"
      ],
      agricultural: [
        "Arid landscape border foliage",
        "Fibre crop for traditional rope weaving",
        "Low-water drought-tolerant xeriscaping"
      ],
      daily: [
        "Low-maintenance indoor bedroom plant",
        "Natural air refresher",
        "Architectural interior greenery"
      ]
    },
    habitat: {
      climate: "Arid and tropical dry climates",
      soil: "Cactus / succulent potting mix with coarse sand and pumice",
      region: "Native to Tropical West Africa from Nigeria east to the Congo",
      water: "Low water requirements; allow soil to dry completely between waterings",
      light: "Tolerates low light to bright indirect sun",
      temperature: "21°C - 32°C (70°F - 90°F)"
    },
    safety: {
      toxicity: "Contains saponins which cause mild nausea, vomiting, and diarrhea in dogs and cats if chewed.",
      edible: false,
      petSafe: false
    },
    diseases: ["Red Leaf Spot (Drechslera)", "Rhizoctonia Web Blight"],
    pests: ["Mealybugs", "Vine Weevils"],
    careInstructions: "Water sparingly every 2-3 weeks in summer, less in winter. Do not overwater.",
    diseaseDetails: [
      {
        diseaseName: "Red Leaf Spot (Drechslera spp.)",
        confidence: 89,
        severity: "Moderate",
        symptoms: ["Reddish-brown sunken spots on leaves", "Yellow halo around lesions", "Leaf decay"],
        possibleCauses: ["Excessive foliage wetness", "High atmospheric humidity", "Poor air movement"],
        recommendedAction: "Keep leaves dry when watering. Prune off heavily spotty leaves.",
        chemicalTreatment: {
          activeIngredient: "Chlorothalonil or Copper Hydroxide",
          purpose: "Broad spectrum contact fungicide",
          applicationCategory: "Foliar spray",
          safetyPrecautions: ["Avoid inhaling spray mist", "Wear long sleeves and eye protection"],
          labelDisclaimer: "Use only according to registered product label guidance.",
          source: "University Extension Horticultural Diagnostic Guide"
        },
        naturalTreatment: {
          culturalControl: "Water strictly at soil base; avoid overhead sprinkling.",
          sanitation: "Remove infected leaf blades cleanly at root crown level.",
          biologicalControl: "Apply Bacillus subtilis bio-fungicide foliar rinse.",
          organicOption: "Spritz with diluted neem oil spray (1 tsp neem oil + 1/2 tsp mild soap per liter water).",
          limitations: "Neem spray halts spore spread but will not clear existing lesions.",
          safetyNote: "Do not apply neem spray under direct burning sun.",
          source: "Bio-Control Plant Protection Journal"
        },
        prevention: [
          "Ensure adequate air ventilation around foliage",
          "Keep leaf surfaces dry",
          "Space pots properly"
        ],
        verificationRequired: false
      }
    ],
    sources: ["International Succulent Research Index", "Royal Botanical Society"],
    lastVerified: "2026-09-25"
  },
  {
    commonName: "Monstera",
    scientificName: "Monstera deliciosa",
    family: "Araceae",
    confidence: 95,
    description: "Monstera deliciosa (Swiss Cheese Plant) is a iconic tropical vine famous for its wide heart-shaped leaves with natural perforations (fenestrations).",
    identificationFeatures: [
      "Large perforated deeply cut leaves (fenestrations)",
      "Thick aerial roots extending from stem nodes",
      "Vigorous climbing vine habit"
    ],
    uses: {
      medicinal: [
        "Traditional Root Infusions - Aerial root extracts traditionally used in Central America for joint relief",
        "Air Cleansing - Large surface area traps airborne particulate matter",
        "Biophilic Wellness - Enhances room aesthetic and psychological tranquility"
      ],
      agricultural: [
        "Edible fruit crop in native tropical zones (must be fully ripe)",
        "Shade conservatory climber",
        "Exported cut foliage crop for floristry"
      ],
      daily: [
        "Interior design focal plant",
        "Cut leaf vase arrangements",
        "Vertical climbing garden accent"
      ]
    },
    habitat: {
      climate: "Humid tropical rainforest",
      soil: "Rich organic peat moss potting mix with orchid bark and perlite",
      region: "Native to southern Mexico and Panama",
      water: "Water when upper 2-3 inches of soil become dry",
      light: "Bright indirect light for optimum fenestration growth",
      temperature: "20°C - 30°C (68°F - 86°F)"
    },
    safety: {
      toxicity: "Unripe fruit and foliage contain calcium oxalates. Causes intense burning in mouth/throat.",
      edible: false, // foliage non edible; fruit edible only when mature
      petSafe: false
    },
    diseases: ["Bacterial Leaf Spot (Pseudomonas)", "Powdery Mildew"],
    pests: ["Thrips", "Spider Mites", "Scale"],
    careInstructions: "Provide a moss pole for climbing. Mist foliage occasionally or use a humidifier.",
    diseaseDetails: [
      {
        diseaseName: "Powdery Mildew (Erysiphe spp.)",
        confidence: 94,
        severity: "Moderate",
        symptoms: ["Dusty white powdery coating on leaf surface", "Curling leaf edges", "Stunted leaf growth"],
        possibleCauses: ["High relative humidity with stagnant air", "Shady humid conditions"],
        recommendedAction: "Wipe down leaves with dilute neem solution and move to bright well-ventilated location.",
        chemicalTreatment: {
          activeIngredient: "Myclobutanil or Sulfur dust",
          purpose: "Eradicant systemic fungicide",
          applicationCategory: "Foliar fungicide",
          safetyPrecautions: ["Use outdoors or in well-ventilated space", "Wear protective gloves"],
          labelDisclaimer: "Follow registered manufacturer product label directions.",
          source: "Horticultural Fungal Pathology Index"
        },
        naturalTreatment: {
          culturalControl: "Increase ambient air circulation with a small fan.",
          sanitation: "Wipe down dusty leaves with damp microfiber cloth.",
          biologicalControl: "Apply Ampelomyces quisqualis hyperparasitic fungal treatment.",
          organicOption: "Spray potassium bicarbonate solution (1 tbsp potassium bicarbonate + 1/2 tsp liquid soap per gallon water).",
          limitations: "Requires repeated weekly applications.",
          safetyNote: "Test spray on single leaf 24 hours prior to full plant application.",
          source: "Organic Botanical Care Manual"
        },
        prevention: [
          "Avoid crowding plants together",
          "Provide warm bright indirect daylight",
          "Prune dense inner foliage"
        ],
        verificationRequired: false
      }
    ],
    sources: ["Tropical Plant Taxonomy Manual", "Royal Horticultural Society"],
    lastVerified: "2026-09-25"
  },
  {
    commonName: "Neem",
    scientificName: "Azadirachta indica",
    family: "Meliaceae",
    confidence: 97,
    description: "Neem is a renowned medicinal tree native to the Indian subcontinent. Highly revered for its antifungal, antibacterial, and natural pesticide properties.",
    identificationFeatures: [
      "Pinnate compound leaves with 20-30 serrated lanceolate leaflets",
      "Bitter pungent aroma when crushed",
      "Small white fragrant star-shaped flowers"
    ],
    uses: {
      medicinal: [
        "Antimicrobial Sap & Oil - Azadirachtin compound fights skin infections, acne, and fungi",
        "Ayurvedic Herbal Decoction - Traditional blood cleanser and immunity tonic",
        "Dental Hygiene - Neem twigs traditionally used as natural antibacterial toothbrushes"
      ],
      agricultural: [
        "Organic Bio-Pesticide - Cold-pressed neem oil disrupts insect hormone cycles",
        "Neem Cake Fertilizer - Organic soil amendment rich in nitrogen and organic matter",
        "Nematode Control - Reduces soil-borne parasitic nematodes"
      ],
      daily: [
        "Natural mosquito and insect repellent",
        "Herbal soap and skincare ingredient",
        "Organic garden pest control"
      ]
    },
    habitat: {
      climate: "Subtropical and tropical arid to semi-arid regions",
      soil: "Well-draining sandy loam or rocky soil; highly drought tolerant",
      region: "Native to India, Sri Lanka, and Southeast Asia",
      water: "Low water requirements once established; drought hardy",
      light: "Full direct sun",
      temperature: "25°C - 40°C (77°F - 104°F)"
    },
    safety: {
      toxicity: "Safe for external application; high dose internal neem oil ingestion by infants or pregnant women is contra-indicated.",
      edible: true, // tender leaves cooked in small quantities in traditional recipes
      petSafe: true
    },
    diseases: ["Tip Rot (Fusarium)", "Powdery Mildew"],
    pests: ["Tea Mosquito Bug", "Scale insects"],
    careInstructions: "Provide maximum sunlight. Water sparingly once established.",
    diseaseDetails: [],
    sources: ["Indian Council of Agricultural Research", "Ayurvedic Pharmacopoeia"],
    lastVerified: "2026-09-25"
  },
  {
    commonName: "Holy Basil / Tulsi",
    scientificName: "Ocimum tenuiflorum",
    family: "Lamiaceae",
    confidence: 99,
    description: "Tulsi (Holy Basil) is a sacred medicinal aromatic herb cultivated across South Asia for adaptogenic health benefits, herbal teas, and ritual significance.",
    identificationFeatures: [
      "Aromatic elliptical leaves with finely serrated edges",
      "Square hairy green or purple-tinged stems",
      "Terminal whorled purple/pink flower spikes"
    ],
    uses: {
      medicinal: [
        "Adaptogen Herbal Tea - Helps body adapt to mental and physical stress",
        "Respiratory Support - Relieves cough, congestion, and bronchial asthma symptoms",
        "Immunomodulator - Rich in Eugenol, Ursolic acid, and antioxidants"
      ],
      agricultural: [
        "Companion Crop - Repels garden aphids, mosquitoes, and beetles",
        "Pollinator Magnet - Flowers attract honeybees and beneficial insects",
        "Essential Oil Production - Distilled for aromatic eugenol oil"
      ],
      daily: [
        "Morning herbal infusion",
        "Air purification and aromatic enhancement",
        "Traditional culinary herb"
      ]
    },
    habitat: {
      climate: "Warm tropical and subtropical climate",
      soil: "Fertile, rich, porous soil with good organic compost content",
      region: "Native to the Indian subcontinent",
      water: "Water daily in hot months; keep soil moist but not waterlogged",
      light: "Full morning sunlight (minimum 4-6 hours)",
      temperature: "20°C - 35°C (68°F - 95°F)"
    },
    safety: {
      toxicity: "Non-toxic and safe for consumption.",
      edible: true,
      petSafe: true
    },
    diseases: ["Downy Mildew (Peronospora sp.)", "Leaf Spot"],
    pests: ["Aphids", "Whiteflies"],
    careInstructions: "Pinch flower buds regularly to encourage bushy foliage growth.",
    diseaseDetails: [],
    sources: ["National Institute of Ayurvedic Medicine", "ICAR Herbal Database"],
    lastVerified: "2026-09-25"
  }
];

export function searchLocalKnowledge(query: string): DetailedPlantKnowledge | null {
  if (!query) return null;
  const clean = query.toLowerCase().trim();
  
  return LOCAL_PLANT_DATABASE.find((p) => 
    p.commonName.toLowerCase().includes(clean) ||
    p.scientificName.toLowerCase().includes(clean) ||
    clean.includes(p.commonName.toLowerCase()) ||
    clean.includes(p.scientificName.toLowerCase())
  ) || null;
}
