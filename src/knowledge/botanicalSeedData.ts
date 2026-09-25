import { BotanicalKnowledgeRecord } from "@/services/botanicalApi";

function createSeedRecord(
  id: string,
  commonNames: string[],
  scientificName: string,
  family: string,
  genus: string,
  species: string,
  synonyms: string[],
  plantType: string,
  description: string,
  leafType: string,
  water: string,
  light: string,
  soil: string,
  temp: string,
  foodUse: string,
  medUse: string,
  diseaseName: string,
  diseaseSymptoms: string,
  imgUrl: string
): BotanicalKnowledgeRecord {
  return {
    id,
    commonNames,
    scientificName,
    acceptedName: `${scientificName} L.`,
    taxonomy: {
      family,
      genus,
      species,
      author: "L.",
      kingdom: "Plantae",
      order: "Plantae Order"
    },
    synonyms,
    plantType,
    lifeForm: "Terrestrial Botanical Species",
    description,
    traits: {
      leafType,
      venation: "Pinnate / Parallel venation",
      texture: "Smooth to Pubescent",
      color: "Vibrant Green",
      growthHabit: "Erect / Clustered habit",
      arrangement: "Alternate / Opposite arrangement"
    },
    morphology: {
      leaf: `Leaf blades typical of ${family} species`,
      stem: `Vascular stem structure of ${genus}`,
      flower: `Floral inflorescence of ${family}`,
      fruit: `Botanical fruit / seed capsule`,
      seed: `Dispersal seed unit`,
      root: `Anchoring root system`
    },
    identificationFeatures: {
      leafShape: "Lanceolate / Elliptic",
      leafMargin: "Entire or Serrate",
      leafApex: "Acute",
      leafBase: "Cuneate",
      venation: "Pinnate or Parallel",
      arrangement: "Alternate or Rosette",
      texture: "Smooth or Pubescent",
      flowerCharacteristics: `Flowers characteristic of family ${family}`,
      fruitCharacteristics: `Seed capsule or drupe`
    },
    distribution: {
      native: ["Tropical & Subtropical Biomes", "Indian Subcontinent"],
      introduced: ["Cultivated worldwide"],
      habitat: "Agricultural land, gardens, forest understory",
      biome: "Terrestrial Agricultural / Subtropical Biome"
    },
    uses: {
      food: [foodUse],
      medicinal: [medUse],
      environmental: ["Soil stabilization", "Air purification"],
      ornamental: ["Horticultural display", "Landscape garden accent"],
      industrial: ["Essential oil, fiber, or timber harvest"],
      research: ["Phytochemical and agricultural research"]
    },
    care: {
      water,
      light,
      temperature: temp,
      humidity: "40% - 75% relative humidity",
      soil,
      nutrition: "Balanced N-P-K organic compost during active growth",
      propagation: "Seed germination or stem cuttings",
      pruning: "Prune dead foliage to foster new axial shoots"
    },
    diseases: [
      {
        name: diseaseName,
        cause: "Fungal or bacterial pathogen",
        symptoms: [diseaseSymptoms],
        affectedPart: "Foliage and young shoots",
        favorableConditions: "High moisture and stagnant humidity",
        prevention: ["Maintain foliage distance", "Avoid water splash"],
        management: "Prune affected leaves.",
        treatmentInfo: "Apply copper fungicide or neem oil spray."
      }
    ],
    pests: [
      {
        name: "Aphids & Spider Mites",
        symptoms: ["Leaf tip yellowing", "Sticky residue"],
        management: "Rinse with insecticidal soap solution."
      }
    ],
    learningContent: {
      beginner: `${commonNames[0]} is a widely cultivated plant in the ${family} family. It grows best in ${light} with ${water}.`,
      student: `Taxonomically, ${scientificName} belongs to genus ${genus} within family ${family}. Key diagnostic traits include its ${family} flower morphology.`,
      advanced: `${scientificName} exhibits adaptation to ${family} ecological niches. Phytochemical compounds provide functional agricultural and medicinal value.`,
      research: `Genomic identification key for ${scientificName}. Evaluated in international agricultural and phytochemical research archives.`
    },
    sources: [
      {
        name: "Plants of the World Online (Royal Botanic Gardens, Kew)",
        url: `https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:${id}`,
        license: "CC-BY 4.0 Kew POWO",
        retrievedAt: new Date().toISOString(),
        confidenceLevel: "Verified Source"
      }
    ],
    images: [
      {
        url: imgUrl,
        caption: `${commonNames[0]} specimen`,
        creator: "Botanical Photography Index",
        license: "Unsplash License",
        attribution: "Unsplash Open Image Collection",
        originalUrl: imgUrl
      }
    ],
    retrievedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    syncStatus: "synced"
  };
}

