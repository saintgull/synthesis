/**
 * Vibe Semantic Analysis Module
 * 
 * Integrates the vibe-engineering proximity mapping to analyze text
 * and determine semantic relationships with vibe dimensions and attributes.
 */

// Color mapping dictionary - maps color terms to hue values (0-360 scale)
const colorMap = {
  // Primary colors
  'red': 0,
  'orange': 30,
  'yellow': 60,
  'lime': 90,
  'green': 120,
  'teal': 165,
  'cyan': 180,
  'blue': 240,
  'indigo': 275,
  'purple': 285,
  'magenta': 300,
  'pink': 330,
  
  // Variations
  'scarlet': 8,
  'crimson': 348,
  'maroon': 0,
  'vermilion': 15,
  'amber': 45,
  'gold': 50,
  'chartreuse': 90,
  'olive': 80,
  'sage': 150,
  'emerald': 140,
  'turquoise': 175,
  'aqua': 190,
  'azure': 210,
  'cobalt': 240,
  'navy': 240,
  'violet': 270,
  'lavender': 270,
  'mauve': 276,
  'fuchsia': 310,
  'rose': 330,
  'salmon': 6,
  
  // Desaturated
  'grey': null,
  'gray': null,
  'silver': null,
  'brown': 30,
  'tan': 34,
  'beige': 50,
  'khaki': 54,
  'cream': 60,
  
  // Extremes
  'black': null,
  'white': null
};

// Texture mapping dictionary - maps texture terms to values (0-10 scale, 0=smooth, 10=textured)
const textureMap = {
  'smooth': 0,
  'silky': 1,
  'sleek': 1,
  'polished': 1,
  'slick': 1,
  'glossy': 1,
  'satin': 2,
  'soft': 3,
  'velvety': 3,
  'plush': 4,
  'woven': 5,
  'knitted': 5,
  'fabric': 5,
  'textured': 7,
  'textural': 7,
  'coarse': 8,
  'grainy': 8,
  'rough': 8,
  'rugged': 9,
  'rocky': 9,
  'jagged': 10,
  'sharp': 10
};

// Temperature mapping dictionary - maps temperature terms to values (0-10 scale, 0=cool, 10=warm)
const temperatureMap = {
  'icy': 0,
  'freezing': 0,
  'frigid': 0,
  'cold': 1,
  'chilly': 2,
  'cool': 3,
  'fresh': 4,
  'mild': 5,
  'neutral': 5,
  'lukewarm': 6,
  'warm': 7,
  'toasty': 8,
  'hot': 9,
  'burning': 10,
  'fiery': 10,
  'scorching': 10
};

// Brightness mapping dictionary - maps brightness terms to values (0-10 scale, 0=dark, 10=bright)
const brightnessMap = {
  'black': 0,
  'midnight': 0,
  'dark': 1,
  'shadowy': 2,
  'dim': 2,
  'dusky': 3,
  'muted': 4,
  'medium': 5,
  'neutral': 5,
  'light': 7,
  'bright': 8,
  'vibrant': 8,
  'luminous': 9,
  'brilliant': 9,
  'white': 10,
  'blinding': 10
};

// Pace mapping dictionary - maps pace terms to values (0-10 scale, 0=slow, 10=fast)
const paceMap = {
  'frozen': 0,
  'still': 0,
  'motionless': 0,
  'slow': 1,
  'sluggish': 2,
  'leisurely': 2, 
  'relaxed': 3,
  'gentle': 3,
  'steady': 5,
  'moderate': 5,
  'flowing': 5,
  'brisk': 7,
  'quick': 7,
  'rapid': 8,
  'swift': 8,
  'fast': 9,
  'speedy': 9,
  'racing': 10,
  'frantic': 10
};

// Rhythm mapping dictionary - maps rhythm terms to values (0-10 scale, 0=linear, 10=cyclical)
const rhythmMap = {
  'straight': 0,
  'linear': 0,
  'direct': 1,
  'progressive': 2,
  'sequential': 3,
  'structured': 4,
  'mixed': 5,
  'varied': 6,
  'wave': 7,
  'oscillating': 8,
  'circular': 9,
  'cyclical': 10,
  'looping': 10,
  'recursive': 10
};

