// Simple standalone script to analyze "japanese city pop" vibe
// No dependencies on browser environment

// Get the query from command line arguments or use default
const query = process.argv[2] || "japanese city pop";

// Contextual association function
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
  
  // Stems and partial matches
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
  
  // Overall resonance score - weighted combination of different matching types
  const resonance = 
    (directMatches * 1.0 + stemMatches * 0.5 + phraseMatches * 1.5) / 
    (Math.max(textWords.length, conceptWords.length) * 0.7);
  
  // Non-linear scaling to accentuate stronger matches
  return Math.min(1, resonance * 1.5);
}

// Helper function to map opposing poles to parameter value
function polarToParameter(positivePole, negativePole) {
  const sum = positivePole + negativePole;
  
  if (sum < 0.2) return 50;
  
  const relativeStrength = positivePole / sum;
  return Math.round(relativeStrength * 100);
}

// Helper function to adjust a value while keeping it in range
function adjustValue(value, adjustment) {
  return Math.max(0, Math.min(100, value + adjustment));
}

// Simple hash function for pseudo-randomness
function stringToHash(string) {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    const char = string.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// The main analyzer function
function analyzeVibeText(text) {
  console.log(`Analyzing: "${text}"`);
  
  // Context associations for core dimensions
  const contextVectors = {
    pace: {
      fast: contextualAssociation(text, "speed quick rapid fast accelerated swift racing energetic dynamic"),
      slow: contextualAssociation(text, "slow leisurely gradual relaxed gentle calm measured deliberate") 
    },
    rhythm: {
      regular: contextualAssociation(text, "regular structured orderly pattern predictable systematic consistent"),
      irregular: contextualAssociation(text, "irregular chaotic unpredictable erratic random varied unstructured")
    },
    density: {
      dense: contextualAssociation(text, "dense crowded busy packed concentrated thick complex congested"),
      sparse: contextualAssociation(text, "sparse minimal empty open spaced airy uncluttered scattered")
    },
    intensity: {
      high: contextualAssociation(text, "intense powerful energetic vibrant forceful strong potent dynamic"),
      low: contextualAssociation(text, "calm gentle soft subtle mild delicate light tender quiet")
    },
    flow: {
      smooth: contextualAssociation(text, "flowing smooth continuous fluid seamless uninterrupted coherent"),
      staccato: contextualAssociation(text, "staccato choppy broken interrupted disjointed fragmented disconnected")
    },
    stability: {
      stable: contextualAssociation(text, "stable steady reliable consistent dependable grounded secure balanced"),
      unstable: contextualAssociation(text, "chaotic unstable volatile turbulent fluctuating wild unpredictable")
    },
    brightness: {
      bright: contextualAssociation(text, "bright light shining illuminated radiant luminous brilliant glowing"),
      dark: contextualAssociation(text, "dark dim shadowy murky gloomy dusky obscure somber muted")
    },
    warmth: {
      warm: contextualAssociation(text, "warm hot heat cozy tropical fire burning toasty summer"),
      cool: contextualAssociation(text, "cool cold chill icy frost frigid winter snow frozen")
    },
    texture: {
      rough: contextualAssociation(text, "rough rugged coarse grainy jagged uneven textured bumpy gritty"),
      smooth: contextualAssociation(text, "smooth polished sleek silky glossy slick refined velvety soft")
    }
  };
  
  // Cultural associations
  const culturalVectors = {
    urban: contextualAssociation(text, "city urban street building downtown metropolitan skyscraper concrete"),
    nostalgic: contextualAssociation(text, "nostalgic retro vintage antique classic old-school throwback memory"),
    sophisticated: contextualAssociation(text, "sophisticated elegant refined cultured classy tasteful upscale"),
    japanese: contextualAssociation(text, "japan japanese tokyo kyoto osaka nihon nippon tokyo kanji"),
    eighties: contextualAssociation(text, "eighties 80s 1980s 80's eighties-era cassette walkman"),
    pop: contextualAssociation(text, "pop popular mainstream catchy melody hook accessible"),
    funk: contextualAssociation(text, "funk groove bass rhythm section syncopated dance"),
    jazz: contextualAssociation(text, "jazz saxophone trumpet piano ensemble improvised cool smooth")
  };
  
  // Special music contexts
  const musicGenres = {
    "city pop": contextualAssociation(text, "city pop jpop japanese 80s urban sophisticated smooth synth"),
    "jazz fusion": contextualAssociation(text, "jazz fusion instrumental complex sophisticated technical"),
    "disco": contextualAssociation(text, "disco dance floor groove beat rhythmic 70s glitter"),
    "synth pop": contextualAssociation(text, "synth synthesizer electronic keyboard programmed artificial"),
    "funk": contextualAssociation(text, "funk rhythm groove bass drums danceable section tight")
  };
  
  // Calculate vibe parameters from contextual associations
  const temporalPace = polarToParameter(contextVectors.pace.fast, contextVectors.pace.slow);
  const temporalRhythm = polarToParameter(contextVectors.rhythm.irregular, contextVectors.rhythm.regular);
  const temporalDensity = polarToParameter(contextVectors.density.dense, contextVectors.density.sparse);
  const energyIntensity = polarToParameter(contextVectors.intensity.high, contextVectors.intensity.low);
  const energyFlow = polarToParameter(contextVectors.flow.smooth, contextVectors.flow.staccato);
  const energyStability = polarToParameter(contextVectors.stability.stable, contextVectors.stability.unstable);
  const sensoryBrightness = polarToParameter(contextVectors.brightness.bright, contextVectors.brightness.dark);
  const sensoryWarmth = polarToParameter(contextVectors.warmth.warm, contextVectors.warmth.cool);
  const sensoryTexture = polarToParameter(contextVectors.texture.rough, contextVectors.texture.smooth);
  
  // Start with base values
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
  
  // Apply Japanese City Pop specific modifiers
  if (text.toLowerCase().includes("japanese") && text.toLowerCase().includes("city pop")) {
    // Japanese City Pop has specific characteristics
    
    // Medium-fast tempo, sophisticated vibe
    values.temporalPace = adjustValue(values.temporalPace, 15); 
    
    // Regular, structured rhythms
    values.temporalRhythm = adjustValue(values.temporalRhythm, -20);
    
    // Medium-dense instrumentation (full band sound)
    values.temporalDensity = adjustValue(values.temporalDensity, 10);
    
    // Medium energy, not too intense but not mellow
    values.energyIntensity = adjustValue(values.energyIntensity, 5);
    
    // Very smooth, flowing sound
    values.energyFlow = adjustValue(values.energyFlow, 20);
    
    // Stable, consistent production
    values.energyStability = adjustValue(values.energyStability, 15);
    
    // Bright, polished sound
    values.sensoryBrightness = adjustValue(values.sensoryBrightness, 15);
    
    // Warm production aesthetic
    values.sensoryWarmth = adjustValue(values.sensoryWarmth, 20);
    
    // Smooth, polished production
    values.sensoryTexture = adjustValue(values.sensoryTexture, -25);
  }
  
  // Apply cultural modifiers
  if (culturalVectors.urban > 0.2) {
    values.temporalPace = adjustValue(values.temporalPace, 10 * culturalVectors.urban);
    values.sensoryBrightness = adjustValue(values.sensoryBrightness, 15 * culturalVectors.urban);
  }
  
  if (culturalVectors.nostalgic > 0.2) {
    values.sensoryWarmth = adjustValue(values.sensoryWarmth, 15 * culturalVectors.nostalgic);
    values.energyFlow = adjustValue(values.energyFlow, 10 * culturalVectors.nostalgic);
  }
  
  if (culturalVectors.japanese > 0.2) {
    values.sensoryTexture = adjustValue(values.sensoryTexture, -10 * culturalVectors.japanese);
    values.energyStability = adjustValue(values.energyStability, 10 * culturalVectors.japanese);
  }
  
  if (culturalVectors.eighties > 0.2) {
    values.sensoryBrightness = adjustValue(values.sensoryBrightness, 10 * culturalVectors.eighties);
    values.sensoryWarmth = adjustValue(values.sensoryWarmth, 15 * culturalVectors.eighties);
  }
  
  if (culturalVectors.sophisticated > 0.2) {
    values.temporalDensity = adjustValue(values.temporalDensity, 15 * culturalVectors.sophisticated);
    values.energyFlow = adjustValue(values.energyFlow, 15 * culturalVectors.sophisticated);
  }
  
  // Apply music genre modifiers
  Object.entries(musicGenres).forEach(([genre, strength]) => {
    if (strength > 0.2) {
      switch(genre) {
        case "city pop":
          values.temporalPace = adjustValue(values.temporalPace, 10 * strength);
          values.sensoryBrightness = adjustValue(values.sensoryBrightness, 15 * strength);
          values.sensoryWarmth = adjustValue(values.sensoryWarmth, 15 * strength);
          values.sensoryTexture = adjustValue(values.sensoryTexture, -20 * strength);
          break;
          
        case "jazz fusion":
          values.temporalRhythm = adjustValue(values.temporalRhythm, 15 * strength);
          values.temporalDensity = adjustValue(values.temporalDensity, 20 * strength);
          break;
          
        case "disco":
          values.temporalPace = adjustValue(values.temporalPace, 15 * strength);
          values.temporalRhythm = adjustValue(values.temporalRhythm, -10 * strength);
          values.energyIntensity = adjustValue(values.energyIntensity, 10 * strength);
          break;
          
        case "synth pop":
          values.sensoryTexture = adjustValue(values.sensoryTexture, -15 * strength);
          values.sensoryBrightness = adjustValue(values.sensoryBrightness, 10 * strength);
          break;
          
        case "funk":
          values.temporalRhythm = adjustValue(values.temporalRhythm, -15 * strength);
          values.energyFlow = adjustValue(values.energyFlow, 15 * strength);
          break;
      }
    }
  });
  
  // Add hash-based pseudo-randomness
  const textHash = stringToHash(text);
  Object.keys(values).forEach(key => {
    const randomOffset = ((textHash + key.length) % 15) - 7;
    values[key] = adjustValue(values[key], randomOffset);
  });
  
  // Ensure all values are between 0 and 100
  Object.keys(values).forEach(key => {
    values[key] = Math.max(0, Math.min(100, Math.round(values[key])));
  });
  
  return values;
}

// Generate domain translation (music description)
function generateMusicDescription(vibeParams) {
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
  
  return musicDescription;
}

// Generate space/environment translation
function generateSpaceDescription(vibeParams) {
  let spaceDescription = "";
  
  if (vibeParams.temporalPace <= 30) {
    spaceDescription += "A calm, unhurried environment ";
  } else if (vibeParams.temporalPace >= 70) {
    spaceDescription += "A dynamic, fast-paced environment ";
  } else {
    spaceDescription += "A balanced, moderate-energy environment ";
  }
  
  if (vibeParams.sensoryBrightness >= 60) {
    spaceDescription += "with bright, ";
  } else if (vibeParams.sensoryBrightness <= 40) {
    spaceDescription += "with subdued, ";
  } else {
    spaceDescription += "with balanced, ";
  }
  
  if (vibeParams.sensoryWarmth >= 60) {
    spaceDescription += "warm lighting. ";
  } else if (vibeParams.sensoryWarmth <= 40) {
    spaceDescription += "cool lighting. ";
  } else {
    spaceDescription += "neutral lighting. ";
  }
  
  if (vibeParams.temporalDensity >= 60) {
    spaceDescription += "The space is densely filled ";
  } else if (vibeParams.temporalDensity <= 40) {
    spaceDescription += "The space is minimally decorated ";
  } else {
    spaceDescription += "The space has a balanced composition ";
  }
  
  if (vibeParams.sensoryTexture >= 60) {
    spaceDescription += "with textured, tactile surfaces.";
  } else if (vibeParams.sensoryTexture <= 40) {
    spaceDescription += "with smooth, polished surfaces.";
  } else {
    spaceDescription += "with varied surface textures.";
  }
  
  return spaceDescription;
}

// Generate visual/art translation
function generateVisualDescription(vibeParams) {
  let visualDescription = "";
  
  if (vibeParams.energyIntensity <= 30) {
    visualDescription += "A subtle, gentle composition ";
  } else if (vibeParams.energyIntensity >= 70) {
    visualDescription += "A bold, dynamic composition ";
  } else {
    visualDescription += "A balanced, medium-intensity composition ";
  }
  
  if (vibeParams.temporalRhythm <= 30) {
    visualDescription += "with ordered, structured arrangement. ";
  } else if (vibeParams.temporalRhythm >= 70) {
    visualDescription += "with spontaneous, organic arrangement. ";
  } else {
    visualDescription += "with semi-structured arrangement. ";
  }
  
  if (vibeParams.sensoryBrightness >= 60) {
    visualDescription += "Bright, ";
  } else if (vibeParams.sensoryBrightness <= 40) {
    visualDescription += "Deep, ";
  } else {
    visualDescription += "Balanced, ";
  }
  
  if (vibeParams.sensoryWarmth >= 60) {
    visualDescription += "warm color palette ";
  } else if (vibeParams.sensoryWarmth <= 40) {
    visualDescription += "cool color palette ";
  } else {
    visualDescription += "neutral color palette ";
  }
  
  if (vibeParams.temporalDensity >= 60) {
    visualDescription += "with rich detail and complexity.";
  } else if (vibeParams.temporalDensity <= 40) {
    visualDescription += "with minimal, focused elements.";
  } else {
    visualDescription += "with moderate level of detail.";
  }
  
  return visualDescription;
}

// Create a description for Japanese City Pop
function createJapaneseCityPopDescription(vibeParams) {
  return `
JAPANESE CITY POP VIBE ANALYSIS:
-------------------------------
Japanese city pop combines urban sophistication with nostalgic retro elements, creating a smooth, polished atmosphere that's simultaneously energetic and relaxed. The genre emerged in 1970s-80s Japan during the economic boom, reflecting cosmopolitan aspirations and Western influences.

Core Elements:
- Moderate-to-upbeat tempo (${vibeParams.temporalPace}/100) with strong rhythm foundations
- Regular, structured patterns (${vibeParams.temporalRhythm}/100) with jazz-influenced sophistication
- Bright, warm tonal qualities (Brightness: ${vibeParams.sensoryBrightness}/100, Warmth: ${vibeParams.sensoryWarmth}/100)
- Smooth, flowing textures (${vibeParams.sensoryTexture}/100) with polished production
- Balanced energy that's sophisticated but accessible (${vibeParams.energyIntensity}/100)

Cultural Associations:
- Urban nightlife scenes and cityscapes
- Affluence and metropolitan lifestyle
- Nostalgic retrofuturism
- Technological optimism of bubble-era Japan
- Western influences (funk, soul, jazz, disco) with Japanese sensibilities

Representative Artists:
- Tatsuro Yamashita
- Mariya Takeuchi
- Toshiki Kadomatsu
- Taeko Onuki
- Miki Matsubara

If translated to other domains:
- Visual: Neon-lit urban nightscapes, soft-focus photography, pastel color palettes
- Spatial: High-rise apartment with city views, designer furniture, mood lighting
- Fashion: Elegant casual wear, sophisticated but accessible styling
`;
}

// Run the analysis
const vibeResult = analyzeVibeText(query);

// Generate domain translations
const musicDescription = generateMusicDescription(vibeResult);
const spaceDescription = generateSpaceDescription(vibeResult);
const visualDescription = generateVisualDescription(vibeResult);
const cityPopDescription = createJapaneseCityPopDescription(vibeResult);

// Print the results
console.log("\nVIBE PARAMETERS:");
console.log("===============");
console.log(JSON.stringify(vibeResult, null, 2));

console.log("\nDOMAIN TRANSLATIONS:");
console.log("===================");
console.log("Music Domain:");
console.log(musicDescription);
console.log("\nSpatial Domain:");
console.log(spaceDescription);
console.log("\nVisual Domain:");
console.log(visualDescription);

console.log("\n" + cityPopDescription);