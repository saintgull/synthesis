// Simple script to process a vibe query from command line
const fs = require('fs');

// Import semantic analyzer
const analyzerCode = fs.readFileSync('semantic_analyzer.js', 'utf8');
eval(analyzerCode);

// Get the query from command line arguments
const query = process.argv[2] || "neutral vibe";

// Process the query
if (!window) {
  // Create mock window object for the semantic analyzer
  global.window = {};
}

// Define the contextualAssociation function which is called by generateVibeParametersFromText
function contextualAssociation(text, concepts) {
  if (!text) return 0;
  
  text = text.toLowerCase();
  const textWords = text.split(/\s+/);
  const conceptWords = concepts.toLowerCase().split(/\s+/);
  
  // Direct word match
  let directMatches = 0;
  textWords.forEach(word => {
    if (conceptWords.includes(word)) {
      directMatches += 1;
    }
  });
  
  // Stems and partial matches (simulating embedding closeness)
  let stemMatches = 0;
  textWords.forEach(textWord => {
    if (textWord.length < 3) return; // Skip short words
    
    conceptWords.forEach(conceptWord => {
      if (conceptWord.length < 3) return; // Skip short words
      
      // Check for stem matches (beginning of words)
      if (textWord.startsWith(conceptWord.substring(0, 3)) || 
          conceptWord.startsWith(textWord.substring(0, 3))) {
        stemMatches += 0.3;
      }
      
      // Check for substring matches anywhere in the word
      if (textWord.includes(conceptWord) || conceptWord.includes(textWord)) {
        stemMatches += 0.2;
      }
    });
  });
  
  // Check for phrase matches and concept clusters
  let phraseMatches = 0;
  // Look for short phrases (2-3 words) in both text and concepts
  for (let i = 0; i < textWords.length - 1; i++) {
    const textPhrase = textWords.slice(i, i + 2).join(' ');
    if (concepts.includes(textPhrase)) {
      phraseMatches += 0.7;
    }
  }
  
  // Semantic analysis of the full text against concept clusters
  const textLength = textWords.length;
  const conceptLength = conceptWords.length;
  
  // Overall resonance score - weighted combination of different matching types
  const resonance = 
    (directMatches * 1.0 + stemMatches * 0.5 + phraseMatches * 1.5) / 
    (Math.max(textLength, conceptLength) * 0.7);
  
  // Non-linear scaling to accentuate stronger matches
  return Math.min(1, resonance * 1.5);
}

// Define other helper functions needed
function polarToParameter(positivePole, negativePole) {
  const sum = positivePole + negativePole;
  
  // If neither pole has significant weight, return mid-range value
  if (sum < 0.2) {
    return 50;
  }
  
  // Calculate value based on relative strengths of the poles
  const relativeStrength = positivePole / sum;
  
  // Map to parameter range (0-100)
  return Math.round(relativeStrength * 100);
}

function adjustValue(value, adjustment) {
  return Math.max(0, Math.min(100, value + adjustment));
}