// Intensity mapping dictionary - maps intensity terms to values (0-10 scale, 0=ambient, 10=intense)
const intensityMap = {
  'ambient': 0,
  'subtle': 1,
  'gentle': 2,
  'soft': 2,
  'mild': 3,
  'moderate': 5,
  'medium': 5,
  'firm': 6,
  'strong': 7,
  'powerful': 8,
  'energetic': 8,
  'forceful': 9,
  'intense': 10,
  'extreme': 10,
  'overwhelming': 10
};

// Flow mapping dictionary - maps flow pattern terms to values (0-10 scale, 0=flowing, 10=pulsing)
const flowMap = {
  'flowing': 0,
  'continuous': 0,
  'smooth': 1,
  'steady': 2,
  'consistent': 3,
  'even': 3,
  'regular': 5,
  'rhythmic': 7,
  'beating': 8,
  'throbbing': 9,
  'pulsing': 10,
  'pulsating': 10,
  'staccato': 10
};

// Emotional valence mapping dictionary - maps emotional terms to values (-5 to 5 scale, negative to positive)
const valenceMap = {
  'depressing': -5,
  'tragic': -5,
  'miserable': -4,
  'sad': -3,
  'gloomy': -3,
  'melancholic': -3,
  'somber': -2,
  'wistful': -1,
  'bittersweet': 0,
  'neutral': 0,
  'calm': 1,
  'pleasant': 2,
  'cheerful': 3,
  'happy': 4,
  'joyful': 5,
  'euphoric': 5,
  'ecstatic': 5
};

// Arousal mapping dictionary - maps arousal terms to values (0-10 scale, 0=calming, 10=stimulating)
const arousalMap = {
  'calming': 0,
  'soothing': 0,
  'peaceful': 1,
  'serene': 1,
  'relaxing': 2,
  'tranquil': 2,
  'gentle': 3,
  'mild': 4,
  'moderate': 5,
  'engaging': 6,
  'active': 7,
  'energetic': 8,
  'exciting': 9,
  'stimulating': 10,
  'thrilling': 10,
  'intense': 10
};

// Abstraction mapping dictionary - maps abstraction terms to values (0-10 scale, 0=concrete, 10=abstract)
const abstractionMap = {
  'literal': 0,
  'concrete': 0,
  'specific': 1,
  'real': 1,
  'tangible': 2,
  'practical': 3,
  'grounded': 3,
  'representational': 5,
  'symbolic': 7,
  'conceptual': 8,
  'theoretical': 9,
  'abstract': 10,
  'philosophical': 10
};

// Map of attribute keys to their corresponding value dictionaries
const attributeValueMaps = {
  'color': colorMap,
  'texture': textureMap,
  'warmth': temperatureMap,
  'brightness': brightnessMap,
  'pace': paceMap,
  'rhythm': rhythmMap,
  'intensity': intensityMap,
  'flow': flowMap,
  'valence': valenceMap,
  'arousal': arousalMap,
  'abstraction': abstractionMap
};

// Map JavaScript parameter names to attribute keys
const paramToAttrMap = {
  'temporalPace': 'pace',
  'temporalRhythm': 'rhythm',
  'temporalDensity': null, // No direct mapping
  'energyIntensity': 'intensity',
  'energyFlow': 'flow',
  'energyStability': null, // No direct mapping
  'sensoryBrightness': 'brightness',
  'sensoryWarmth': 'warmth',
  'sensoryTexture': 'texture'
};

/**
 * Calculate cosine similarity between two strings
 * @param {string} str1 - First string to compare
 * @param {string} str2 - Second string to compare
 * @returns {number} - Similarity score between 0 and 1
 */
