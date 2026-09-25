// Plant Health Knowledge Base: Structured Nutrient Deficiencies and Plant Stress Types

export interface NutrientDeficiencyRecord {
  id: string;
  name: string;
  chemicalSymbol: string;
  roleInPlant: string;
  symptoms: string[];
  affectedParts: 'older_leaves' | 'younger_leaves' | 'entire_plant' | 'stems_roots';
  visualPattern: string;
  commonCauses: string[];
  lookAlikes: string[];
  management: string;
  source: string;
}

export interface PlantStressRecord {
  id: string;
  name: string;
  category: 'Abiotic' | 'Environmental' | 'Mechanical';
  symptoms: string[];
  visualSigns: string[];
  causes: string[];
  prevention: string[];
  management: string;
  source: string;
}

export const NUTRIENT_DEFICIENCY_KNOWLEDGE: NutrientDeficiencyRecord[] = [
  {
    id: "nitrogen-deficiency",
    name: "Nitrogen Deficiency",
    chemicalSymbol: "N",
    roleInPlant: "Essential for chlorophyll synthesis, protein formation, and vegetative foliage growth.",
    symptoms: [
      "General pale green to yellow chlorosis starting on older lower leaves",
      "Stunted overall plant growth and slender stems",
      "Early leaf senescence and drop"
    ],
    affectedParts: "older_leaves",
    visualPattern: "V-shaped chlorosis extending from leaf tips along midrib on mature foliage.",
    commonCauses: [
      "Low soil organic matter",
      "Excessive leaching from heavy rainfall or overwatering",
      "Cold soil temperatures slowing microbial mineralization"
    ],
    lookAlikes: ["Sulfur Deficiency (affects younger leaves first)", "Root Rot / Overwatering"],
    management: "Incorporate organic compost, well-rotted manure, or balanced nitrogen fertilizer.",
    source: "Kew Botanical Agriculture & Plant Nutrition Archive"
  },
  {
    id: "phosphorus-deficiency",
    name: "Phosphorus Deficiency",
    chemicalSymbol: "P",
    roleInPlant: "Vital for energy transfer (ATP), root development, flowering, and seed production.",
    symptoms: [
      "Dark green foliage turning reddish-purple or bronze under leaves",
      "Delayed root development and delayed flowering",
      "Stunted growth with thin dark stems"
    ],
    affectedParts: "older_leaves",
    visualPattern: "Purple or bronzed anthocyanin accumulation along leaf veins and petioles.",
    commonCauses: [
      "Cold, wet soils restricting root uptake",
      "Soil pH below 6.0 or above 7.5 binding phosphorus",
      "Compacted root zone"
    ],
    lookAlikes: ["Cold Stress", "Viral Infections"],
    management: "Apply bone meal, rock phosphate, or organic compost; ensure soil pH between 6.0-7.0.",
    source: "Royal Horticultural Society Soil & Plant Health Index"
  },
  {
    id: "potassium-deficiency",
    name: "Potassium Deficiency",
    chemicalSymbol: "K",
    roleInPlant: "Regulates stomatal opening, osmotic water pressure, disease resistance, and enzyme activation.",
    symptoms: [
      "Marginal leaf scorch (browning and drying of leaf edges)",
      "Interveinal chlorosis followed by necrotic spots",
      "Weak stems prone to lodging and reduced pest resistance"
    ],
    affectedParts: "older_leaves",
    visualPattern: "Yellowing edges drying out into brown scorched margins with green midrib.",
    commonCauses: [
      "Highly leached sandy soils",
      "Excessive calcium or magnesium competing for uptake",
      "Drought conditions"
    ],
    lookAlikes: ["Salt Scorch", "Drought / Heat Stress"],
    management: "Incorporate wood ash, kelp meal, or potassium sulfate.",
    source: "FAO Plant Nutrition & Crop Diagnostics"
  },
  {
    id: "magnesium-deficiency",
    name: "Magnesium Deficiency",
    chemicalSymbol: "Mg",
    roleInPlant: "Central atom of the chlorophyll molecule, essential for photosynthesis.",
    symptoms: [
      "Striking interveinal chlorosis on older leaves",
      "Green inverted V-pattern remaining around major veins while leaf blades yellow",
      "Premature leaf drop"
    ],
    affectedParts: "older_leaves",
    visualPattern: "Yellowing between green leaf veins creating vivid contrast.",
    commonCauses: [
      "Acidic sandy soils (pH < 5.5)",
      "High potassium or ammonium fertilizing blocking magnesium uptake",
      "Heavy rainfall leaching"
    ],
    lookAlikes: ["Iron Deficiency (affects young leaves)", "Zinc Deficiency"],
    management: "Apply Epsom salt (magnesium sulfate) spray or dolomitic limestone to low pH soils.",
    source: "Botanical Research & Agriculture Diagnostic Manual"
  },
  {
    id: "iron-deficiency",
    name: "Iron Deficiency",
    chemicalSymbol: "Fe",
    roleInPlant: "Catalyst for chlorophyll synthesis and electron transport in photosynthesis.",
    symptoms: [
      "Severe interveinal chlorosis on newly emerging young leaves",
      "Young leaves turn bright yellow or ivory white with sharp green veins",
      "Stunted shoot tip growth"
    ],
    affectedParts: "younger_leaves",
    visualPattern: "Vivid yellow to white young leaf blades contrasting with dark green vein network.",
    commonCauses: [
      "High soil pH (alkaline soils pH > 7.5)",
      "Waterlogged, oxygen-deprived soil",
      "Excessive soil phosphorus"
    ],
    lookAlikes: ["Manganese Deficiency", "Magnesium Deficiency"],
    management: "Apply chelated iron (Fe-EDDHA or Fe-EDTA) and adjust soil pH toward acidic range (6.0-6.5).",
    source: "USDA Plant Physiology & Soil Diagnostics"
  },
  {
    id: "calcium-deficiency",
    name: "Calcium Deficiency",
    chemicalSymbol: "Ca",
    roleInPlant: "Structural component of cell walls (calcium pectate) and membrane stability.",
    symptoms: [
      "Blossom end rot in fruiting vegetables (tomatoes, peppers)",
      "Distorted, cup-shaped, or hooked young leaves with necrotic tips",
      "Death of growing apical meristems"
    ],
    affectedParts: "younger_leaves",
    visualPattern: "Curled, crinkled young leaf margins with black necrotic tip rot.",
    commonCauses: [
      "Irregular soil moisture / uneven watering",
      "High humidity restricting transpiration water flow",
      "Acidic soil (pH < 5.5)"
    ],
    lookAlikes: ["Boron Deficiency", "Tip Burn"],
    management: "Maintain consistent soil watering; apply gypsum or agricultural lime to acidic soils.",
    source: "University Botanical Extension & Crop Diagnostics"
  },
  {
    id: "zinc-deficiency",
    name: "Zinc Deficiency",
    chemicalSymbol: "Zn",
    roleInPlant: "Crucial for auxin hormone synthesis, stem elongation, and enzyme activity.",
    symptoms: [
      "Little leaf disease (severely reduced, bunched young leaves)",
      "Shortened internodes producing a rosette growth habit",
      "Interveinal chlorosis on middle to young leaves"
    ],
    affectedParts: "younger_leaves",
    visualPattern: "Mottled yellow spots between veins with stunted, small leaves.",
    commonCauses: [
      "High soil pH (alkaline soils)",
      "Excessive phosphorus fertilizer application",
      "Cool wet spring soils"
    ],
    lookAlikes: ["Little Leaf Virus", "Iron Deficiency"],
    management: "Foliar application of zinc sulfate or chelated zinc.",
    source: "International Agronomy Institute Knowledge Base"
  },
  {
    id: "sulfur-deficiency",
    name: "Sulfur Deficiency",
    chemicalSymbol: "S",
    roleInPlant: "Required for essential amino acids (methionine, cysteine) and nodule formation in legumes.",
    symptoms: [
      "Uniform pale yellowing starting on young leaves",
      "Stems become thin, brittle, and erect",
      "Delayed crop maturity"
    ],
    affectedParts: "younger_leaves",
    visualPattern: "Uniform light yellowing across entire young leaf blade including veins.",
    commonCauses: [
      "Low soil organic matter",
      "Sandy soils subject to heavy leaching",
      "Lack of sulfur additives in modern fertilizers"
    ],
    lookAlikes: ["Nitrogen Deficiency (affects older leaves first)"],
    management: "Apply elemental sulfur, gypsum (calcium sulfate), or organic compost.",
    source: "Global Crop Nutrition & Botanical Index"
  },
  {
    id: "boron-deficiency",
    name: "Boron Deficiency",
    chemicalSymbol: "B",
    roleInPlant: "Essential for cell division, pollen tube growth, seed set, and sugar translocation.",
    symptoms: [
      "Brittle, thickened, hollow stems and petioles",
      "Death of terminal growing buds producing bushy lateral shoots",
      "Poor fruit set, internal corking, or cracked fruits"
    ],
    affectedParts: "younger_leaves",
    visualPattern: "Distorted growing tips with cracked, corky brown petioles.",
    commonCauses: [
      "Sandy soils low in organic matter",
      "High soil pH following over-liming",
      "Drought conditions"
    ],
    lookAlikes: ["Calcium Deficiency", "Herbicide Injury"],
    management: "Apply solubor or borax at precise, low concentrations; avoid over-application.",
    source: "Botanical Micronutrient Diagnostic Guide"
  },
  {
    id: "manganese-deficiency",
    name: "Manganese Deficiency",
    chemicalSymbol: "Mn",
    roleInPlant: "Involved in water-splitting reaction of photosynthesis and nitrogen assimilation.",
    symptoms: [
      "Interveinal chlorosis on young to middle leaves with checkboard pattern",
      "Small gray or brown necrotic specks developing in yellowed zones",
      "Reduced root growth and stunted shoots"
    ],
    affectedParts: "younger_leaves",
    visualPattern: "Fine grid-like interveinal chlorosis with brown sunken spots.",
    commonCauses: [
      "High soil pH (pH > 7.0)",
      "High organic matter soils (muck soils)",
      "Poorly drained, compacted soil"
    ],
    lookAlikes: ["Iron Deficiency", "Magnesium Deficiency"],
    management: "Foliar spray of manganese sulfate; lower soil pH with elemental sulfur.",
    source: "Royal Botanic Gardens Horticultural Physiology"
  }
];

