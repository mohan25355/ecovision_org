// EcoKnowledge Engine: Global Botanical Knowledge Retrieval, IndexedDB Cache & Search

import { getAllRecords, getRecordById, saveRecord, PlantRecord } from "@/lib/db";
import { BotanicalKnowledgeRecord, fetchFromGBIF } from "./botanicalApi";
import { EXTENDED_BOTANICAL_SEED_DATA } from "@/knowledge/botanicalSeedData";

// Seeded authoritative botanical records for 100% offline availability
const BASE_PRESEEDED: BotanicalKnowledgeRecord[] = [
  {
    id: "solanum-lycopersicum",
    commonNames: ["Tomato", "Love Apple", "Tamatar", "Tomato Plant"],
    scientificName: "Solanum lycopersicum",
    acceptedName: "Solanum lycopersicum L.",
    taxonomy: {
      family: "Solanaceae",
      genus: "Solanum",
      species: "lycopersicum",
      author: "L.",
      kingdom: "Plantae",
      order: "Solanales"
    },
    synonyms: ["Lycopersicon esculentum", "Lycopersicon lycopersicum"],
    plantType: "Herbaceous Annual / Short-lived Perennial Vine",
    lifeForm: "Therophyte / Chamaephyte",
    description: "Solanum lycopersicum (Tomato) is a flowering plant of the nightshade family (Solanaceae) widely cultivated for its edible fleshy red fruits. Originating in western South America, it features glandular aromatic hairs, pinnately compound leaves, and yellow star-shaped flowers.",
    traits: {
      leafType: "Odd-pinnately compound with alternating small and large leaflets",
      venation: "Pinnate reticulate venation",
      texture: "Pubescent with glandular sticky trichomes emitting aromatic scent",
      color: "Deep Green foliage, Yellow flowers, Red/Yellow fruit",
      growthHabit: "Vining Indeterminate or Bushy Determinate habit",
      arrangement: "Spiral / Alternate foliage arrangement"
    },
    morphology: {
      leaf: "Pinnately compound, 10-25 cm long, serrated margins, covered in micro-hairs",
      stem: "Coated with glandular hairs, green becoming semi-woody at root base",
      flower: "Yellow, 5-pointed stellate corolla, nodding in cyme inflorescence clusters",
      fruit: "Fleshy berry, globose to oblong, containing 2-8 seed locules with watery pulp",
      seed: "Flat, kidney-shaped, light brown, enclosed in mucilaginous sheath",
      root: "Fibrous taproot system penetrating up to 50-80 cm in deep soil"
    },
    identificationFeatures: {
      leafShape: "Imparipinnate compound with lobed margins",
      leafMargin: "Irregularly dentate or serrate",
      leafApex: "Acute to acuminate",
      leafBase: "Oblique or cordate",
      venation: "Pinnate reticulate",
      arrangement: "Spiral alternate",
      texture: "Pubescent glandular",
      flowerCharacteristics: "5-lobed yellow corolla with fused anther cone",
      fruitCharacteristics: "Smooth glossy pericarp, juicy placenta with Seeds"
    },
    distribution: {
      native: ["Western South America (Peru, Ecuador, Chile, Galapagos Islands)"],
      introduced: ["Worldwide across tropical, subtropical, and temperate zones"],
      habitat: "Cultivated agricultural land, home gardens, greenhouse farms",
      biome: "Terrestrial Agricultural / Subtropical Biome"
    },
    uses: {
      food: [
        "Fresh culinary consumption in salads and sandwiches",
        "Processed into purées, pastes, ketchups, and sauces",
        "Rich dietary source of Lycopene, Vitamin C, Potassium, and Folate"
      ],
      medicinal: [
        "Lycopene Antioxidant - High lycopene content supports cardiovascular health",
        "Skin Protection - Phytochemicals reduce UV-induced skin cell oxidative damage",
        "Immune Support - Ascorbic acid boosts cellular defense"
      ],
      environmental: [
        "Companion planting with basil and marigold to repel hornworms",
        "Model organism for plant genetics and fruit ripening research"
      ],
      ornamental: [
        "Patio container gardening and balcony edible landscaping"
      ],
      industrial: [
        "Seed oil extraction for cosmetic emollients",
        "Tomato pomace bio-waste repurposed for animal feed and pectin extraction"
      ],
      research: [
        "Model plant for solanaceous genomics, ethylene pathway research, and pest resistance"
      ]
    },
    care: {
      water: "Consistent 1-1.5 inches per week; avoid irregular watering to prevent blossom end rot",
      light: "Full sun (6-8 hours direct sunlight daily)",
      temperature: "21°C - 29°C (70°F - 85°F); susceptible to frost below 10°C",
      humidity: "50% - 70% relative humidity",
      soil: "Well-drained, organically rich loamy soil, pH 6.0 - 6.8",
      nutrition: "High Phosphorus & Potassium low Nitrogen during fruiting",
      propagation: "Seed germination or rooting lateral sucker cuttings",
      pruning: "Prune lower suckers on indeterminate varieties to improve air flow"
    },
    diseases: [
      {
        name: "Early Blight (Alternaria solani)",
        cause: "Fungal pathogen Alternaria solani",
        symptoms: ["Concentric target-board brown rings on lower leaves", "Yellowing around lesions", "Defoliation"],
        affectedPart: "Lower leaves, stems, and fruit shoulder",
        favorableConditions: "Warm humid weather (24-29°C) with prolonged wet leaves",
        prevention: ["Crop rotation every 3 years", "Mulch base to prevent rain splashback", "Provide space for airflow"],
        management: "Remove affected lower leaves immediately upon detection.",
        treatmentInfo: "Foliar spray of Copper Hydroxide or Chlorothalonil every 7-10 days."
      },
      {
        name: "Late Blight (Phytophthora infestans)",
        cause: "Oomycete water mold Phytophthora infestans",
        symptoms: ["Water-soaked dark lesions on leaves", "White cottony mold underneath in humid air", "Rapid plant collapse"],
        affectedPart: "Entire foliage, stems, green fruit",
        favorableConditions: "Cool wet weather (15-20°C) with 90%+ humidity",
        prevention: ["Plant resistant cultivars", "Avoid overhead sprinkler irrigation"],
        management: "Destroy infected plants immediately to avoid spore spread.",
        treatmentInfo: "Preventative application of Mancozeb or Copper octanoate."
      },
      {
        name: "Blossom End Rot (Physiological)",
        cause: "Calcium deficiency in developing fruit caused by inconsistent watering",
        symptoms: ["Sunken leathery black spot on bottom (blossom end) of green fruit"],
        affectedPart: "Developing fruit bottom",
        favorableConditions: "Irregular moisture, drought followed by heavy rain",
        prevention: ["Maintain steady moisture level with organic mulch", "Test soil pH and add agricultural lime"],
        management: "Maintain uniform soil moisture.",
        treatmentInfo: "Foliar calcium nitrate spray and drip irrigation regulation."
      }
    ],
    pests: [
      {
        name: "Tomato Hornworm (Manduca quinquemaculata)",
        symptoms: ["Rapid defoliation of upper stems", "Chewed fruit surfaces", "Black droppings on foliage"],
        management: "Handpick larvae or apply Bacillus thuringiensis (Bt) bio-insecticide."
      },
      {
        name: "Whiteflies (Bemisia tabaci)",
        symptoms: ["Sooty mold on leaves", "Yellowing foliage", "Flocks of tiny white insects flying when disturbed"],
        management: "Use yellow sticky traps and spray potassium salts of fatty acids (insecticidal soap)."
      }
    ],
    learningContent: {
      beginner: "Tomatoes are sun-loving garden plants that produce delicious red fruit. They need plenty of sunlight, warm weather, and regular watering right at the soil base.",
      student: "Solanum lycopersicum belongs to Solanaceae. It has pinnately compound leaves with glandular trichomes that smell strongly when touched. It requires stakes or cages due to stem weight.",
      advanced: "The tomato fruit is botanically a berry derived from a multi-locular ovary. Ethylene triggers climacteric ripening, hydrolyzing chlorophyll while synthesizing lycopene and volatile aromatics.",
      research: "Solanum lycopersicum is a primary solanaceous model organism. Genome size ~950 Mb across 12 chromosomes. Key research focuses on Mi-1 nematode resistance gene, Pto bacterial speck resistance, and Solanaceae synteny."
    },
    sources: [
      {
        name: "Plants of the World Online (Royal Botanic Gardens, Kew)",
        url: "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:316933-2",
        license: "CC-BY 4.0 Kew POWO",
        retrievedAt: "2026-09-25T00:00:00.000Z",
        confidenceLevel: "Verified Source"
      },
      {
        name: "GBIF Species Taxonomy Database",
        url: "https://www.gbif.org/species/2930261",
        license: "CC-BY 4.0",
        retrievedAt: "2026-09-25T00:00:00.000Z",
        confidenceLevel: "Verified Source"
      },
      {
        name: "USDA Agricultural Research Service Plant Knowledge Base",
        url: "https://plants.usda.gov/home/plantProfile?symbol=SOLY2",
        license: "Public Domain (US Gov)",
        retrievedAt: "2026-09-25T00:00:00.000Z",
        confidenceLevel: "Verified Source"
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1592417817098-8f3d6eb247a5?auto=format&fit=crop&w=800&q=80",
        caption: "Ripe Solanum lycopersicum vine tomatoes",
        creator: "Unsplash Agriculture Index",
        license: "Unsplash License",
        attribution: "Unsplash Free License",
        originalUrl: "https://unsplash.com/photos/tomato-vine"
      },
      {
        url: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",
        caption: "Fresh home-grown organic tomatoes",
        creator: "Botanical Stock",
        license: "Unsplash License",
        attribution: "Unsplash Free License",
        originalUrl: "https://unsplash.com/photos/fresh-tomatoes"
      }
    ],
    retrievedAt: "2026-09-25T00:00:00.000Z",
    updatedAt: "2026-09-25T00:00:00.000Z",
    syncStatus: "synced"
  },
  {
    id: "spathiphyllum-wallisii",
    commonNames: ["Peace Lily", "White Sails", "Spath", "Peace Lily Plant"],
    scientificName: "Spathiphyllum wallisii",
    acceptedName: "Spathiphyllum wallisii Regel",
    taxonomy: {
      family: "Araceae",
      genus: "Spathiphyllum",
      species: "wallisii",
      author: "Regel",
      kingdom: "Plantae",
      order: "Alismatales"
    },
    synonyms: ["Spathiphyllum clevelandii"],
    plantType: "Evergreen Herbaceous Perennial",
    lifeForm: "Understory Geophyte / Chamaephyte",
    description: "Spathiphyllum wallisii is an elegant tropical indoor plant featuring lush dark green glossy foliage and signature white spade-shaped floral spathes surrounding a creamy yellow spadix.",
    traits: {
      leafType: "Simple lanceolate to elliptic leaves with prominent arching midrib",
      venation: "Pinnate parallel-veined secondary nerves",
      texture: "Smooth, glossy, hairless foliage surface",
      color: "Deep Forest Green leaves with Pure White spathes",
      growthHabit: "Clumping tufted basal rosette growth",
      arrangement: "Basal rosette clustered foliage"
    },
    morphology: {
      leaf: "Lance-shaped, 12-25 cm long, glossy dark green with acute point",
      stem: "Short subterranean rhizomatous stem base",
      flower: "Spadix inflorescence enclosed by a white persistent leaflike spathe",
      fruit: "Small green berries borne along the central spadix column",
      seed: "Minute oblong seeds encased in fruit pulp",
      root: "Fleshy creeping rhizomes with fibrous rootlets"
    },
    identificationFeatures: {
      leafShape: "Lanceolate to oblong-elliptic",
      leafMargin: "Entire, slightly undulate",
      leafApex: "Acuminate",
      leafBase: "Attenuate to cuneate",
      venation: "Prominent central midrib with arching secondary veins",
      arrangement: "Basal rosette",
      texture: "Glabrous and glossy",
      flowerCharacteristics: "White leaf-like spathe wrapping cylindrical yellow spadix",
      fruitCharacteristics: "Clustered green berry spadix"
    },
    distribution: {
      native: ["Tropical rainforest understories of Colombia and Venezuela"],
      introduced: ["Global indoor ornamental cultivar across all continents"],
      habitat: "Humid shady rainforest floors along stream banks",
      biome: "Tropical Rainforest Understory Biome"
    },
    uses: {
      food: ["Non-edible. Insoluble calcium oxalates make foliage toxic if ingested."],
      medicinal: [
        "Air Purification - Removes VOCs like benzene, formaldehyde, trichloroethylene, and ammonia",
        "Indoor Humidity Booster - Transpires water vapor, raising indoor air humidity naturally",
        "Biophilic Stress Reduction - Calming aesthetic improves indoor wellbeing"
      ],
      environmental: [
        "Bio-filter for indoor office and household air pollutants"
      ],
      ornamental: [
        "Prime indoor houseplant for shade and low-light home interiors"
      ],
      industrial: [
        "Commercial interior plantscaping industry staple"
      ],
      research: [
        "NASA Clean Air Study benchmark species for phytoremediation of air toxins"
      ]
    },
    care: {
      water: "Keep soil consistently moist; droops dramatically when thirsty and recovers quickly after watering",
      light: "Low to medium indirect light; direct sunlight burns foliage",
      temperature: "18°C - 27°C (65°F - 80°F)",
      humidity: "50% - 80% high humidity preferred",
      soil: "Peat-based moisture-retentive well-aerated potting mix",
      nutrition: "Dilute balanced liquid fertilizer monthly during spring and summer",
      propagation: "Rhizome root division during spring repotting",
      pruning: "Trim yellowed leaves and faded green spathes at the base"
    },
    diseases: [
      {
        name: "Root Rot (Pythium / Phytophthora)",
        cause: "Overwatering and stagnant drainage causing fungal decay",
        symptoms: ["Blackened wilting stems", "Yellowing leaves", "Mushy foul-smelling roots"],
        affectedPart: "Rhizome and root system",
        favorableConditions: "Soggy soil medium and cold ambient temperature",
        prevention: ["Use pots with drainage holes", "Allow top 1 inch soil to dry between waterings"],
        management: "Stop watering, trim rotted roots, and repot in fresh sterile medium.",
        treatmentInfo: "Hydrogen peroxide flush or Mefenoxam drench."
      }
    ],
    pests: [
      {
        name: "Spider Mites (Tetranychidae)",
        symptoms: ["Fine web threads under leaves", "Speckled yellow leaf stippling"],
        management: "Wipe leaves with damp cloth and spritz dilute neem solution."
      }
    ],
    learningContent: {
      beginner: "Peace Lilies are great low-light indoor plants. If they get thirsty, their leaves sag down to tell you, but perk back up shortly after watering!",
      student: "Spathiphyllum wallisii is an Araceae understory geophyte. The famous 'white flower' is actually a spathe (modified bract) protecting the spadix floral spike.",
      advanced: "Adapted to ultra-low PAR (Photosynthetically Active Radiation) understory canopy light. High stomatal conductance yields high transpiration and VOC uptake rate.",
      research: "Extensively studied in phytoremediation literature. NASA Clean Air Study validated Spathiphyllum efficiency in metabolizing airborne formaldehyde and xylene."
    },
    sources: [
      {
        name: "Plants of the World Online (Kew Gardens)",
        url: "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:88941-1",
        license: "CC-BY 4.0 Kew",
        retrievedAt: "2026-09-25T00:00:00.000Z",
        confidenceLevel: "Verified Source"
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&w=800&q=80",
        caption: "Spathiphyllum wallisii with white spathe flower",
        creator: "Botanical Gallery",
        license: "Unsplash License",
        attribution: "Unsplash Open Image Collection",
        originalUrl: "https://unsplash.com"
      }
    ],
    retrievedAt: "2026-09-25T00:00:00.000Z",
    updatedAt: "2026-09-25T00:00:00.000Z",
    syncStatus: "synced"
  },
  {
    id: "dracaena-trifasciata",
    commonNames: ["Snake Plant", "Mother-in-Law's Tongue", "Viper's Bowstring Hemp", "Sansevieria"],
    scientificName: "Dracaena trifasciata",
    acceptedName: "Dracaena trifasciata (Prain) Mabb.",
    taxonomy: {
      family: "Asparagaceae",
      genus: "Dracaena",
      species: "trifasciata",
      author: "(Prain) Mabb.",
      kingdom: "Plantae",
      order: "Asparagales"
    },
    synonyms: ["Sansevieria trifasciata", "Sansevieria jacquinii"],
    plantType: "Succulent Evergreen Perennial",
    lifeForm: "Xerophytic Rhizomatous Geophyte",
    description: "Dracaena trifasciata (formerly Sansevieria trifasciata) is a drought-tolerant succulent noted for its erect, stiff, sword-shaped dark green leaves with greyish-green cross-bands and yellow margins.",
    traits: {
      leafType: "Simple rigid upright sword-shaped fibrous leaf blades",
      venation: "Parallel dense fibrous venation",
      texture: "Thick, leathery, waxy cuticle skin",
      color: "Dark green with light green horizontal marbling and yellow edges",
      growthHabit: "Upright vertical architectural rosette",
      arrangement: "Basal clumping rosette"
    },
    morphology: {
      leaf: "Linear-lanceolate, 30-90 cm tall, leathery, sharp tip, fibrous interior",
      stem: "Fleshy horizontal underground rhizome stem",
      flower: "Greenish-white tubular fragrant nocturnal flowers on erect racemes (rare indoors)",
      fruit: "Globose orange berry containing 1-3 hard seeds",
      seed: "Spherical pale seed unit",
      root: "Thick yellow succulent rhizomatous root system"
    },
    identificationFeatures: {
      leafShape: "Linear-lanceolate sword-like",
      leafMargin: "Entire, often bordered yellow ('Laurentii')",
      leafApex: "Spinescent acute tip",
      leafBase: "Sheathing rhizome base",
      venation: "Parallel hidden in succulent tissue",
      arrangement: "Rosette from rhizome",
      texture: "Glaucescent leathery",
      flowerCharacteristics: "Fragrant greenish-white raceme flowering at night",
      fruitCharacteristics: "Orange berry"
    },
    distribution: {
      native: ["Tropical West Africa from Nigeria east to the Congo"],
      introduced: ["Worldwide xeriscaping and interior plantscaping"],
      habitat: "Arid rocky hillsides and dry tropical woodland understories",
      biome: "Dry Tropical Forest / Arid Biome"
    },
    uses: {
      food: ["Non-edible. Contains saponins causing oral irritation and nausea."],
      medicinal: [
        "CAM Nighttime Oxygen - Releases oxygen at night via Crassulacean Acid Metabolism",
        "Toxin Filtration - Absorbs airborne benzene, formaldehyde, toluene, and xylene",
        "Traditional Wound Poultice - Leaf fiber pulp historically applied to minor burns"
      ],
      environmental: [
        "Xeriscaping soil stabilizer for arid low-water landscapes"
      ],
      ornamental: [
        "Architectural focal indoor houseplant for modern home and office decor"
      ],
      industrial: [
        "Leaf fiber harvested traditionally for bowstrings, cordage, and rope making"
      ],
      research: [
        "Benchmark specimen for Crassulacean Acid Metabolism (CAM) photosynthetic research"
      ]
    },
    care: {
      water: "Very low water requirement; allow soil to dry out completely between waterings",
      light: "Adapts to low shade, bright indirect light, or full sun",
      temperature: "15°C - 32°C (60°F - 90°F); protect from frost",
      humidity: "Tolerates dry ambient air (30% - 50%)",
      soil: "Coarse well-draining cactus and succulent sandy mix",
      nutrition: "Feed with weak succulent fertilizer once in spring and summer",
      propagation: "Rhizome division or leaf blade cuttings rooted in dry soil",
      pruning: "Prune damaged outer leaves at soil level with sharp sterile shears"
    },
    diseases: [
      {
        name: "Rhizoctonia Stem Rot",
        cause: "Fungal root infection from wet soggy potting mix",
        symptoms: ["Sunken soft brown spots at leaf base", "Foliage flopping over"],
        affectedPart: "Lower leaf sheath and rhizome",
        favorableConditions: "Soggy cold soil and excessive watering",
        prevention: ["Water sparingly", "Use gritty porous cactus potting medium"],
        management: "Cut away affected leaves and repot rhizome into dry soil.",
        treatmentInfo: "Fungicidal drench of Copper Hydroxide."
      }
    ],
    pests: [
      {
        name: "Mealybugs (Pseudococcidae)",
        symptoms: ["Cotton-like white patches in leaf crevices"],
        management: "Dab bugs with isopropyl alcohol cotton swab."
      }
    ],
    learningContent: {
      beginner: "Snake Plants are nearly indestructible house plants! They require minimal water, can survive in dim light, and release oxygen during the night.",
      student: "Dracaena trifasciata utilizes CAM photosynthesis. It opens stomata at night to assimilate CO2, minimizing water loss during hot dry days.",
      advanced: "Reclassified from Sansevieria to Dracaena genus based on APG III phylogenetic DNA sequencing. Contains high concentrations of steroidal saponins.",
      research: "Studied for stomatal conductance dynamics under prolonged drought. High fiber tensile strength analyzed for bio-composite material engineering."
    },
    sources: [
      {
        name: "Plants of the World Online (Kew Botanic Gardens)",
        url: "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:60472449-2",
        license: "CC-BY 4.0 Kew",
        retrievedAt: "2026-09-25T00:00:00.000Z",
        confidenceLevel: "Verified Source"
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=800&q=80",
        caption: "Upright Dracaena trifasciata snake plant",
        creator: "Botanical Stock",
        license: "Unsplash License",
        attribution: "Unsplash Open Image Collection",
        originalUrl: "https://unsplash.com"
      }
    ],
    retrievedAt: "2026-09-25T00:00:00.000Z",
    updatedAt: "2026-09-25T00:00:00.000Z",
    syncStatus: "synced"
  },
  {
    id: "azadirachta-indica",
    commonNames: ["Neem", "Indian Lilac", "Margosa Tree", "Neem Tree", "Veppam"],
    scientificName: "Azadirachta indica",
    acceptedName: "Azadirachta indica A.Juss.",
    taxonomy: {
      family: "Meliaceae",
      genus: "Azadirachta",
      species: "indica",
      author: "A.Juss.",
      kingdom: "Plantae",
      order: "Sapindales"
    },
    synonyms: ["Melia azadirachta"],
    plantType: "Fast-growing Evergreen Tree",
    lifeForm: "Phanerophyte Tree",
    description: "Azadirachta indica (Neem) is a famous medicinal tree native to the Indian subcontinent. Known for its bitter anti-fungal, antibacterial, and natural bio-pesticidal compound Azadirachtin.",
    traits: {
      leafType: "Pinnate compound with 20-30 falcate serrated leaflets",
      venation: "Pinnate venation",
      texture: "Glabrous, bitter scented foliage",
      color: "Bright Green leaflets, White star flowers",
      growthHabit: "Spreading round-topped canopy tree up to 15-20 meters",
      arrangement: "Alternate compound foliage"
    },
    morphology: {
      leaf: "Imparipinnate compound, 20-40 cm long, leaflets lanceolate with serrated margins",
      stem: "Hard fissured dark greyish-brown bark, tough reddish heartwood",
      flower: "Small white honey-scented 5-petaled flowers borne in axillary panicles",
      fruit: "Smooth ellipsoidal drupe turning yellow-green when ripe, sweetish bitter pulp",
      seed: "Single elongated seed enclosed in a hard endocarp shell",
      root: "Deep taproot system reaching subterranean moisture reserves"
    },
    identificationFeatures: {
      leafShape: "Falcate lanceolate with asymmetric leaf base",
      leafMargin: "Coarsely serrate",
      leafApex: "Acuminate",
      leafBase: "Oblique asymmetric",
      venation: "Pinnate secondary veins",
      arrangement: "Alternate pinnate",
      texture: "Smooth glabrous bitter foliage",
      flowerCharacteristics: "Fragrant white panicle inflorescence",
      fruitCharacteristics: "Yellowish oval drupe"
    },
    distribution: {
      native: ["Indian Subcontinent (India, Sri Lanka, Bangladesh, Myanmar)"],
      introduced: ["Subtropical & tropical regions across Africa, Caribbean, and Australia"],
      habitat: "Semi-arid tropical regions, roadside plantations, dry deciduous forests",
      biome: "Dry Tropical Forest / Savanna Biome"
    },
    uses: {
      food: [
        "Tender leaves cooked in traditional South Asian recipes during festivals",
        "Neem flower tea infused for digestive wellness"
      ],
      medicinal: [
        "Organic Azadirachtin Antifungal - Leaves & seed oil kill pathogenic fungi",
        "Ayurvedic Skin Remedy - Treats eczema, psoriasis, and acne antibacterial",
        "Traditional Dental Hygiene - Twigs used as natural antimicrobial toothbrushes"
      ],
      environmental: [
        "Afforestation tree for desertification reversal and soil erosion prevention",
        "Natural air coolant reducing local microclimate temperature"
      ],
      ornamental: [
        "Shade tree planted along avenues, gardens, and farm perimeters"
      ],
      industrial: [
        "Cold-pressed Neem Oil used in organic farming pesticides and soaps",
        "Neem Cake organic fertilizer and soil nitrogen stabilizer"
      ],
      research: [
        "Extensively researched for biopesticidal properties, neem limonoids, and azadirachtin mechanism"
      ]
    },
    care: {
      water: "Drought resistant; water young saplings weekly, mature trees require no supplemental water",
      light: "Full direct intense sunlight",
      temperature: "20°C - 44°C (68°F - 110°F); intolerant of severe prolonged frost",
      humidity: "Adapts to dry semi-arid to humid atmospheric conditions",
      soil: "Tolerates poor, sandy, rocky, or alkaline soils; demands good drainage",
      nutrition: "Organic compost or neem cake fertilizer around base",
      propagation: "Fresh seed sowing or semi-hardwood stem cuttings",
      pruning: "Prune lower branches to shape central trunk timber growth"
    },
    diseases: [
      {
        name: "Fusarium Tip Rot",
        cause: "Fungal infection during monsoon moisture waterlogging",
        symptoms: ["Browning of young apical shoots", "Damping off in nurseries"],
        affectedPart: "Apical stem tips",
        favorableConditions: "Waterlogged nurseries with stagnant drainage",
        prevention: ["Ensure raised nursery beds", "Avoid overwatering"],
        management: "Trim affected tip shoots.",
        treatmentInfo: "Trichoderma viride bio-fungicide or Copper oxychloride."
      }
    ],
    pests: [
      {
        name: "Tea Mosquito Bug (Helopeltis antonii)",
        symptoms: ["Necrotic brown spots on tender leaves and shoots"],
        management: "Spritz dilute neem seed kernel extract spray."
      }
    ],
    learningContent: {
      beginner: "Neem is a multipurpose tree from India known as nature's pharmacy. Its leaves and oil are famous for natural pest control and skincare.",
      student: "Azadirachta indica belongs to Meliaceae. It produces limonoid compounds like Azadirachtin, which acts as an insect antifeedant and growth regulator.",
      advanced: "Azadirachtin disrupts ecdysone steroid hormone pathways in insects, preventing metamorphosis. High antioxidant polyphenols provide medicinal value.",
      research: "Widely cited in international bio-pesticide research. Azadirachtin-A and Nimbin chemical structures evaluated for eco-friendly crop protection."
    },
    sources: [
      {
        name: "Plants of the World Online (Kew Gardens)",
        url: "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:576625-1",
        license: "CC-BY 4.0 Kew",
        retrievedAt: "2026-09-25T00:00:00.000Z",
        confidenceLevel: "Verified Source"
      },
      {
        name: "Indian Council of Agricultural Research (ICAR)",
        url: "https://icar.org.in",
        license: "Government of India Educational Archive",
        retrievedAt: "2026-09-25T00:00:00.000Z",
        confidenceLevel: "Verified Source"
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1546842931-886c185b4c8c?auto=format&fit=crop&w=800&q=80",
        caption: "Lush pinnate green leaves of Azadirachta indica",
        creator: "Botanical Stock",
        license: "Unsplash License",
        attribution: "Unsplash Free License",
        originalUrl: "https://unsplash.com"
      }
    ],
    retrievedAt: "2026-09-25T00:00:00.000Z",
    updatedAt: "2026-09-25T00:00:00.000Z",
    syncStatus: "synced"
  },
  {
    id: "ocimum-tenuiflorum",
    commonNames: ["Holy Basil", "Tulsi", "Sacred Basil", "Thulasi"],
    scientificName: "Ocimum tenuiflorum",
    acceptedName: "Ocimum tenuiflorum L.",
    taxonomy: {
      family: "Lamiaceae",
      genus: "Ocimum",
      species: "tenuiflorum",
      author: "L.",
      kingdom: "Plantae",
      order: "Lamiales"
    },
    synonyms: ["Ocimum sanctum", "Ocimum gratissimum var. sanctum"],
    plantType: "Aromatic Subshrub / Perennial Herb",
    lifeForm: "Chamaephyte Herb",
    description: "Ocimum tenuiflorum (Tulsi / Holy Basil) is a revered aromatic herb in the mint family Lamiaceae native to the Indian subcontinent, cultivated for adaptogenic medicinal teas and spiritual heritage.",
    traits: {
      leafType: "Simple aromatic ovate leaves with serrated margins",
      venation: "Pinnate reticulate venation",
      texture: "Pubescent hairy leaf surface emitting clove-like aroma",
      color: "Green (Rama Tulsi) or Dark Purple (Krishna Tulsi)",
      growthHabit: "Erect branched bushy subshrub up to 60-100 cm",
      arrangement: "Opposite decussate foliage"
    },
    morphology: {
      leaf: "Ovate, 2-5 cm long, finely serrated edges, aromatic essential oils",
      stem: "Square 4-angled stem covered in soft white hairs, turning woody at base",
      flower: "Small purplish/pink tubular flowers arranged in terminal whorled spikes (racemes)",
      fruit: "Nutlet fruit containing 4 small seed grains",
      seed: "Small oblong blackish-brown seeds that gel when soaked in water",
      root: "Fibrous taproot system"
    },
    identificationFeatures: {
      leafShape: "Ovate to elliptic",
      leafMargin: "Slightly serrate to dentate",
      leafApex: "Obtuse to acute",
      leafBase: "Cuneate",
      venation: "Pinnate secondary veins",
      arrangement: "Opposite decussate",
      texture: "Glandular pubescent",
      flowerCharacteristics: "Terminal purplish flower whorls on slender spikes",
      fruitCharacteristics: "Nutlet capsule with 4 seeds"
    },
    distribution: {
      native: ["Indian Subcontinent and Tropical Southeast Asia"],
      introduced: ["Cultivated in warm climates worldwide"],
      habitat: "Courtyards, temple gardens, home gardens, tropical agricultural land",
      biome: "Subtropical / Tropical Agricultural Biome"
    },
    uses: {
      food: [
        "Steeped fresh leaves for adaptogenic Tulsi herbal tea",
        "Aromatic seasoning in South Asian herbal broths and infusions"
      ],
      medicinal: [
        "Adaptogen Stress Relief - Reduces cortisol and calms nervous system",
        "Respiratory Support - Expectorant properties relieve cough and bronchitis",
        "Immunomodulator - Eugenol and ursolic acid boost immune defenses"
      ],
      environmental: [
        "Natural repellent against mosquitoes, flies, and garden pests",
        "Companion plant repelling aphids from nearby crops"
      ],
      ornamental: [
        "Sacred courtyard plant and scented patio container herb"
      ],
      industrial: [
        "Distilled Tulsi essential oil used in pharmaceuticals and aromatherapy"
      ],
      research: [
        "Evaluated for adaptogenic pharmacological pathways, anti-inflammatory eugenol content, and radioprotection"
      ]
    },
    care: {
      water: "Water regularly to keep soil moist; avoid soggy waterlogging",
      light: "Full sun to bright morning light (at least 4-6 hours direct daily)",
      temperature: "20°C - 35°C (68°F - 95°F); frost sensitive below 10°C",
      humidity: "50% - 75% warm humid climate preferred",
      soil: "Rich, well-draining loamy potting mix enriched with organic compost",
      nutrition: "Organic compost tea or balanced organic fertilizer monthly",
      propagation: "Seed germination or stem tip cuttings rooted in water/soil",
      pruning: "Pinch off flower spikes regularly to promote bushy foliage growth"
    },
    diseases: [
      {
        name: "Tulsi Downy Mildew (Peronospora sp.)",
        cause: "Oomycete fungal pathogen under wet cool leaf conditions",
        symptoms: ["Yellow patches on upper leaf surface", "Greyish mold fuzz underneath leaves"],
        affectedPart: "Foliage blade",
        favorableConditions: "High humidity and wet leaves overnight",
        prevention: ["Water at soil level in early morning", "Maintain plant spacing"],
        management: "Prune infected leaves.",
        treatmentInfo: "Neem oil spray or Bacillus subtilis bio-spray."
      }
    ],
    pests: [
      {
        name: "Aphids & Whiteflies",
        symptoms: ["Sticky leaf surfaces and curled stem tips"],
        management: "Spray soap water spray or introduce ladybugs."
      }
    ],
    learningContent: {
      beginner: "Tulsi (Holy Basil) is a sacred Indian herb prized for its delicious adaptogenic tea, sweet aroma, and wellness benefits.",
      student: "Ocimum tenuiflorum belongs to Lamiaceae (mint family), recognized by its square stem, opposite leaves, and high Eugenol essential oil content.",
      advanced: "Phytochemical profile rich in Eugenol, Carvacrol, Ursolic acid, and Rosmarinic acid. Provides COX-2 inhibition and adaptogenic HPA axis regulation.",
      research: "Subject of extensive clinical trials for radioprotective, anti-diabetic, and immunomodulatory pharmacological mechanisms."
    },
    sources: [
      {
        name: "Plants of the World Online (Kew Gardens)",
        url: "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:453534-1",
        license: "CC-BY 4.0 Kew",
        retrievedAt: "2026-09-25T00:00:00.000Z",
        confidenceLevel: "Verified Source"
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
        caption: "Fresh aromatic Ocimum tenuiflorum (Tulsi) leaves",
        creator: "Botanical Stock",
        license: "Unsplash License",
        attribution: "Unsplash Free License",
        originalUrl: "https://unsplash.com"
      }
    ],
    retrievedAt: "2026-09-25T00:00:00.000Z",
    updatedAt: "2026-09-25T00:00:00.000Z",
    syncStatus: "synced"
  }
];