function calculateStringSimilarity(str1, str2) {
  // Convert to lowercase
  str1 = str1.toLowerCase();
  str2 = str2.toLowerCase();

  // Create frequency maps for each string
  const freq1 = {};
  const freq2 = {};
  
  // Count character frequencies in str1
  for (const char of str1) {
    if (char.match(/[a-z]/)) {
      freq1[char] = (freq1[char] || 0) + 1;
    }
  }
  
  // Count character frequencies in str2
  for (const char of str2) {
    if (char.match(/[a-z]/)) {
      freq2[char] = (freq2[char] || 0) + 1;
    }
  }
  
  // Get all unique characters
  const allChars = new Set([...Object.keys(freq1), ...Object.keys(freq2)]);
  
  // Calculate dot product
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;
  
  for (const char of allChars) {
    const val1 = freq1[char] || 0;
    const val2 = freq2[char] || 0;
    
    dotProduct += val1 * val2;
    magnitude1 += val1 * val1;
    magnitude2 += val2 * val2;
  }
  
  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);
  
  // Handle zero division
  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }
  
  return dotProduct / (magnitude1 * magnitude2);
}

/**
 * Word matching algorithm
 * @param {string} phrase - The phrase to compare
 * @param {string} keyword - The keyword to compare against
 * @returns {number} - Similarity score between 0 and 1
 */
function wordMatchSimilarity(phrase, keyword) {
  const phraseWords = phrase.toLowerCase().split(/\s+/);
  const keywordWords = keyword.toLowerCase().split(/\s+/);
  
  let matches = 0;
  
  for (const pWord of phraseWords) {
    for (const kWord of keywordWords) {
      if (pWord === kWord) {
        matches++;
      } else if (pWord.includes(kWord) || kWord.includes(pWord)) {
        // Partial match (one word is substring of the other)
        matches += 0.5;
      }
    }
  }
  
  // Normalize by the maximum possible matches
  const maxPossibleMatches = Math.max(phraseWords.length, keywordWords.length);
  return maxPossibleMatches > 0 ? matches / maxPossibleMatches : 0;
}

/**
 * Get value for a specific attribute based on a phrase
 * @param {string} phrase - The input phrase
 * @param {string} attributeKey - The attribute key (e.g., 'color', 'texture')
 * @returns {Object|null} - Object with matched value and confidence, or null if no match
 */
function getAttributeValue(phrase, attributeKey) {
  const valueMap = attributeValueMaps[attributeKey];
  if (!valueMap) {
    return null;
  }
  
  // Convert phrase to lowercase and split into words
  const words = phrase.toLowerCase().split(/\s+/);
  
  // Look for direct matches in value map
  let bestMatch = null;
  let bestConfidence = 0;
  
  // Check each word in the phrase
  for (const word of words) {
    // Look for exact matches first
    if (valueMap[word] !== undefined) {
      return { value: valueMap[word], confidence: 1.0 };
    }
    
    // Look for partial matches
    for (const [term, value] of Object.entries(valueMap)) {
      const similarity = calculateStringSimilarity(word, term);
      if (similarity > 0.7 && similarity > bestConfidence) {  // 0.7 threshold for strong match
        bestMatch = { value, confidence: similarity };
        bestConfidence = similarity;
      }
    }
  }
  
  return bestMatch;
}

/**
 * Convert attribute values to slider values (0-100 scale)
 * @param {Object} attributeValues - Map of attribute keys to value objects
 * @returns {Object} - Map of parameter names to slider values
 */
function attributeValuesToSliderValues(attributeValues) {
  const sliderValues = {};
  
  // Map each attribute to its corresponding slider parameter
  Object.entries(paramToAttrMap).forEach(([param, attrKey]) => {
    if (attrKey && attributeValues[attrKey]) {
      const result = attributeValues[attrKey];
      // Normalize to 0-100 range based on the attribute's scale
      if (attrKey === 'valence') {
        // Special case for valence which is -5 to 5
        sliderValues[param] = Math.round(((result.value + 5) / 10) * 100);
      } else {
        // Standard case for 0-10 scales
        sliderValues[param] = Math.round((result.value / 10) * 100);
      }
    }
  });
  
  return sliderValues;
}

/**
 * Analyze a text input and extract vibe parameters
 * @param {string} text - The text to analyze
 * @returns {Object} - Object with vibe parameter values
 */