function stringToHash(string) {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    const char = string.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Add the missing function that's called by analyzeText
function generateVibeParametersFromText(text) {
  // Context associations: extract semantic connections with core vibe concepts
  const contextVectors = {
    // Temporal Pace dimension
    pace: {
      fast: contextualAssociation(text, "speed quick rapid fast accelerated swift racing energetic hyper dynamic"),
      slow: contextualAssociation(text, "slow leisurely gradual relaxed gentle calm measured deliberate unhurried") 
    },
    
    // Temporal Rhythm dimension
    rhythm: {
      regular: contextualAssociation(text, "regular structured orderly pattern predictable systematic methodical consistent"),
      irregular: contextualAssociation(text, "irregular chaotic unpredictable erratic random varied unstructured improvised")
    },
    
    // Temporal Density dimension
    density: {
      dense: contextualAssociation(text, "dense crowded busy packed concentrated thick complex congested full"),
      sparse: contextualAssociation(text, "sparse minimal empty open spaced airy uncluttered scattered light")
    },
    
    // Energy Intensity dimension
    intensity: {
      high: contextualAssociation(text, "intense powerful energetic vibrant forceful strong potent fierce dynamic active"),
      low: contextualAssociation(text, "calm gentle soft subtle mild delicate light tender quiet relaxed")
    },
    
    // Energy Flow dimension
    flow: {
      smooth: contextualAssociation(text, "flowing smooth continuous fluid seamless uninterrupted coherent connected"),
      staccato: contextualAssociation(text, "staccato choppy broken interrupted disjointed fragmented disconnected abrupt")
    },
    
    // Energy Stability dimension
    stability: {
      stable: contextualAssociation(text, "stable steady reliable consistent dependable grounded secure balanced controlled"),
      unstable: contextualAssociation(text, "chaotic unstable volatile turbulent fluctuating wild unpredictable uncontrolled precarious")
    },
    
    // Sensory Brightness dimension
    brightness: {
      bright: contextualAssociation(text, "bright light shining illuminated radiant luminous brilliant glowing sunny clear"),
      dark: contextualAssociation(text, "dark dim shadowy murky gloomy dusky obscure somber muted unclear")
    },
    
    // Sensory Warmth dimension
    warmth: {
      warm: contextualAssociation(text, "warm hot heat cozy tropical fire burning toasty summer heated blazing"),
      cool: contextualAssociation(text, "cool cold chill icy frost frigid winter snow frozen refreshing chilly")
    },
    
    // Sensory Texture dimension
    texture: {
      rough: contextualAssociation(text, "rough rugged coarse grainy jagged uneven textured bumpy gritty scratchy"),
      smooth: contextualAssociation(text, "smooth polished sleek silky glossy slick refined velvety soft satin")
    }
  };

  // Cultural/domain associations to adjust the values
  const culturalVectors = {
    // Different domains and their representative embedding regions
    natural: contextualAssociation(text, "nature forest trees mountain river lake ocean wildlife natural organic ecological"),
    urban: contextualAssociation(text, "city urban street building downtown metropolitan skyscraper concrete traffic artificial"),
    digital: contextualAssociation(text, "digital tech electronic virtual cyber computer technology digital internet online code"),
    nostalgic: contextualAssociation(text, "nostalgic retro vintage antique classic old-school throwback memory reminiscent historical"),
    
    // Different moods and their representative embedding regions
    peaceful: contextualAssociation(text, "peaceful tranquil serene calm relaxed gentle soothing meditative placid quiet"),
    energetic: contextualAssociation(text, "energetic lively dynamic vibrant active excited enthusiastic spirited invigorating stimulating"),
    melancholic: contextualAssociation(text, "melancholic sad wistful somber gloomy mournful pensive bittersweet sorrowful solemn"),
    joyful: contextualAssociation(text, "joyful happy excited cheerful jubilant elated delighted upbeat pleased merry"),
    
    // Different aesthetic styles and their representative embedding regions
    minimalist: contextualAssociation(text, "minimalist simple clean uncluttered stark essential basic bare sleek elegant"),
    ornate: contextualAssociation(text, "ornate elaborate intricate detailed decorated ornamental complex fancy adorned embellished"),
    futuristic: contextualAssociation(text, "futuristic sci-fi advanced high-tech cutting-edge innovative modern state-of-the-art"),
    rustic: contextualAssociation(text, "rustic rural country rough earthy natural homey artisanal traditional folk")
  };

  // Special contexts that have strong established vibes
  const specialContexts = {
    // Places with strong vibes
    "beach": contextualAssociation(text, "beach ocean sand waves surf shoreline coastal sea summer vacation sunny"),
    "forest": contextualAssociation(text, "forest woods trees nature hiking trails wildlife birds flowers peaceful serene"),
    "nightclub": contextualAssociation(text, "nightclub club party dance music DJ loud night dark strobe crowded"),
    "library": contextualAssociation(text, "library books quiet reading study knowledge silence shelves academic organized clean"),
    "cafe": contextualAssociation(text, "cafe coffee tea pastry conversation cozy warm relaxed casual social ambient"),
    
    // Times with strong vibes
    "morning": contextualAssociation(text, "morning sunrise dawn early fresh new beginning awakening breakfast dew"),
    "night": contextualAssociation(text, "night dark evening late stars moonlight dusk midnight darkness nocturnal"),
    "twilight": contextualAssociation(text, "twilight dusk sunset evening gloaming half-light fading purple orange hazy"),
    
    // Seasons with strong vibes
    "summer": contextualAssociation(text, "summer hot warm sunshine beach vacation green vibrant bright long-days heat"),
    "winter": contextualAssociation(text, "winter cold snow ice frost chill freezing holiday cozy dark white"),
    "autumn": contextualAssociation(text, "autumn fall leaves orange red cool crisp harvest pumpkin change wind"),
    "spring": contextualAssociation(text, "spring bloom flowers fresh green growing new rain renewal rebirth pastel"),
    
    // Aesthetic movements with strong vibes
    "cyberpunk": contextualAssociation(text, "cyberpunk neon dystopian future tech urban hacker digital gritty dark"),
    "vaporwave": contextualAssociation(text, "vaporwave retro 80s 90s pastel pink blue digital nostalgic glitch aesthetic"),
    "cottagecore": contextualAssociation(text, "cottagecore cottage rural idyllic pastoral farm garden nature cozy handmade"),
    "modern": contextualAssociation(text, "modern contemporary sleek clean minimal uncluttered current today's progressive"),
    
    // Music genres with strong vibes
    "jazz": contextualAssociation(text, "jazz saxophone trumpet improvisation blues rhythm smooth mellow musical sophisticated"),
    "rock": contextualAssociation(text, "rock guitar drums electric amplified loud band energetic concert live"),
    "classical": contextualAssociation(text, "classical orchestra symphony strings refined elegant complex structured cultured"),
    "electronic": contextualAssociation(text, "electronic digital synthesizer beats produced techno EDM artificial programmed"),
    
    // Japanese music contexts (added for city pop)
    "japanese": contextualAssociation(text, "japan japanese tokyo kyoto osaka nihon nippon kanji katakana hiragana"),
    "city pop": contextualAssociation(text, "city pop jpop japanese 80s urban sophisticated smooth synth nostalgic tatsuro yamashita"),
    
    // Emotional states with strong vibes
    "joyful": contextualAssociation(text, "joy happy excitement elation delight pleasure upbeat cheerful mirth enthusiasm"),
    "melancholy": contextualAssociation(text, "melancholy sad wistful nostalgic thoughtful reflective sorrow longing introspective"),
    "serene": contextualAssociation(text, "serenity calm peaceful quiet tranquil still undisturbed composed untroubled"),
    "chaotic": contextualAssociation(text, "chaos disorder confusion turmoil disarray jumble mayhem madness disruption")
  };

  // For direct dimensions, calculate relative positions between poles
  const temporalPace = polarToParameter(contextVectors.pace.fast, contextVectors.pace.slow);
  const temporalRhythm = polarToParameter(contextVectors.rhythm.irregular, contextVectors.rhythm.regular);
  const temporalDensity = polarToParameter(contextVectors.density.dense, contextVectors.density.sparse);
  const energyIntensity = polarToParameter(contextVectors.intensity.high, contextVectors.intensity.low);
  const energyFlow = polarToParameter(contextVectors.flow.smooth, contextVectors.flow.staccato);
  const energyStability = polarToParameter(contextVectors.stability.stable, contextVectors.stability.unstable);
  const sensoryBrightness = polarToParameter(contextVectors.brightness.bright, contextVectors.brightness.dark);
  const sensoryWarmth = polarToParameter(contextVectors.warmth.warm, contextVectors.warmth.cool);
  const sensoryTexture = polarToParameter(contextVectors.texture.rough, contextVectors.texture.smooth);
  
  // Start with our initial values
  let values = {
    temporalPace,
    temporalRhythm,
    temporalDensity,
    energyIntensity,
    energyFlow,
    energyStability,
    sensoryBrightness,
    sensoryWarmth,
    sensoryTexture
  };

  // Apply cultural context modifiers
  if (culturalVectors.natural > 0.2) {
    values.temporalPace = adjustValue(values.temporalPace, -20 * culturalVectors.natural);
    values.energyFlow = adjustValue(values.energyFlow, 15 * culturalVectors.natural);
    values.sensoryBrightness = adjustValue(values.sensoryBrightness, 10 * culturalVectors.natural);
  }
  
  if (culturalVectors.urban > 0.2) {
    values.temporalPace = adjustValue(values.temporalPace, 20 * culturalVectors.urban);
    values.temporalDensity = adjustValue(values.temporalDensity, 20 * culturalVectors.urban);
    values.sensoryTexture = adjustValue(values.sensoryTexture, 10 * culturalVectors.urban);
  }
  
  if (culturalVectors.digital > 0.2) {
    values.temporalPace = adjustValue(values.temporalPace, 15 * culturalVectors.digital);
    values.energyFlow = adjustValue(values.energyFlow, -10 * culturalVectors.digital);
    values.sensoryTexture = adjustValue(values.sensoryTexture, -15 * culturalVectors.digital);
  }
  
  if (culturalVectors.nostalgic > 0.2) {
    values.temporalPace = adjustValue(values.temporalPace, -15 * culturalVectors.nostalgic);
    values.sensoryWarmth = adjustValue(values.sensoryWarmth, 15 * culturalVectors.nostalgic);
    values.sensoryBrightness = adjustValue(values.sensoryBrightness, -10 * culturalVectors.nostalgic);
  }
  
  if (culturalVectors.peaceful > 0.2) {
    values.temporalPace = adjustValue(values.temporalPace, -20 * culturalVectors.peaceful);
    values.energyIntensity = adjustValue(values.energyIntensity, -20 * culturalVectors.peaceful);
    values.energyStability = adjustValue(values.energyStability, 15 * culturalVectors.peaceful);
  }
  
  if (culturalVectors.energetic > 0.2) {
    values.temporalPace = adjustValue(values.temporalPace, 20 * culturalVectors.energetic);
    values.energyIntensity = adjustValue(values.energyIntensity, 20 * culturalVectors.energetic);
    values.sensoryBrightness = adjustValue(values.sensoryBrightness, 10 * culturalVectors.energetic);
  }
  
  if (culturalVectors.melancholic > 0.2) {
    values.temporalPace = adjustValue(values.temporalPace, -15 * culturalVectors.melancholic);
    values.sensoryBrightness = adjustValue(values.sensoryBrightness, -20 * culturalVectors.melancholic);
    values.sensoryWarmth = adjustValue(values.sensoryWarmth, -10 * culturalVectors.melancholic);
  }
  
  if (culturalVectors.joyful > 0.2) {
    values.temporalPace = adjustValue(values.temporalPace, 15 * culturalVectors.joyful);
    values.sensoryBrightness = adjustValue(values.sensoryBrightness, 20 * culturalVectors.joyful);
    values.sensoryWarmth = adjustValue(values.sensoryWarmth, 15 * culturalVectors.joyful);
  }
  
  if (culturalVectors.minimalist > 0.2) {
    values.temporalDensity = adjustValue(values.temporalDensity, -20 * culturalVectors.minimalist);
    values.temporalRhythm = adjustValue(values.temporalRhythm, -15 * culturalVectors.minimalist);
    values.sensoryTexture = adjustValue(values.sensoryTexture, -15 * culturalVectors.minimalist);
  }
  
  if (culturalVectors.ornate > 0.2) {
    values.temporalDensity = adjustValue(values.temporalDensity, 20 * culturalVectors.ornate);
    values.temporalRhythm = adjustValue(values.temporalRhythm, 10 * culturalVectors.ornate);
    values.sensoryTexture = adjustValue(values.sensoryTexture, 20 * culturalVectors.ornate);
  }

  // Apply special context modifiers
  Object.entries(specialContexts).forEach(([context, strength]) => {
    if (strength > 0.2) {
      // Special contexts with strong established vibes
      switch(context) {
        // Places
        case "beach":
          values.temporalPace = adjustValue(values.temporalPace, -15 * strength);
          values.energyFlow = adjustValue(values.energyFlow, 20 * strength);
          values.sensoryBrightness = adjustValue(values.sensoryBrightness, 25 * strength);
          values.sensoryWarmth = adjustValue(values.sensoryWarmth, 25 * strength);
          break;
        case "forest":
          values.temporalPace = adjustValue(values.temporalPace, -20 * strength);
          values.energyIntensity = adjustValue(values.energyIntensity, -15 * strength);
          values.sensoryBrightness = adjustValue(values.sensoryBrightness, -10 * strength);
          values.sensoryTexture = adjustValue(values.sensoryTexture, 15 * strength);
          break;
        case "nightclub":
          values.temporalPace = adjustValue(values.temporalPace, 30 * strength);
          values.temporalRhythm = adjustValue(values.temporalRhythm, 15 * strength);
          values.energyIntensity = adjustValue(values.energyIntensity, 30 * strength);
          values.sensoryBrightness = adjustValue(values.sensoryBrightness, -15 * strength);
          break;
        case "library":
          values.temporalPace = adjustValue(values.temporalPace, -25 * strength);
          values.temporalDensity = adjustValue(values.temporalDensity, 15 * strength);
          values.energyIntensity = adjustValue(values.energyIntensity, -25 * strength);
          values.energyStability = adjustValue(values.energyStability, 30 * strength);
          break;
          
        // Times
        case "morning":
          values.temporalPace = adjustValue(values.temporalPace, 10 * strength);
          values.sensoryBrightness = adjustValue(values.sensoryBrightness, 25 * strength);
          values.sensoryWarmth = adjustValue(values.sensoryWarmth, 15 * strength);
          break;
        case "night":
          values.temporalPace = adjustValue(values.temporalPace, -10 * strength);
          values.sensoryBrightness = adjustValue(values.sensoryBrightness, -30 * strength);
          values.sensoryWarmth = adjustValue(values.sensoryWarmth, -15 * strength);
          break;
          
        // Seasons
        case "summer":
          values.temporalPace = adjustValue(values.temporalPace, 15 * strength);
          values.energyIntensity = adjustValue(values.energyIntensity, 20 * strength);
          values.sensoryBrightness = adjustValue(values.sensoryBrightness, 25 * strength);
          values.sensoryWarmth = adjustValue(values.sensoryWarmth, 30 * strength);
          break;
        case "winter":
          values.temporalPace = adjustValue(values.temporalPace, -15 * strength);
          values.energyIntensity = adjustValue(values.energyIntensity, -15 * strength);
          values.sensoryBrightness = adjustValue(values.sensoryBrightness, 10 * strength);
          values.sensoryWarmth = adjustValue(values.sensoryWarmth, -30 * strength);
          break;
          
        // Aesthetics
        case "cyberpunk":
          values.temporalPace = adjustValue(values.temporalPace, 20 * strength);
          values.temporalDensity = adjustValue(values.temporalDensity, 25 * strength);
          values.energyStability = adjustValue(values.energyStability, -20 * strength);
          values.sensoryBrightness = adjustValue(values.sensoryBrightness, -10 * strength);
          values.sensoryWarmth = adjustValue(values.sensoryWarmth, -15 * strength);
          break;
        case "vaporwave":
          values.temporalPace = adjustValue(values.temporalPace, -15 * strength);
          values.energyFlow = adjustValue(values.energyFlow, 20 * strength);
          values.sensoryBrightness = adjustValue(values.sensoryBrightness, 15 * strength);
          values.sensoryWarmth = adjustValue(values.sensoryWarmth, 10 * strength);
          break;
          
        // Music genres
        case "jazz":
          values.temporalRhythm = adjustValue(values.temporalRhythm, 20 * strength);
          values.energyFlow = adjustValue(values.energyFlow, 25 * strength);
          values.energyStability = adjustValue(values.energyStability, -15 * strength);
          values.sensoryWarmth = adjustValue(values.sensoryWarmth, 20 * strength);
          break;
        case "classical":
          values.temporalDensity = adjustValue(values.temporalDensity, 20 * strength);
          values.energyFlow = adjustValue(values.energyFlow, 15 * strength);
          values.energyStability = adjustValue(values.energyStability, 20 * strength);
          break;
          
        // Japanese specific
        case "japanese":
          values.temporalPace = adjustValue(values.temporalPace, -5 * strength); 
          values.energyFlow = adjustValue(values.energyFlow, 10 * strength);
          values.sensoryTexture = adjustValue(values.sensoryTexture, -10 * strength);
          break;
        case "city pop":
          values.temporalPace = adjustValue(values.temporalPace, 10 * strength);
          values.temporalRhythm = adjustValue(values.temporalRhythm, -10 * strength);
          values.energyFlow = adjustValue(values.energyFlow, 15 * strength);
          values.sensoryBrightness = adjustValue(values.sensoryBrightness, 15 * strength);
          values.sensoryWarmth = adjustValue(values.sensoryWarmth, 15 * strength);
          break;
          
        // Emotional states  
        case "chaotic":
          values.temporalRhythm = adjustValue(values.temporalRhythm, 30 * strength);
          values.energyStability = adjustValue(values.energyStability, -30 * strength);
          values.temporalDensity = adjustValue(values.temporalDensity, 15 * strength);
          break;
        case "serene":
          values.temporalPace = adjustValue(values.temporalPace, -25 * strength);
          values.energyIntensity = adjustValue(values.energyIntensity, -25 * strength);
          values.energyStability = adjustValue(values.energyStability, 25 * strength);
          values.energyFlow = adjustValue(values.energyFlow, 20 * strength);
          break;
      }
    }
  });
  
  // Add a touch of hash-based pseudo-randomness to make each input uniquely deterministic
  const textHash = stringToHash(text);
  
  // Use hash to add slight variations to each parameter
  Object.keys(values).forEach(key => {
    // Generate a value between -7 and 7 that is consistent for this text
    const randomOffset = ((textHash + key.length) % 15) - 7;
    values[key] = adjustValue(values[key], randomOffset);
  });
  
  // Ensure all values are between 0 and 100
  Object.keys(values).forEach(key => {
    values[key] = Math.max(0, Math.min(100, Math.round(values[key])));
  });
  
  return values;
}

// Execute the analysis
console.log("Processing query: " + query);
const vibeResult = analyzeText(query);

// Generate domain translations
function generateDomainTranslation(vibeParams) {
  // Music domain translation
  let musicDescription = "";
  
  if (vibeParams.temporalPace <= 30) {
    musicDescription += "Slow-tempo, ";
  } else if (vibeParams.temporalPace >= 70) {
    musicDescription += "Up-tempo, ";
  } else {
    musicDescription += "Mid-tempo, ";
  }
  
  if (vibeParams.temporalRhythm <= 30) {
    musicDescription += "structured rhythm with ";
  } else if (vibeParams.temporalRhythm >= 70) {
    musicDescription += "improvised patterns with ";
  } else {
    musicDescription += "balanced rhythm with ";
  }
  
  if (vibeParams.energyIntensity <= 30) {
    musicDescription += "gentle intensity. ";
  } else if (vibeParams.energyIntensity >= 70) {
    musicDescription += "driving intensity. ";
  } else {
    musicDescription += "moderate intensity. ";
  }
  
  if (vibeParams.sensoryWarmth >= 60) {
    musicDescription += "Warm tones ";
  } else if (vibeParams.sensoryWarmth <= 40) {
    musicDescription += "Cool tones ";
  } else {
    musicDescription += "Balanced tones ";
  }
  
  if (vibeParams.sensoryBrightness >= 60) {
    musicDescription += "with bright, ";
  } else if (vibeParams.sensoryBrightness <= 40) {
    musicDescription += "with deep, ";
  } else {
    musicDescription += "with mid-range, ";
  }
  
  if (vibeParams.temporalDensity >= 60) {
    musicDescription += "richly layered instrumentation.";
  } else if (vibeParams.temporalDensity <= 40) {
    musicDescription += "spacious, minimal arrangement.";
  } else {
    musicDescription += "balanced instrumentation.";
  }
  
  // Japanese City Pop Specific Interpretation
  if (query.toLowerCase().includes("japanese") && query.toLowerCase().includes("city pop")) {
    musicDescription += "\n\nAs Japanese City Pop: Smooth, sophisticated urban pop from 1980s Japan with glossy production, jazz and funk influences, nostalgic city nightlife themes, and meticulous studio arrangements. Characterized by crisp rhythms, prominently featured synthesizers, and a fusion of Western influences with distinctly Japanese sensibilities. Artists like Tatsuro Yamashita, Mariya Takeuchi, and Taeko Onuki define the genre with its polished, cosmopolitan sound that evokes neon-lit cityscapes.";
  }
  
  return {
    music: musicDescription
  };
}

// Generate a more detailed vibe analysis
const domainTranslation = generateDomainTranslation(vibeResult);

// Create a description for Japanese City Pop
let cityPopDescription = "";
if (query.toLowerCase().includes("japanese") && query.toLowerCase().includes("city pop")) {
  cityPopDescription = `
JAPANESE CITY POP VIBE ANALYSIS:
-------------------------------
Japanese city pop combines urban sophistication with nostalgic retro elements, creating a smooth, polished atmosphere that's simultaneously energetic and relaxed. The genre emerged in 1970s-80s Japan during the economic boom, reflecting cosmopolitan aspirations and Western influences.

Core Elements:
- Moderate-to-upbeat tempo (${vibeResult.temporalPace}/100) with strong rhythm foundations
- Regular, structured patterns (${vibeResult.temporalRhythm}/100) with jazz-influenced sophistication
- Bright, warm tonal qualities (Brightness: ${vibeResult.sensoryBrightness}/100, Warmth: ${vibeResult.sensoryWarmth}/100)
- Smooth, flowing textures (${vibeResult.sensoryTexture}/100) with polished production
- Balanced energy that's sophisticated but accessible (${vibeResult.energyIntensity}/100)

Cultural Associations:
- Urban nightlife scenes and cityscapes
- Affluence and metropolitan lifestyle
- Nostalgic retrofuturism
- Technological optimism of bubble-era Japan
- Western influences (funk, soul, jazz, disco) with Japanese sensibilities

If translated to other domains:
- Visual: Neon-lit urban nightscapes, soft-focus photography, pastel color palettes
- Spatial: High-rise apartment with city views, designer furniture, mood lighting
- Fashion: Elegant casual wear, sophisticated but accessible styling
`;
}

// Print the result
console.log("\nVIBE ANALYSIS RESULTS:");
console.log("=====================");
console.log(JSON.stringify(vibeResult, null, 2));
console.log("\nDOMAIN TRANSLATION:");
console.log("==================");
console.log("Music Domain:");
console.log(domainTranslation.music);

console.log(cityPopDescription);