export const PLANT_STRESS_KNOWLEDGE: PlantStressRecord[] = [
  {
    id: "water-stress",
    name: "Water Stress (Drought / Overwatering)",
    category: "Abiotic",
    symptoms: [
      "Underwatering: Wilting, dull papery leaf drop, crisp brown leaf margins",
      "Overwatering: Soft yellowing leaves, mushy stems, soil foul odor, root rot"
    ],
    visualSigns: [
      "Foliage droop with dry soil (Drought)",
      "Yellowing leaves with soggy saturated soil (Overwatering)"
    ],
    causes: [
      "Infrequent irrigation or hydrophobic dry soil mix",
      "Poor pot drainage or standing water in saucers"
    ],
    prevention: [
      "Check soil moisture 2 inches below surface before watering",
      "Ensure pots have bottom drainage holes"
    ],
    management: "Adjust watering schedule based on moisture readings; prune decayed roots if rotted.",
    source: "EcoVision Agricultural Hygiene Standards"
  },
  {
    id: "heat-stress",
    name: "Heat Stress",
    category: "Environmental",
    symptoms: [
      "Leaf rolling, cupping, or curling to reduce surface exposure",
      "Sunscald bleaching on leaves exposed to intense afternoon sun",
      "Blossom and fruit drop"
    ],
    visualSigns: [
      "Bleached white/yellow dry patches on top foliage",
      "Inward leaf curling during peak afternoon hours"
    ],
    causes: [
      "Ambient temperatures exceeding plant tolerance threshold (>35°C)",
      "High intense direct solar radiation without acclimation"
    ],
    prevention: [
      "Provide 30-50% shade cloth cover during peak heat",
      "Apply organic straw mulch to keep root zone cool"
    ],
    management: "Move container plants to partial shade; maintain soil moisture; mist foliage.",
    source: "Subtropical Agronomy & Shade Management"
  },
  {
    id: "cold-stress",
    name: "Cold & Frost Stress",
    category: "Environmental",
    symptoms: [
      "Water-soaked dark green or black limp foliage following frost",
      "Leaf discoloration turning bronze, red, or white",
      "Stem splitting and tip dieback"
    ],
    visualSigns: [
      "Limp, blackened, water-soaked foliage after low temperature drops"
    ],
    causes: [
      "Unprotected exposure to temperatures below minimum frost tolerance (<10°C / <0°C)"
    ],
    prevention: [
      "Cover plants with frost cloth or burlap blankets overnight",
      "Bring potted tropicals indoors before cold fronts"
    ],
    management: "Wait until warm spring weather before pruning damaged dead tissue to protect underlying buds.",
    source: "Horticultural Cold Hardiness & Protection Guide"
  },
  {
    id: "light-stress",
    name: "Light Stress (Sunburn / Etiolation)",
    category: "Environmental",
    symptoms: [
      "Low Light: Spindly stretched stems (etiolation), pale foliage, slow growth",
      "Excess Light: Bleached white or brown scorched patches on leaves"
    ],
    visualSigns: [
      "Elongated stem internodes reaching toward light source",
      "Crisp brown dead spots on light-facing leaf surfaces"
    ],
    causes: [
      "Placement in dark interior rooms without grow lights",
      "Sudden move from shade to harsh direct afternoon sunlight"
    ],
    prevention: [
      "Gradually acclimate indoor plants to bright light over 7-14 days",
      "Match plant species light requirement (Full sun vs indirect shade)"
    ],
    management: "Relocate plant to appropriate light zone; supplement low light with full-spectrum LED grow lamps.",
    source: "Indoor Botanical Lighting & Photobiology Archive"
  },
  {
    id: "nutrient-stress",
    name: "Nutrient Stress (Toxicity / Imbalance)",
    category: "Abiotic",
    symptoms: [
      "Fertilizer Burn: White crust on soil surface, dark brown crispy leaf tips",
      "pH Imbalance: Multiple simultaneous chlorosis symptoms due to nutrient lockup"
    ],
    visualSigns: [
      "Salt crust on pot rim; tip necrosis on foliage"
    ],
    causes: [
      "Over-application of concentrated chemical fertilizers",
      "Extreme soil pH locking up essential elements"
    ],
    prevention: [
      "Dilute liquid fertilizers to half strength",
      "Test soil pH annually"
    ],
    management: "Flush soil thoroughly with clean water to leach excess salts; adjust soil pH.",
    source: "Soil Science & Nutrient Balance Guidelines"
  },
  {
    id: "salinity-stress",
    name: "Salinity Stress",
    category: "Abiotic",
    symptoms: [
      "Stunted growth and dark blue-green foliage",
      "Leaf margin scorch and premature leaf drop",
      "Wilting even when soil is moist"
    ],
    visualSigns: [
      "White crystalline salt rings on soil surface and pot clay walls"
    ],
    causes: [
      "Saline irrigation water or heavy mineral fertilizer buildup"
    ],
    prevention: [
      "Use rainwater, distilled water, or reverse osmosis water",
      "Repot annually with fresh substrate"
    ],
    management: "Flush potting container with 3x volume of low-salt water until thorough drainage occurs.",
    source: "Irrigation Water Quality & Salinity Research"
  },
  {
    id: "transplant-shock",
    name: "Transplant Shock",
    category: "Mechanical",
    symptoms: [
      "Immediate drooping or wilting after repotting or root disturbance",
      "Yellowing and drop of lower foliage",
      "Temporary cessation of new shoot growth"
    ],
    visualSigns: [
      "Widespread foliage droop within 24-48 hours of repotting"
    ],
    causes: [
      "Root tearing, air pockets around root ball, or sudden environmental shift"
    ],
    prevention: [
      "Keep root ball intact during repotting; water thoroughly immediately after repotting",
      "Keep newly repotted plant in gentle shade for 5-7 days"
    ],
    management: "Maintain high humidity; keep out of harsh direct sun; avoid fertilizing until new growth emerges.",
    source: "Horticultural Nursery Propagation Manual"
  },
  {
    id: "physical-damage",
    name: "Physical / Wind Damage",
    category: "Mechanical",
    symptoms: [
      "Torn, shredded, or bruised leaf blades",
      "Snapped stems or damaged leaf petioles",
      "Scuffed bark or pet damage"
    ],
    visualSigns: [
      "Irregular mechanical tears and calloused brown wound edges"
    ],
    causes: [
      "High wind gusts, heavy hail, pet chewing, or garden tool impacts"
    ],
    prevention: [
      "Stake tall flexible stems; position fragile plants away from strong wind corridors"
    ],
    management: "Cleanly prune broken stems using sanitized shears to foster clean callousing.",
    source: "Plant Pathology & Mechanical Wound Repair"
  }
];