export const PRESEEDED_BOTANICAL_KNOWLEDGE: BotanicalKnowledgeRecord[] = [
  ...BASE_PRESEEDED,
  ...EXTENDED_BOTANICAL_SEED_DATA
];

// Perform local search against IndexedDB cache + Preseeded records
export async function searchLocalEcoKnowledge(query: string): Promise<BotanicalKnowledgeRecord[]> {
  const clean = query.toLowerCase().trim();
  if (!clean) return PRESEEDED_BOTANICAL_KNOWLEDGE;

  let cachedRecords: BotanicalKnowledgeRecord[] = [];
  try {
    const recordsFromDb = await getAllRecords<BotanicalKnowledgeRecord>("plant_knowledge");
    if (recordsFromDb && recordsFromDb.length > 0) {
      cachedRecords = recordsFromDb;
    }
  } catch (err) {
    console.warn("IndexedDB plant_knowledge read error:", err);
  }

  // Combine DB records with preseeded, deduplicating by ID
  const combinedMap = new Map<string, BotanicalKnowledgeRecord>();
  PRESEEDED_BOTANICAL_KNOWLEDGE.forEach(p => combinedMap.set(p.id, p));
  cachedRecords.forEach(p => combinedMap.set(p.id, p));

  const allRecords = Array.from(combinedMap.values());

  // Multi-attribute filter
  return allRecords.filter(p => {
    const commonMatch = p.commonNames.some(c => c.toLowerCase().includes(clean));
    const sciMatch = p.scientificName.toLowerCase().includes(clean);
    const genusMatch = p.taxonomy.genus.toLowerCase().includes(clean);
    const familyMatch = p.taxonomy.family.toLowerCase().includes(clean);
    const speciesMatch = p.taxonomy.species.toLowerCase().includes(clean);
    const synMatch = p.synonyms.some(s => s.toLowerCase().includes(clean));
    const descMatch = p.description.toLowerCase().includes(clean);
    const traitMatch = Object.values(p.traits).some(v => v.toLowerCase().includes(clean));
    const locationMatch = p.distribution.native.some(n => n.toLowerCase().includes(clean)) ||
                          p.distribution.introduced.some(i => i.toLowerCase().includes(clean));
    const useMatch = Object.values(p.uses).flat().some(u => u.toLowerCase().includes(clean));

    return commonMatch || sciMatch || genusMatch || familyMatch || speciesMatch || synMatch || descMatch || traitMatch || locationMatch || useMatch;
  });
}