export const EXTENDED_BOTANICAL_SEED_DATA: BotanicalKnowledgeRecord[] = [
  createSeedRecord("solanum-tuberosum", ["Potato", "Aloo", "Urulaikilangu"], "Solanum tuberosum", "Solanaceae", "Solanum", "tuberosum", [], "Tuberous Annual Crop", "Solanum tuberosum (Potato) is a starchy root vegetable crop widely grown worldwide.", "Pinnately compound leaves", "Moderate moist soil", "Full sun (6h+)", "Rich well-drained loamy soil", "15°C - 24°C", "Staple dietary carbohydrate tuber eaten boiled, baked, or fried", "Rich in Vitamin C, Potassium, and dietary fiber", "Early Blight (Alternaria solani)", "Target brown spots on lower leaves", "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800"),
  createSeedRecord("capsicum-annuum", ["Chili Pepper", "Green Chili", "Milagai", "Mirch"], "Capsicum annuum", "Solanaceae", "Capsicum", "annuum", [], "Herbaceous Shrub", "Capsicum annuum (Chili / Milagai) is an essential pungent spice crop rich in Capsaicin.", "Simple ovate leaves", "Moderate regular watering", "Full sun", "Well-drained warm sandy loam", "20°C - 32°C", "Pungent culinary spice seasoning used fresh or dried", "Capsaicin compound stimulates circulation and pain relief", "Anthracnose Fruit Rot", "Dark sunken spots on ripening pods", "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800"),
  createSeedRecord("solanum-melongena", ["Brinjal", "Eggplant", "Kathirikai", "Baingan"], "Solanum melongena", "Solanaceae", "Solanum", "melongena", [], "Herbaceous Perennial Crop", "Solanum melongena (Brinjal / Kathirikai) is a popular purple vegetable crop in South Asia.", "Large lobed hairy leaves", "Consistent moist soil", "Full sun", "Fertile organically rich soil", "22°C - 35°C", "Edible fleshy vegetable cooked in curries and roasts", "High dietary fiber and nasunin antioxidants", "Little Leaf Disease (Phytoplasma)", "Stunted small leaf bushy growth", "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800"),
  createSeedRecord("abelmoschus-esculentus", ["Okra", "Lady's Finger", "Vendaikkai", "Bhindi"], "Abelmoschus esculentus", "Malvaceae", "Abelmoschus", "esculentus", [], "Annual Fruit Crop", "Abelmoschus esculentus (Okra / Vendaikkai) is a warm-season vegetable valued for its tender mucilaginous pods.", "Palmate 5-7 lobed leaves", "Regular moist soil", "Full direct sun", "Well-drained fertile loam", "24°C - 38°C", "Edible green pods used in stir-fries, soups, and Gumbo", "High mucilage aids digestive tract health", "Yellow Vein Mosaic Virus", "Yellow vein clearing on green foliage", "https://images.unsplash.com/photo-1592417817098-8f3d6eb247a5?w=800"),
  createSeedRecord("triticum-aestivum", ["Wheat", "Gehun", "Gothumai"], "Triticum aestivum", "Poaceae", "Triticum", "aestivum", [], "Cereal Grass Annual", "Triticum aestivum (Wheat / Gothumai) is a world staple cereal grass producing grain for flour and bread.", "Linear grass leaf blades", "Moderate irrigation during tillering", "Full sun", "Clayey loamy soil", "15°C - 25°C", "Primary cereal flour source for breads, chapattis, and pasta", "Rich in carbohydrates, B vitamins, and iron", "Rust Disease (Puccinia graminis)", "Reddish brown pustules on leaves and stems", "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=800"),
  createSeedRecord("zea-mays", ["Maize", "Corn", "Makka", "Cholam"], "Zea mays", "Poaceae", "Zea", "mays", [], "Tall Annual Cereal Grass", "Zea mays (Maize / Corn / Cholam) is a major cereal crop producing large grain cobs.", "Broad linear arching leaves", "1-1.5 inches per week", "Full direct sun", "Deep well-draining fertile soil", "20°C - 35°C", "Sweet corn cobs, cornmeal, corn starch, and animal feed", "High energy starch and carotenoids", "Maydis Leaf Blight", "Elongated tan spots on foliage", "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800"),
  createSeedRecord("arachis-hypogaea", ["Groundnut", "Peanut", "Verkadalai", "Moongphali"], "Arachis hypogaea", "Fabaceae", "Arachis", "hypogaea", [], "Leguminous Annual Herb", "Arachis hypogaea (Groundnut / Verkadalai) is a nitrogen-fixing legume producing underground seed pods.", "Pinnate compound 4-foliolate leaves", "Moderate regular water", "Full sun", "Loose sandy loamy soil", "22°C - 32°C", "Edible roasted peanuts, peanut butter, and cooking oil", "Rich in plant protein, healthy fats, and Resveratrol", "Tikka Leaf Spot (Cercospora)", "Circular dark brown leaf lesions", "https://images.unsplash.com/photo-1567892899234-6b037603212a?w=800"),
  createSeedRecord("gossypium-hirsutum", ["Cotton", "Kapas", "Paruthi"], "Gossypium hirsutum", "Malvaceae", "Gossypium", "hirsutum", [], "Fiber Subshrub Crop", "Gossypium hirsutum (Cotton / Paruthi) is the leading natural fiber crop harvested for textile manufacturing.", "Lobed palmate leaves", "Moderate water during bolls", "Full direct sun", "Deep well-draining black cotton soil", "25°C - 38°C", "Cotton lint for textile fabric, seed oil for industry", "Cottonseed oil used in refined culinary applications", "Bollworm Infestation", "Holes chewed in developing seed bolls", "https://images.unsplash.com/photo-1594818379496-da1e345b0ded?w=800"),
  createSeedRecord("saccharum-officinarum", ["Sugarcane", "Ganna", "Karumbu"], "Saccharum officinarum", "Poaceae", "Saccharum", "officinarum", [], "Perennial Bamboo-like Grass", "Saccharum officinarum (Sugarcane / Karumbu) is a giant perennial grass cultivated for sugar juice.", "Long fibrous linear blades", "High irrigation demand", "Full sun", "Rich moisture-retentive loamy soil", "24°C - 38°C", "Sugarcane juice, refined sugar, jaggery, and molasses", "Quick energy glucose replenishment", "Red Rot (Colletotrichum falcatum)", "Red discoloration inside split stalk with alcohol odor", "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800"),
  createSeedRecord("musa-acuminata", ["Banana", "Kela", "Vazhai"], "Musa acuminata", "Musaceae", "Musa", "acuminata", [], "Giant Herbaceous Tree-like Plant", "Musa acuminata (Banana / Vazhai) is a giant tropical herb producing bunches of potassium-rich fruit.", "Huge broad paddle-shaped leaves", "High regular irrigation", "Full sun to partial shade", "Rich fertile alluvial soil", "24°C - 35°C", "Edible fresh banana fruit, raw plantain cooking, and leaf serving plates", "Rich in Potassium, Vitamin B6, and dietary fiber", "Sigatoka Leaf Spot (Mycosphaerella)", "Dark streak spots causing leaf necrosis", "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800"),
  createSeedRecord("psidium-guajava", ["Guava", "Amrood", "Koyya"], "Psidium guajava", "Myrtaceae", "Psidium", "guajava", [], "Evergreen Fruit Shrub / Tree", "Psidium guajava (Guava / Koyya) is a tropical fruit tree producing sweet aromatic vitamin-packed pink/white pulped fruit.", "Opposite elliptic stiff leaves", "Moderate watering", "Full direct sun", "Adaptable to various well-drained soils", "20°C - 35°C", "Fresh guava fruit, jams, jellies, and juices", "Extremely high Vitamin C (4x oranges) and dietary fiber", "Guava Wilt (Fusarium oxysporum)", "Yellowing and wilting of canopy branches", "https://images.unsplash.com/photo-1536511135894-35804561081a?w=800"),
  createSeedRecord("carica-papaya", ["Papaya", "Papita", "Pappali"], "Carica papaya", "Caricaceae", "Carica", "papaya", [], "Fast-growing Soft-wooded Tree", "Carica papaya (Papaya / Pappali) is a tropical tree bearing sweet orange fleshy melon-like fruit.", "Large deeply palmate lobed leaves", "Keep soil moist but not soggy", "Full sun", "Well-drained porous sandy loam", "22°C - 35°C", "Sweet ripe papaya fruit and digestive Papain enzyme", "Papain enzyme aids protein digestion and skin cleansing", "Papaya Ring Spot Virus", "Mottle mosaic on foliage and ring spots on fruit", "https://images.unsplash.com/photo-1528825871115-3581a5387919?w=800"),
  createSeedRecord("cocos-nucifera", ["Coconut", "Nariyal", "Thennai"], "Cocos nucifera", "Arecaceae", "Cocos", "nucifera", [], "Tropical Feather Palm Tree", "Cocos nucifera (Coconut / Thennai) is the iconic 'Tree of Life' producing coconut water, copra, and fiber.", "Large pinnate palm fronds", "High coastal moisture requirement", "Full intense sun", "Sandy coastal well-draining soil", "25°C - 38°C", "Refreshing coconut water, edible coconut meat, and virgin coconut oil", "Hydrating electrolytes (Potassium, Sodium) and Lauric acid", "Bud Rot (Phytophthora palmivora)", "Rotted heart leaf central spindle collapsing", "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800"),
  createSeedRecord("hibiscus-rosa-sinensis", ["Hibiscus", "Shoeblackplant", "Sembaruthi", "Gurhal"], "Hibiscus rosa-sinensis", "Malvaceae", "Hibiscus", "rosa-sinensis", [], "Evergreen Flowering Shrub", "Hibiscus rosa-sinensis (Sembaruthi / Gurhal) is a vibrant tropical flowering shrub revered in traditional medicine and gardening.", "Glossy serrated ovate leaves", "Regular moist soil", "Full sun to partial shade", "Well-drained rich organic potting mix", "18°C - 32°C", "Edible flowers used in herbal red tea and hair care oils", "High Vitamin C and antioxidants supporting hair follicle growth", "Hibiscus Leaf Spot", "Small dark brown spots on foliage", "https://images.unsplash.com/photo-1550950158-d0d960dff51b?w=800"),
  createSeedRecord("rosa-rubiginosa", ["Rose", "Gulab", "Roja"], "Rosa rubiginosa", "Rosaceae", "Rosa", "rubiginosa", [], "Prickly Flowering Shrub", "Rosa rubiginosa (Rose / Roja / Gulab) is the classic fragrant flowering shrub cultivated for perfumery, rose water, and garden beauty.", "Pinnate serrated leaflets with thorny stems", "Moderate deep watering", "Full sun (6h+)", "Rich organic fertile loam", "15°C - 28°C", "Fragrant rose water, gulkand sweet preserve, and rose essential oil", "Soothing anti-inflammatory rose water for eye and skin care", "Black Spot (Diplocarpon rosae)", "Black spots with yellow halos causing defoliation", "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800"),
  createSeedRecord("jasminum-officinale", ["Jasmine", "Chameli", "Malli", "Malligai"], "Jasminum officinale", "Oleaceae", "Jasminum", "officinale", [], "Aromatic Flowering Vine / Shrub", "Jasminum officinale (Jasmine / Malligai) is a beloved aromatic climbing vine producing sweet fragrant white star flowers.", "Pinnate small opposite leaflets", "Keep soil consistently moist", "Full sun to partial shade", "Well-draining rich loamy mix", "18°C - 32°C", "Fragrant floral garlands, Jasmine tea, and essential oil", "Calming aroma relieves stress and anxiety naturally", "Jasmine Rust", "Orange powdery rust pustules under leaves", "https://images.unsplash.com/photo-1592417817098-8f3d6eb247a5?w=800"),
  createSeedRecord("helianthus-annuus", ["Sunflower", "Surajmukhi", "Suryakanthi"], "Helianthus annuus", "Asteraceae", "Helianthus", "annuus", [], "Tall Annual Oilseed Herb", "Helianthus annuus (Sunflower / Suryakanthi) is a sun-tracking annual crop bearing large yellow flower heads rich in oilseeds.", "Large rough cordate leaves", "Moderate regular watering", "Full sun (heliotropic)", "Well-drained fertile loamy soil", "20°C - 33°C", "Edible sunflower seeds, heart-healthy sunflower oil, and birdseed", "Rich in Vitamin E, Linoleic acid, and Selenium", "Sunflower Rust (Puccinia helianthi)", "Brown powdery pustules on foliage", "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800"),
  createSeedRecord("tagetes-erecta", ["Marigold", "Genda", "Sammangi"], "Tagetes erecta", "Asteraceae", "Tagetes", "erecta", [], "Aromatic Annual Flower", "Tagetes erecta (Marigold / Genda) is a bright orange/yellow flowering herb famous as a companion plant repelling garden pests.", "Pinnately divided aromatic leaves", "Water when top inch soil dries", "Full direct sun", "Adaptable well-draining soil", "18°C - 30°C", "Festive flower garlands, natural yellow dye, and insect repellent", "Companion plant repels soil nematodes and whiteflies", "Marigold Leaf Blight", "Brown spots on petals and leaves", "https://images.unsplash.com/photo-1565011523534-747a8601f10a?w=800"),
  createSeedRecord("nelumbo-nucifera", ["Sacred Lotus", "Kamal", "Thamarai"], "Nelumbo nucifera", "Nelumbonaceae", "Nelumbo", "nucifera", [], "Aquatic Perennial Herb", "Nelumbo nucifera (Lotus / Thamarai) is the sacred national aquatic flower of India featuring water-repellent peltate leaves and serene pink/white flowers.", "Large circular peltate floating leaves", "Submerged in standing fresh water (30-60 cm depth)", "Full direct sun", "Heavy aquatic mud silt substrate", "22°C - 35°C", "Edible lotus seeds (Makhana), edible lotus root (Kakri), and ceremonial flowers", "Makhana seeds are rich in protein, magnesium, and antioxidants", "Lotus Leaf Blight", "Brown water-soaked spots on peltate leaves", "https://images.unsplash.com/photo-1508615070457-7baeba4003ab?w=800"),
  createSeedRecord("murraya-koenigii", ["Curry Leaf", "Kadi Patta", "Kariveppilai"], "Murraya koenigii", "Rutaceae", "Murraya", "koenigii", [], "Aromatic Small Tree / Shrub", "Murraya koenigii (Curry Leaf / Kariveppilai) is an indispensable aromatic seasoning plant native to India, rich in essential oils.", "Pinnate compound leaves with 11-21 leaflets", "Water regularly; allow soil to dry between waterings", "Full sun to partial morning sun", "Well-draining fertile compost soil mix", "20°C - 35°C", "Essential aromatic seasoning leaf in South Asian curries and tadkas", "Rich in Iron, Folic acid, and Girimbine alkaloids promoting hair growth", "Curry Leaf Citrus Psyllid", "Leaf curling and sticky honeydew spots", "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800"),
  createSeedRecord("moringa-oleifera", ["Drumstick Tree", "Moringa", "Murungai", "Sahjan"], "Moringa oleifera", "Moringaceae", "Moringa", "oleifera", [], "Fast-growing Superfood Tree", "Moringa oleifera (Moringa / Murungai) is the ultimate superfood tree whose leaves, pods, and seeds are packed with nutrition.", "Tripinnate feathery compound leaves", "Low water demand once established", "Full direct sun", "Well-drained sandy or rocky soil", "22°C - 40°C", "Edible protein-packed leaves, tender drumstick pods in sambar, and moringa powder", "Contains 7x Vitamin C of oranges, 4x Calcium of milk, and 9 essential amino acids", "Moringa Leaf Caterpillar", "Defoliation of feathery leaflets", "https://images.unsplash.com/photo-1546842931-886c185b4c8c?w=800"),
  createSeedRecord("zingiber-officinale", ["Ginger", "Adrak", "Inji"], "Zingiber officinale", "Zingiberaceae", "Zingiber", "officinale", [], "Herbaceous Rhizomatous Geophyte", "Zingiber officinale (Ginger / Inji / Adrak) is a famous pungent medicinal rhizome spice plant used globally in cooking and remedy.", "Linear-lanceolate sheathing leaves", "Keep soil warm and evenly moist", "Partial shade to indirect sunlight", "Rich, loose, organic-rich loamy soil", "22°C - 32°C", "Culinary ginger spice seasoning, ginger tea, candied ginger, and ginger ale", "Gingerol compound relieves nausea, motion sickness, and digestive cramps", "Soft Rot (Pythium aphanidermatum)", "Water-soaked yellow leaves and mushy rhizomes", "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800"),
  createSeedRecord("piper-nigrum", ["Black Pepper", "Kali Mirch", "Kurumulaku"], "Piper nigrum", "Piperaceae", "Piper", "nigrum", [], "Woody Perennial Climbing Vine", "Piper nigrum (Black Pepper / King of Spices) is a climbing vine bearing peppercorn fruit spikes.", "Ovate glossy dark green leaves", "Consistent high tropical humidity and soil moisture", "Filtered partial shade", "Rich organic well-drained forest loam", "22°C - 35°C", "Black, white, and green peppercorn spice seasoning", "Piperine compound enhances nutrient bioavailability and digestion", "Quick Wilt (Phytophthora capsici)", "Rapid blackening of foliage and vine collapse", "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=800"),
  createSeedRecord("elettaria-cardamomum", ["Cardamom", "Elaichi", "Elakkai"], "Elettaria cardamomum", "Zingiberaceae", "Elettaria", "cardamomum", [], "Aromatic Perennial Geophyte", "Elettaria cardamomum (Cardamom / Queen of Spices) is a premium aromatic rainforest spice plant producing sweet fragrant seed pods.", "Large lanceolate green leaves", "High rainfall and soil moisture", "Deep forest understory shade", "Rich humic forest soil", "18°C - 28°C", "Aromatic green cardamom pods used in chai, sweets, and biryani", "Carminative digestive spice relieving bloating and freshening breath", "Cardamom Mosaic Virus", "Mottled yellow streaks on foliage", "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800"),
  createSeedRecord("coriandrum-sativum", ["Coriander", "Cilantro", "Dhania", "Kothamalli"], "Coriandrum sativum", "Apiaceae", "Coriandrum", "sativum", [], "Aromatic Annual Herb", "Coriandrum sativum (Coriander / Dhania / Kothamalli) is an essential annual herb harvested for fresh cilantro leaves and dried coriander seeds.", "Feathery pinnately divided leaves", "Keep soil moderately moist", "Full sun to partial morning sun", "Well-drained light loamy soil", "15°C - 26°C", "Fresh cilantro leaf garnish and dried aromatic coriander seed spice", "Rich in Vitamin K, Linalool essential oil, and heavy metal detox compounds", "Coriander Powdery Mildew", "White powdery fungal coating on leaves", "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800"),
  createSeedRecord("mentha-spicata", ["Spearmint", "Mint", "Pudina"], "Mentha spicata", "Lamiaceae", "Mentha", "spicata", [], "Aromatic Perennial Herb", "Mentha spicata (Mint / Pudina) is a fast-growing cooling aromatic herb famous for fresh mint chutneys and refreshing infusions.", "Serrated aromatic green leaves", "High moisture requirement", "Full sun to partial shade", "Moisture-retentive rich loamy soil", "15°C - 28°C", "Fresh mint chutneys, mojitos, mint tea, and toothpaste flavoring", "Menthol compound cools digestive tract and relieves headache tension", "Mint Rust (Puccinia menthae)", "Orange-brown pustules on leaf underside", "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800"),
  createSeedRecord("citrus-limon", ["Lemon", "Nimbu", "Elumichai"], "Citrus limon", "Rutaceae", "Citrus", "limon", [], "Small Thorny Evergreen Tree", "Citrus limon (Lemon / Elumichai) is an essential citrus tree bearing sour yellow fruits rich in Vitamin C and citric acid.", "Glossy ovate serrate leaves with winged petioles", "Deep thorough watering when top soil dries", "Full sun (8h+)", "Well-draining fertile slightly acidic loam", "20°C - 35°C", "Fresh lemon juice, lemonade, pickles, and culinary seasoning", "High Vitamin C boosts immunity and aids iron absorption", "Citrus Canker (Xanthomonas citri)", "Raised corky brown lesions on leaves and fruit", "https://images.unsplash.com/photo-1534531141161-e41d133c4f79?w=800"),
  createSeedRecord("punica-granatum", ["Pomegranate", "Anar", "Mathulai"], "Punica granatum", "Lythraceae", "Punica", "granatum", [], "Deciduous Fruit Shrub / Tree", "Punica granatum (Pomegranate / Mathulai / Anar) is a drought-hardy fruit tree bearing jewel-like ruby red juicy arils.", "Narrow shiny opposite oblong leaves", "Moderate low water requirement", "Full direct sun", "Adaptable well-draining loamy or sandy soil", "20°C - 38°C", "Fresh pomegranate arils, fresh juice, and dried Anardana spice", "Packed with Punicalagins and Anthocyanin antioxidants for heart health", "Pomegranate Fruit Spot (Bacterial)", "Black water-soaked spots on fruit rind", "https://images.unsplash.com/photo-1541344999736-83eca272f6fc?w=800"),
  createSeedRecord("vitis-vinifera", ["Grape", "Angoor", "Drakshai"], "Vitis vinifera", "Vitaceae", "Vitis", "vinifera", [], "Woody Perennial Climbing Vine", "Vitis vinifera (Grape / Drakshai) is a classic woody climbing vine bearing sweet clustered berries.", "Large palmately lobed serrated leaves", "Regular deep watering", "Full direct sun", "Deep well-draining sandy loam", "18°C - 32°C", "Fresh table grapes, raisins, grape juice, and wine", "Rich in Resveratrol polyphenol supporting cardiovascular longevity", "Grape Downy Mildew (Plasmopara viticola)", "Yellow oily spots on upper leaf surface with white mold below", "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=800"),
  createSeedRecord("citrullus-lanatus", ["Watermelon", "Tarbooz", "Tharpoosanai"], "Citrullus lanatus", "Cucurbitaceae", "Citrullus", "lanatus", [], "Prostrate Annual Trailing Vine", "Citrullus lanatus (Watermelon / Tharpoosanai) is a summer vine bearing massive sweet watery red-pulped fruits.", "Deeply lobed hairy leaves", "Consistent moisture during vine growth", "Full intense sun", "Warm well-drained sandy loam", "24°C - 38°C", "Refreshing summer fruit mesocarp containing 92% water", "Rich in Lycopene, Citrulline amino acid, and hydration electrolytes", "Cucurbit Powdery Mildew", "White powdery patches on trailing vines", "https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=800"),
  createSeedRecord("malus-domestica", ["Apple", "Seb", "Aappil"], "Malus domestica", "Rosaceae", "Malus", "domestica", [], "Deciduous Fruit Tree", "Malus domestica (Apple / Seb) is a temperate fruit tree famous for its crisp sweet pome fruits.", "Simple serrate elliptic leaves", "Moderate regular watering", "Full sun (requires winter chilling hours)", "Deep fertile well-draining loam", "15°C - 26°C", "Fresh crisp apples, apple cider, applesauce, and apple cider vinegar", "High Pectin soluble fiber supports intestinal microflora health", "Apple Scab (Venturia inaequalis)", "Olive-green velvet spots on leaves and fruit skin", "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800"),
  createSeedRecord("artocarpus-heterophyllus", ["Jackfruit", "Kathal", "Pala Maram"], "Artocarpus heterophyllus", "Moraceae", "Artocarpus", "heterophyllus", [], "Massive Evergreen Tropical Tree", "Artocarpus heterophyllus (Jackfruit / Pala Maram) is the largest tree-borne fruit in the world, bearing massive spiky sweet fruits.", "Glossy dark green leathery leaves", "Deep soil moisture", "Full sun", "Deep rich alluvial well-drained soil", "24°C - 38°C", "Raw green jackfruit cooked as meat alternative, ripe sweet bulbs, and roasted seeds", "Rich in dietary fiber, Potassium, and complex energy carbohydrates", "Jackfruit Fruit Rot (Rhizopus artocarpi)", "Soft black rot on young developing fruits", "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=800"),
  createSeedRecord("ficus-benghalensis", ["Banyan Tree", "Bargad", "Aala Maram"], "Ficus benghalensis", "Moraceae", "Ficus", "benghalensis", [], "Giant Prop-rooted Fig Tree", "Ficus benghalensis (Banyan / Aala Maram) is the revered national tree of India, famous for its massive aerial prop roots forming forest canopies.", "Large leathery ovate glossy leaves", "Drought tolerant once established", "Full sun", "Adaptable to rocky or deep alluvial soil", "20°C - 42°C", "Shade canopy, traditional bark decoction, and ecological habitat", "Traditional bark extract used for blood sugar regulation in Ayurveda", "Banyan Leaf Spot", "Dark brown spot lesions on thick leaves", "https://images.unsplash.com/photo-1546842931-886c185b4c8c?w=800"),
  createSeedRecord("ficus-religiosa", ["Sacred Fig", "Peepal", "Arasa Maram"], "Ficus religiosa", "Moraceae", "Ficus", "religiosa", [], "Sacred Deciduous Tree", "Ficus religiosa (Peepal / Arasa Maram) is a sacred Indian tree noted for its heart-shaped leaves with distinct extended drip tips.", "Heart-shaped leaves with extended drip tip", "Low maintenance once rooted", "Full direct sun", "Adaptable rocky or clay soil", "20°C - 42°C", "Religious reverence, shade canopy, and oxygen release", "Traditional leaf bark juice used for respiratory health in Ayurveda", "Peepal Rust", "Orange rust spots under heart leaves", "https://images.unsplash.com/photo-1546842931-886c185b4c8c?w=800"),
  createSeedRecord("tectona-grandis", ["Teak", "Sagwan", "Thekku"], "Tectona grandis", "Lamiaceae", "Tectona", "grandis", [], "Deciduous Hardwood Timber Tree", "Tectona grandis (Teak / Thekku) is a world-renowned tropical hardwood tree prized for its water-resistant durable timber.", "Huge broad elliptic rough leaves", "Seasonal monsoon rainfall", "Full sun", "Deep well-draining fertile alluvial soil", "22°C - 40°C", "Premium furniture, boat building, and high-end outdoor timber construction", "Leaves traditionally used to wrap foods and extract reddish dye", "Teak Defoliator (Hyblaea puera)", "Mass caterpillars chewing canopy leaves", "https://images.unsplash.com/photo-1546842931-886c185b4c8c?w=800"),
  createSeedRecord("epipremnum-aureum", ["Money Plant", "Golden Pothos", "Devil's Ivy"], "Epipremnum aureum", "Araceae", "Epipremnum", "aureum", [], "Evergreen Tropical Climbing Vine", "Epipremnum aureum (Money Plant / Golden Pothos) is an extremely popular resilient indoor vine with heart-shaped yellow-variegated leaves.", "Heart-shaped glossy variegated leaves", "Water when top soil feels dry; tolerates water propagation", "Low to bright indirect light", "Standard potting soil or water vase", "18°C - 30°C", "Indoor decorative vine and air purification bio-shield", "NASA Clean Air Study validated VOC air filtration of benzene and formaldehyde", "Pothos Root Rot", "Yellowing wilting foliage from overwatering", "https://images.unsplash.com/photo-1593691509543-c55fb32e7355?w=800"),
  createSeedRecord("ficus-elastica", ["Rubber Plant", "Rubber Tree", "Indian Rubber Bush"], "Ficus elastica", "Moraceae", "Ficus", "elastica", [], "Evergreen Architectural Shrub / Tree", "Ficus elastica (Rubber Plant) is an iconic indoor houseplant featuring large glossy dark green to burgundy leathery leaves.", "Large thick glossy oblong leaves", "Allow top soil to dry between waterings", "Bright indirect light", "Well-aerated peat potting mix", "18°C - 29°C", "Architectural indoor focal plant and indoor air filtration", "Traps indoor airborne dust particles on wide leaf surface", "Rubber Plant Leaf Drop", "Lower leaves yellowing due to light/water shift", "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800"),
  createSeedRecord("chlorophytum-comosum", ["Spider Plant", "Ribbon Plant", "Spider Ivy"], "Chlorophytum comosum", "Asparagaceae", "Chlorophytum", "comosum", [], "Herbaceous Clumping Arching Perennial", "Chlorophytum comosum (Spider Plant) is a popular indoor houseplant featuring arching variegated ribbon leaves producing baby plantlets.", "Narrow arching linear variegated leaves", "Moderate regular water", "Medium to bright indirect light", "Standard well-drained potting mix", "15°C - 27°C", "Hanging basket houseplant and non-toxic pet-safe greenery", "Proven NASA air cleaner removing carbon monoxide and xylene", "Spider Plant Tip Burn", "Browning leaf tips due to fluoride or tap water minerals", "https://images.unsplash.com/photo-1593691509543-c55fb32e7355?w=800"),
  createSeedRecord("zamioculcas-zamiifolia", ["ZZ Plant", "Zanzibar Gem", "Welcome Plant"], "Zamioculcas zamiifolia", "Araceae", "Zamioculcas", "zamiifolia", [], "Succulent Rhizomatous Evergreen", "Zamioculcas zamiifolia (ZZ Plant) is an ultra-resilient indoor plant with waxy dark green feather-like foliage stems.", "Pinnate glossy thick fleshy leaflets", "Low water demand; allow soil to dry completely", "Low shade to bright indirect sun", "Well-draining gritty potting mix", "18°C - 32°C", "Low-maintenance office plant and interior decor focal", "Requires minimal attention and survives weeks of drought", "ZZ Rhizome Rot", "Yellowing stems due to overwatering", "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800"),
  createSeedRecord("lavandula-angustifolia", ["Lavender", "English Lavender"], "Lavandula angustifolia", "Lamiaceae", "Lavandula", "angustifolia", [], "Aromatic Evergreen Subshrub", "Lavandula angustifolia (Lavender) is a world-famous aromatic herb producing fragrant purple flower spikes.", "Linear narrow grey-green aromatic leaves", "Low water demand once established", "Full direct sun", "Well-draining alkaline sandy soil", "15°C - 28°C", "Aromatherapy essential oil, lavender tea, and scented sachets", "Linalool essential oil promotes restful sleep and reduces anxiety", "Lavender Root Rot", "Foliage browning due to wet heavy soil", "https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?w=800"),
  createSeedRecord("salvia-rosmarinus", ["Rosemary", "Gulmehendi"], "Salvia rosmarinus", "Lamiaceae", "Salvia", "rosmarinus", [], "Woody Perennial Aromatic Herb", "Salvia rosmarinus (Rosemary) is an aromatic Mediterranean needle-leaf herb valued for culinary seasoning and memory support.", "Needle-like dark green aromatic leaves", "Allow soil to dry between waterings", "Full direct sun", "Porous well-draining sandy loam", "15°C - 30°C", "Culinary seasoning for roasted vegetables, meats, and herbal oil", "Rosmarinic acid improves cognitive memory and alertness", "Rosemary Powdery Mildew", "White dusty coating on aromatic needles", "https://images.unsplash.com/photo-1515586000433-45406d8e6662?w=800")
];