function analyzeText(text) {
  console.log(`Analyzing text: "${text}"`);
  
  // Get direct attribute values where possible
  const attributeValues = {};
  
  Object.keys(attributeValueMaps).forEach(attrKey => {
    const result = getAttributeValue(text, attrKey);
    if (result) {
      attributeValues[attrKey] = result;
      console.log(`Attribute ${attrKey}: ${result.value} (${Math.round(result.confidence * 100)}% confidence)`);
    }
  });
  
  // Convert attribute values to slider values
  const directSliderValues = attributeValuesToSliderValues(attributeValues);
  
  // Generate complete vibe parameters using the semantic algorithm from app.js
  const semanticValues = generateVibeParametersFromText(text);
  
  // Merge values, preferring direct attribute matches when available
  const mergedValues = { ...semanticValues, ...directSliderValues };
  
  // Special cases for composite values
  // For example, if text contains both "warm" and "red", we should emphasize warmth more
  if (attributeValues.color && attributeValues.warmth) {
    // Red colors (0-60, 300-360) are warm, blue colors (180-270) are cool
    const hue = attributeValues.color.value;
    if (hue !== null) {
      const isWarmColor = (hue >= 0 && hue <= 60) || (hue >= 300 && hue <= 360);
      const isCoolColor = (hue >= 180 && hue <= 270);
      
      if (isWarmColor && attributeValues.warmth.value < 5) {
        // Contradictory: warm color but cool term - color wins slightly
        mergedValues.sensoryWarmth = Math.min(100, mergedValues.sensoryWarmth + 10);
      } else if (isCoolColor && attributeValues.warmth.value > 5) {
        // Contradictory: cool color but warm term - color wins slightly
        mergedValues.sensoryWarmth = Math.max(0, mergedValues.sensoryWarmth - 10);
      } else if (isWarmColor && attributeValues.warmth.value > 5) {
        // Reinforcing: warm color and warm term - emphasize warmth
        mergedValues.sensoryWarmth = Math.min(100, mergedValues.sensoryWarmth + 5);
      } else if (isCoolColor && attributeValues.warmth.value < 5) {
        // Reinforcing: cool color and cool term - emphasize coolness
        mergedValues.sensoryWarmth = Math.max(0, mergedValues.sensoryWarmth - 5);
      }
    }
  }
  
  console.log('Final merged values:', mergedValues);
  
  return mergedValues;
}

/**
 * Generate vibe parameters from text input - copied from app.js with slight modifications
 * This leverages the semantic analysis algorithm already in the app
 */
function generateVibeParametersFromText(text) {
  // This function is identical to the one in app.js but we include it here for modularity
  // In a production app, this would be imported from a shared module
  
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

  // Special contexts that have strong established cultural vibes
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
    
    // Emotional states with strong vibes
    "joyful": contextualAssociation(text, "joy happy excitement elation delight pleasure upbeat cheerful mirth enthusiasm"),
    "melancholy": contextualAssociation(text, "melancholy sad wistful nostalgic thoughtful reflective sorrow longing introspective"),
    "serene": contextualAssociation(text, "serenity calm peaceful quiet tranquil still undisturbed composed untroubled"),
    "chaotic": contextualAssociation(text, "chaos disorder confusion turmoil disarray jumble mayhem madness disruption")
  };

  // Transform the contextual associations into meaningful vibe parameter values
  
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

/**
 * Helper function to determine how much the text resonates with a concept cluster
 */
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

/**
 * Helper function to map a pair of opposing poles to a parameter value
 */
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

/**
 * Helper function to adjust a value while keeping it in range
 */
function adjustValue(value, adjustment) {
  return Math.max(0, Math.min(100, value + adjustment));
}

/**
 * Simple hash function for consistent pseudo-randomness
 */
function stringToHash(string) {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    const char = string.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Export functions for use in app.js
window.semanticAnalyzer = {
  analyzeText,
  getAttributeValue,
  calculateStringSimilarity,
  wordMatchSimilarity,
  attributeValueMaps
};