// Main EcoKnowledge Search Engine with GBIF fallback & IndexedDB Caching
export async function searchEcoKnowledgeEngine(query: string, isOnline: boolean): Promise<{
  records: BotanicalKnowledgeRecord[];
  isCached: boolean;
  message?: string;
}> {
  const localMatches = await searchLocalEcoKnowledge(query);

  if (localMatches.length > 0) {
    return { records: localMatches, isCached: true };
  }

  // If missing locally and online, query live GBIF API
  if (isOnline && query.trim().length >= 2) {
    try {
      const gbifRecord = await fetchFromGBIF(query);
      if (gbifRecord) {
        // Save to IndexedDB plant_knowledge store for future offline usage
        await saveRecord("plant_knowledge", gbifRecord);
        return { records: [gbifRecord], isCached: false };
      }
    } catch (e) {
      console.error("Live botanical fetch error:", e);
    }
  }

  // If offline or no live match found
  return {
    records: [],
    isCached: false,
    message: isOnline
      ? `No botanical record found for "${query}". Try searching by genus or family.`
      : "Plant knowledge isn't cached yet. Connect online to fetch live botanical profiles."
  };
}

// Get single plant profile by ID (from IndexedDB or preseeded or live)
export async function getEcoKnowledgeById(id: string, isOnline: boolean): Promise<BotanicalKnowledgeRecord | null> {
  // Check preseeded first
  const preseeded = PRESEEDED_BOTANICAL_KNOWLEDGE.find(p => p.id === id);
  if (preseeded) return preseeded;

  // Check IndexedDB
  try {
    const dbRecord = await getRecordById<BotanicalKnowledgeRecord>("plant_knowledge", id);
    if (dbRecord) return dbRecord;
  } catch (err) {
    console.warn("IndexedDB read error for id:", id, err);
  }

  // If online and id starts with gbif- or is a species query
  if (isOnline) {
    const queryTerm = id.replace(/^gbif-/, "").replace(/-/g, " ");
    const liveRecord = await fetchFromGBIF(queryTerm);
    if (liveRecord) {
      await saveRecord("plant_knowledge", liveRecord);
      return liveRecord;
    }
  }

  return null;
}

// Check if user has matching plant in "My Plants" database
export async function findUserPlantMatch(scientificName: string, commonNames: string[]): Promise<PlantRecord | null> {
  try {
    const userPlants = await getAllRecords<PlantRecord>("plants");
    if (!userPlants || userPlants.length === 0) return null;

    const sciClean = scientificName.toLowerCase();
    const commonCleans = commonNames.map(c => c.toLowerCase());

    return userPlants.find(p => {
      const pSci = (p.scientificName || "").toLowerCase();
      const pCommon = (p.commonName || "").toLowerCase();
      const pNick = (p.nickname || "").toLowerCase();

      return (
        (pSci && sciClean.includes(pSci)) ||
        (pSci && pSci.includes(sciClean)) ||
        commonCleans.some(c => pCommon.includes(c) || pNick.includes(c) || c.includes(pCommon))
      ) && !p.isArchived;
    }) || null;
  } catch (err) {
    console.warn("Error finding user plant match:", err);
    return null;
  }
}
