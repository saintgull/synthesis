/**
 * Comprehensive Vibe Engine Demo (2025 Edition)
 * 
 * This is a complete rewrite incorporating all improvements from March 2025:
 * - Direct DOM manipulation for improved performance
 * - Simplified data flow with clear structure
 * - Procedurally generated textures with no external dependencies
 * - Real-time visualization updates with immediate feedback
 */

// DOM Elements Cache - populated after document loaded
let elements = null;

// Vibe State - tracks current parameter values
const vibeState = {
  temporalPace: 50,
  temporalRhythm: 50,
  temporalDensity: 50,
  energyIntensity: 50,
  energyFlow: 50,
  energyStability: 50,
  sensoryBrightness: 50,
  sensoryWarmth: 50,
  sensoryTexture: 50,
};

// Application State
const appState = {
  currentView: 'explorer',
  currentTab: 'color-texture',
  animationsEnabled: true, // Always enabled by default
  activePreset: null,
  currentDomain: 'music',
  isAnimating: false,
  frameRequestId: null
};

// Canvas Contexts
let colorCtx, textureCtx, radarCtx;

// Presets - predefined vibe configurations
const presets = {
  cozyReading: {
    temporalPace: 20,
    temporalRhythm: 30,
    temporalDensity: 40,
    energyIntensity: 25,
    energyFlow: 65,
    energyStability: 85,
    sensoryBrightness: 60,
    sensoryWarmth: 85,
    sensoryTexture: 70,
    description: "A warm, cozy vibe with slow pacing and high stability. Perfect for curling up with a good book on a rainy day. Soft textures, warm lighting, and a calming atmosphere enhance focus and relaxation."
  },
  
  urbanNightclub: {
    temporalPace: 85,
    temporalRhythm: 80,
    temporalDensity: 90,
    energyIntensity: 95,
    energyFlow: 70,
    energyStability: 30,
    sensoryBrightness: 20,
    sensoryWarmth: 60,
    sensoryTexture: 50,
    description: "A high-energy, pulsing vibe with rapid rhythm and intense sensory experience. Dark with punctuated bright lights, this vibe creates excitement and a sense of immersion in the moment."
  },
  
  zenGarden: {
    temporalPace: 15,
    temporalRhythm: 40,
    temporalDensity: 30,
    energyIntensity: 20,
    energyFlow: 80,
    energyStability: 90,
    sensoryBrightness: 70,
    sensoryWarmth: 50,
    sensoryTexture: 60,
    description: "A serene, balanced vibe with minimal distractions and a focus on natural elements. The slow pace and high stability create a sense of timelessness, while subtle textures add depth to the experience."
  },
  
  startupOffice: {
    temporalPace: 70,
    temporalRhythm: 60,
    temporalDensity: 75,
    energyIntensity: 75,
    energyFlow: 55,
    energyStability: 45,
    sensoryBrightness: 85,
    sensoryWarmth: 35,
    sensoryTexture: 30,
    description: "A bright, dynamic vibe with medium-high energy and a modern aesthetic. The cool colors and smooth textures create a clean, efficient feeling, while the faster pace encourages productivity and innovation."
  },

  jazzClub: {
    temporalPace: 50,
    temporalRhythm: 70,
    temporalDensity: 65,
    energyIntensity: 60,
    energyFlow: 80,
    energyStability: 40,
    sensoryBrightness: 25,
    sensoryWarmth: 75,
    sensoryTexture: 65,
    description: "A warm, intimate vibe with moderate pace and organic rhythmic patterns. Low lighting with warm tones creates an intimate atmosphere, while moderate energy and textural richness provide depth and complexity."
  },

  tropicalBeach: {
    temporalPace: 30,
    temporalRhythm: 65,
    temporalDensity: 40,
    energyIntensity: 45,
    energyFlow: 90,
    energyStability: 70,
    sensoryBrightness: 90,
    sensoryWarmth: 80,
    sensoryTexture: 55,
    description: "A bright, open vibe with rhythmic patterns and high warmth. The moderate pace and flowing energy create a relaxed yet vibrant atmosphere, while the high brightness evokes expansive horizons and sunlight."
  }
};

// Domain-specific examples
const domainExamples = {
  music: {
    jazz: {
      name: "Jazz Quartet",
      description: "Warm, intimate jazz in a small venue with acoustic instruments and improvisational elements.",
      vibeSettings: {
        temporalPace: 50,
        temporalRhythm: 70,
        temporalDensity: 65,
        energyIntensity: 60,
        energyFlow: 80,
        energyStability: 40,
        sensoryBrightness: 25,
        sensoryWarmth: 75,
        sensoryTexture: 65
      }
    },
    classical: {
      name: "Classical Orchestra",
      description: "Refined, structured, and dynamic classical performance with rich instrumentation and formal composition.",
      vibeSettings: {
        temporalPace: 45,
        temporalRhythm: 30,
        temporalDensity: 85,
        energyIntensity: 70,
        energyFlow: 75,
        energyStability: 65,
        sensoryBrightness: 60,
        sensoryWarmth: 55,
        sensoryTexture: 40
      }
    },
    edm: {
      name: "Electronic Dance Music",
      description: "High-energy, dense electronic music with repetitive patterns, synthetic sounds, and intense rhythmic elements.",
      vibeSettings: {
        temporalPace: 85,
        temporalRhythm: 60,
        temporalDensity: 90,
        energyIntensity: 95,
        energyFlow: 70,
        energyStability: 30,
        sensoryBrightness: 65,
        sensoryWarmth: 60,
        sensoryTexture: 25
      }
    },
    ambient: {
      name: "Ambient Electronic",
      description: "Spacious, atmospheric electronic soundscapes with minimal rhythmic structure and a focus on texture and timbre.",
      vibeSettings: {
        temporalPace: 20,
        temporalRhythm: 25,
        temporalDensity: 30,
        energyIntensity: 25,
        energyFlow: 90,
        energyStability: 70,
        sensoryBrightness: 50,
        sensoryWarmth: 45,
        sensoryTexture: 80
      }
    }
  },
  space: {
    forest: {
      name: "Scandinavian Forest",
      description: "Cool, serene woodland with filtered light, organic textures, and a sense of peaceful isolation.",
      vibeSettings: {
        temporalPace: 15,
        temporalRhythm: 40,
        temporalDensity: 60,
        energyIntensity: 20,
        energyFlow: 60,
        energyStability: 85,
        sensoryBrightness: 60,
        sensoryWarmth: 35,
        sensoryTexture: 80
      }
    },
    cafe: {
      name: "Busy Café",
      description: "Warm, energetic space with multiple conversations, movement, the scent of coffee, and background music.",
      vibeSettings: {
        temporalPace: 65,
        temporalRhythm: 75,
        temporalDensity: 80,
        energyIntensity: 70,
        energyFlow: 65,
        energyStability: 45,
        sensoryBrightness: 75,
        sensoryWarmth: 80,
        sensoryTexture: 60
      }
    },
    library: {
      name: "Academic Library",
      description: "Quiet, structured environment with high ceilings, organized knowledge, diffused lighting, and muted sounds.",
      vibeSettings: {
        temporalPace: 20,
        temporalRhythm: 15,
        temporalDensity: 85,
        energyIntensity: 15,
        energyFlow: 40,
        energyStability: 95,
        sensoryBrightness: 70,
        sensoryWarmth: 40,
        sensoryTexture: 35
      }
    },
    beach: {
      name: "Tropical Beach",
      description: "Bright, open setting with rhythmic waves, warm temperatures, organic textures, and a sense of freedom.",
      vibeSettings: {
        temporalPace: 30,
        temporalRhythm: 65,
        temporalDensity: 40,
        energyIntensity: 45,
        energyFlow: 90,
        energyStability: 70,
        sensoryBrightness: 90,
        sensoryWarmth: 80,
        sensoryTexture: 55
      }
    }
  },
  visual: {
    impressionist: {
      name: "Impressionist Painting",
      description: "Soft, textured brushwork with vibrant colors capturing momentary impressions of light and movement.",
      vibeSettings: {
        temporalPace: 40,
        temporalRhythm: 60,
        temporalDensity: 70,
        energyIntensity: 55,
        energyFlow: 75,
        energyStability: 50,
        sensoryBrightness: 80,
        sensoryWarmth: 65,
        sensoryTexture: 85
      }
    },
    bauhaus: {
      name: "Bauhaus Design",
      description: "Clean, geometric, and functional with primary colors, balanced composition, and minimal ornamentation.",
      vibeSettings: {
        temporalPace: 50,
        temporalRhythm: 20,
        temporalDensity: 40,
        energyIntensity: 60,
        energyFlow: 30,
        energyStability: 90,
        sensoryBrightness: 85,
        sensoryWarmth: 45,
        sensoryTexture: 15
      }
    },
    cyberpunk: {
      name: "Cyberpunk Aesthetic",
      description: "High contrast, neon-lit urban imagery with technological elements, grit, and futuristic elements in decay.",
      vibeSettings: {
        temporalPace: 75,
        temporalRhythm: 65,
        temporalDensity: 95,
        energyIntensity: 85,
        energyFlow: 50,
        energyStability: 25,
        sensoryBrightness: 60,
        sensoryWarmth: 20,
        sensoryTexture: 90
      }
    },
    ukiyoe: {
      name: "Ukiyo-e Prints",
      description: "Flat, stylized compositions with clear outlines, block colors, and a balance of detail and simplicity.",
      vibeSettings: {
        temporalPace: 25,
        temporalRhythm: 40,
        temporalDensity: 60,
        energyIntensity: 40,
        energyFlow: 30,
        energyStability: 80,
        sensoryBrightness: 70,
        sensoryWarmth: 60,
        sensoryTexture: 30
      }
    }
  }
};

// Cross-domain translations for the vibe engine
const domainTranslations = {
  music: {
    getDescription: function(vibeVector) {
      // Calculate key characteristics
      const tempo = mapValue(vibeVector.temporalPace, 0, 100, 60, 180); // BPM range
      
      // Determine complexity based on temporal density
      let complexity;
      if (vibeVector.temporalDensity > 70) {
        complexity = "complex, dense";
      } else if (vibeVector.temporalDensity < 30) {
        complexity = "sparse, minimal";
      } else {
        complexity = "moderately layered";
      }
      
      const dynamics = vibeVector.energyIntensity > 70 ? "loud, intense" : 
                      (vibeVector.energyIntensity < 30 ? "soft, delicate" : "moderately dynamic");
      const structure = vibeVector.energyStability > 70 ? "highly structured, predictable" :
                       (vibeVector.energyStability < 30 ? "improvisational, unpredictable" : "balanced structure");
      const timbre = vibeVector.sensoryTexture > 70 ? "textured, rough" :
                    (vibeVector.sensoryTexture < 30 ? "smooth, pure" : "moderately textured");
      const tonality = vibeVector.sensoryWarmth > 70 ? "warm, rich harmonies" :
                      (vibeVector.sensoryWarmth < 30 ? "cool, austere harmonies" : "balanced tonal palette");
      
      // Determine instrumentation based on multiple factors
      let instrumentation;
      if (vibeVector.sensoryBrightness > 70 && vibeVector.energyIntensity > 60) {
        instrumentation = "brass and percussion-forward";
      } else if (vibeVector.sensoryWarmth > 70 && vibeVector.sensoryTexture < 40) {
        instrumentation = "warm string instruments";
      } else if (vibeVector.temporalPace > 70 && vibeVector.energyFlow > 60) {
        instrumentation = "electronic elements with driving rhythms";
      } else if (vibeVector.sensoryWarmth > 60 && vibeVector.energyIntensity < 40) {
        instrumentation = "acoustic instruments with gentle textures";
      } else {
        instrumentation = "balanced mix of instrumental voices";
      }
      
      // Construct the description
      return `Musical expression at approximately ${Math.round(tempo)} BPM with ${complexity} arrangement. ${dynamics.charAt(0).toUpperCase() + dynamics.slice(1)} dynamics with ${structure} and ${timbre} timbres. Features ${tonality} and ${instrumentation}.`;
    }
  },
  
  space: {
    getDescription: function(vibeVector) {
      // Spatial characteristics
      const scale = vibeVector.sensoryBrightness > 70 ? "open, expansive" :
                   (vibeVector.sensoryBrightness < 30 ? "intimate, enclosed" : "moderate scale");
      const organization = vibeVector.energyStability > 70 ? "highly organized, structured" :
                          (vibeVector.energyStability < 30 ? "organic, free-flowing" : "balanced organization");
      const activity = vibeVector.temporalPace > 70 ? "bustling with activity" :
                      (vibeVector.temporalPace < 30 ? "calm, still" : "moderate activity level");
      const lighting = vibeVector.sensoryBrightness > 70 ? "brightly lit" :
                      (vibeVector.sensoryBrightness < 30 ? "dimly lit" : "moderately lit");
      const color = vibeVector.sensoryWarmth > 70 ? "warm color palette" :
                   (vibeVector.sensoryWarmth < 30 ? "cool color palette" : "balanced color temperature");
      const materials = vibeVector.sensoryTexture > 70 ? "textured, varied materials" :
                       (vibeVector.sensoryTexture < 30 ? "smooth, consistent materials" : "mix of textures");
      
      // Environment type based on combined factors
      let environment;
      if (vibeVector.sensoryBrightness > 70 && vibeVector.sensoryWarmth > 70) {
        environment = "sun-drenched";
      } else if (vibeVector.sensoryBrightness < 30 && vibeVector.energyIntensity > 70) {
        environment = "nightlife-oriented";
      } else if (vibeVector.sensoryBrightness > 60 && vibeVector.sensoryWarmth < 40) {
        environment = "clean, modern";
      } else if (vibeVector.temporalPace < 30 && vibeVector.sensoryTexture > 60) {
        environment = "nature-immersed";
      } else if (vibeVector.energyStability > 70 && vibeVector.temporalDensity > 70) {
        environment = "knowledge-focused";
      } else {
        environment = "versatile";
      }
      
      // Construct the description
      return `A ${scale} ${environment} space with ${organization} elements. ${activity.charAt(0).toUpperCase() + activity.slice(1)} throughout the ${lighting} environment. Features a ${color} with ${materials}.`;
    }
  },
  
  visual: {
    getDescription: function(vibeVector) {
      // Visual characteristics
      const composition = vibeVector.energyStability > 70 ? "structured, geometric composition" :
                         (vibeVector.energyStability < 30 ? "dynamic, organic composition" : "balanced composition");
      const contrast = vibeVector.energyIntensity > 70 ? "high contrast" :
                      (vibeVector.energyIntensity < 30 ? "subtle contrast" : "moderate contrast");
      const movement = vibeVector.temporalPace > 70 ? "strong sense of movement" :
                      (vibeVector.temporalPace < 30 ? "static, contemplative quality" : "subtle implied movement");
      const detail = vibeVector.temporalDensity > 70 ? "richly detailed" :
                    (vibeVector.temporalDensity < 30 ? "minimal, essential elements" : "balanced level of detail");
      const palette = vibeVector.sensoryWarmth > 70 ? "warm, rich color palette" :
                    (vibeVector.sensoryWarmth < 30 ? "cool, restrained color palette" : "balanced color temperature");
      const texture = vibeVector.sensoryTexture > 70 ? "heavily textured surfaces" :
                     (vibeVector.sensoryTexture < 30 ? "smooth, refined surfaces" : "varied textural elements");
      
      // Style influence based on combined factors
      let style;
      if (vibeVector.temporalPace > 70 && vibeVector.energyIntensity > 70) {
        style = "expressionist";
      } else if (vibeVector.energyStability > 70 && vibeVector.temporalDensity < 40) {
        style = "minimalist";
      } else if (vibeVector.sensoryTexture > 70 && vibeVector.temporalRhythm > 60) {
        style = "impressionist";
      } else if (vibeVector.sensoryBrightness < 40 && vibeVector.sensoryWarmth < 40) {
        style = "noir-influenced";
      } else if (vibeVector.energyStability > 60 && vibeVector.sensoryBrightness > 70) {
        style = "modernist";
      } else {
        style = "eclectic";
      }
      
      // Construct the description
      return `A ${style} visual with ${composition} and ${contrast}. Features a ${movement} with ${detail}. Rendered in a ${palette} with ${texture}.`;
    }
  }
};

// Initialize the application
function initApp() {
  console.log("initApp started");
  
  // Initialize DOM elements first
  initializeElements();
  console.log("Elements initialized:", !!elements);
  
  // Initialize canvas contexts
  initializeContexts();
  
  // Set up event listeners
  setupEventListeners();
  console.log("Event listeners set up");
  
  // Adjust canvas size to fit container
  resizeCanvases();
  
  // Initial render of all visualizations
  renderVisualizations();
  
  // Window resize handler for responsive canvases
  window.addEventListener('resize', () => {
    resizeCanvases();
    renderVisualizations();
  });
  
  // Initialize domain content
  populateSourcePresets('music');
  
  // Start animation automatically
  startAnimation();
  
  // Update animation toggle button to show "enabled" state
  if (elements.animationToggle) {
    elements.animationToggle.textContent = 'Disable Animation';
    elements.animationToggle.classList.add('active');
  }
  
  // Log initialization for debugging
  console.log("Vibe Engine Comprehensive Demo initialized successfully with animations enabled");
}

// Initialize DOM elements cache
function initializeElements() {
  elements = {
    // Navigation elements
    navButtons: document.querySelectorAll('.nav-button'),
    viewContainers: document.querySelectorAll('.view-container'),
    
    // Explorer view elements
    sliders: {
      temporalPace: document.getElementById('temporal-pace'),
      temporalRhythm: document.getElementById('temporal-rhythm'),
      temporalDensity: document.getElementById('temporal-density'),
      energyIntensity: document.getElementById('energy-intensity'),
      energyFlow: document.getElementById('energy-flow'),
      energyStability: document.getElementById('energy-stability'),
      sensoryBrightness: document.getElementById('sensory-brightness'),
      sensoryWarmth: document.getElementById('sensory-warmth'),
      sensoryTexture: document.getElementById('sensory-texture'),
    },
    presetButtons: document.querySelectorAll('.preset-button'),
    
    // Text input elements
    vibeTextInput: document.getElementById('vibe-text-input'),
    processTextButton: document.getElementById('process-text-button'),
    
    // Visualizer view elements
    tabButtons: document.querySelectorAll('.tab-button'),
    visualizationTabs: document.querySelectorAll('.visualization-tab'),
    
    // Canvas elements - Note these are only initialized when viewing the visualizer
    colorCanvas: document.getElementById('color-canvas'),
    textureCanvas: document.getElementById('texture-canvas'),
    radarChart: document.getElementById('radar-chart'),
    
    // Description elements
    vibeDescriptionText: document.getElementById('vibe-description-text'),
    musicDescription: document.getElementById('music-description'),
    spaceDescription: document.getElementById('space-description'),
    visualDescription: document.getElementById('visual-description'),
    
    // Animation info (no toggle control anymore)
    animationInfo: document.querySelector('.animation-info'),
    
    // Translator view elements
    sourceDomainSelect: document.getElementById('source-domain-select'),
    targetDomainSelect: document.getElementById('target-domain-select'),
    sourcePresetSelect: document.getElementById('source-preset-select'),
    sourcePreview: document.getElementById('source-preview'),
    translateButton: document.getElementById('translate-button'),
    translationResult: document.getElementById('translation-result'),
    resultContent: document.getElementById('result-content'),
    
    // Examples view elements
    domainTabs: document.querySelectorAll('.domain-tab'),
    domainContents: document.querySelectorAll('.domain-content'),
    loadExampleButtons: document.querySelectorAll('.load-example-button'),
  };
}

// Initialize canvas contexts
function initializeContexts() {
  try {
    if (elements.colorCanvas) {
      colorCtx = elements.colorCanvas.getContext('2d');
      console.log("Successfully initialized color canvas context");
    }
    
    if (elements.textureCanvas) {
      textureCtx = elements.textureCanvas.getContext('2d');
      console.log("Successfully initialized texture canvas context");
    }
    
    if (elements.radarChart) {
      radarCtx = elements.radarChart.getContext('2d');
      console.log("Successfully initialized radar chart context");
    }
  } catch (error) {
    console.error("Error initializing canvas contexts:", error);
  }
}

// Set up all event listeners
function setupEventListeners() {
  // Main navigation
  elements.navButtons.forEach(button => {
    button.addEventListener('click', () => {
      const view = button.dataset.view;
      
      // Update active button
      elements.navButtons.forEach(btn => {
        btn.classList.remove('active');
      });
      button.classList.add('active');
      
      // Show correct view
      elements.viewContainers.forEach(container => {
        container.classList.remove('active');
      });
      document.getElementById(`${view}-view`).classList.add('active');
      
      // Update app state
      appState.currentView = view;
      
      // Resize canvases if showing visualizer view
      if (view === 'visualizer') {
        console.log("Switching to visualizer view - initializing canvases");
        
        // Set default tab if not already set
        if (!appState.currentTab) {
          appState.currentTab = 'color-texture';
        }
        
        // Small delay to ensure the DOM is ready
        setTimeout(() => {
          resizeCanvases();
          renderVisualizations();
          
          // Make sure animation is running
          if (!appState.isAnimating && appState.animationsEnabled) {
            startAnimation();
          }
        }, 100);
      }
    });
  });
  
  // Slider change events
  Object.entries(elements.sliders).forEach(([key, slider]) => {
    slider.addEventListener('input', (e) => {
      // Update state with new slider value
      vibeState[key] = parseInt(e.target.value);
      
      // Update visualizations immediately if we're on the visualizer view
      if (appState.currentView === 'visualizer') {
        renderVisualizations();
      }
      
      // Clear active preset when sliders are manually adjusted
      clearActivePreset();
      
      // Update description
      updateDescription();
    });
  });
  
  // Text input processing
  if (elements.vibeTextInput && elements.processTextButton) {
    // Process button click
    elements.processTextButton.addEventListener('click', function(e) {
      console.log("Process button clicked", e);
      e.preventDefault();
      e.stopPropagation();
      processVibeText();
    });
    
    // Enter key in text input - direct handler to improve reliability
    elements.vibeTextInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        console.log("Enter key pressed in text input");
        e.preventDefault();
        processVibeText();
      }
    });
    
    // Add debug logging to verify elements are correctly found
    console.log("Text input initialized:", elements.vibeTextInput.id);
    console.log("Process button initialized:", elements.processTextButton.id);
    console.log("Button event listeners attached successfully");
  } else {
    console.error("Critical elements missing:", {
      vibeTextInput: !!elements.vibeTextInput,
      processTextButton: !!elements.processTextButton
    });
  }
  
  // Preset button click events
  if (elements.presetButtons && elements.presetButtons.length > 0) {
    console.log(`Found ${elements.presetButtons.length} preset buttons`);
    elements.presetButtons.forEach((button, index) => {
      console.log(`Setting up listener for preset button ${index}: ${button.dataset.preset}`);
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(`Preset button clicked: ${button.dataset.preset}`);
        const presetName = button.dataset.preset;
        if (presets[presetName]) {
          loadPreset(presetName);
          
          // Update active preset button
          elements.presetButtons.forEach(btn => {
            btn.classList.remove('active');
          });
          button.classList.add('active');
          
          // If we're not on the visualizer view, switch to it
          if (appState.currentView !== 'visualizer') {
            const visualizerButton = document.querySelector('.nav-button[data-view="visualizer"]');
            if (visualizerButton) {
              visualizerButton.click();
            }
          }
        } else {
          console.error(`Preset ${presetName} not found. Available presets:`, Object.keys(presets));
        }
      });
    });
  } else {
    console.error("No preset buttons found");
  }
  
  // Visualization tab switching
  elements.tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.dataset.tab;
      
      // Update active tab button
      elements.tabButtons.forEach(btn => {
        btn.classList.remove('active');
      });
      button.classList.add('active');
      
      // Show correct tab content
      elements.visualizationTabs.forEach(tab => {
        tab.classList.remove('active');
      });
      document.getElementById(`${tabName}-tab`).classList.add('active');
      
      // Update app state
      appState.currentTab = tabName;
      
      // Render the newly visible tab (especially important for radar chart)
      if (tabName === 'radar-chart') {
        renderRadarChart();
      } else if (tabName === 'domain-translation') {
        updateDomainTranslations();
      }
    });
  });
  
  // Animation is now always enabled by default
  // No toggle button needed
  
  // Domain tabs in Examples view
  elements.domainTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const domain = tab.dataset.domain;
      
      // Update active tab
      elements.domainTabs.forEach(t => {
        t.classList.remove('active');
      });
      tab.classList.add('active');
      
      // Show correct domain content
      elements.domainContents.forEach(content => {
        content.classList.remove('active');
      });
      document.getElementById(`${domain}-content`).classList.add('active');
      
      // Update app state
      appState.currentDomain = domain;
    });
  });
  
  // Load example buttons
  elements.loadExampleButtons.forEach(button => {
    button.addEventListener('click', () => {
      const example = button.parentElement.dataset.example;
      const domain = appState.currentDomain;
      
      if (domainExamples[domain] && domainExamples[domain][example]) {
        loadDomainExample(domain, example);
        
        // Switch to explorer view to show the loaded example
        const explorerButton = document.querySelector('.nav-button[data-view="explorer"]');
        if (explorerButton) {
          explorerButton.click();
        }
      }
    });
  });
  
  // Translator related event listeners
  setupTranslatorEventListeners();
}

// Set up translator-specific event listeners
function setupTranslatorEventListeners() {
  // Source domain change
  if (elements.sourceDomainSelect) {
    elements.sourceDomainSelect.addEventListener('change', () => {
      const domain = elements.sourceDomainSelect.value;
      populateSourcePresets(domain);
    });
  }
  
  // Source preset change
  if (elements.sourcePresetSelect) {
    elements.sourcePresetSelect.addEventListener('change', () => {
      const domain = elements.sourceDomainSelect.value;
      const preset = elements.sourcePresetSelect.value;
      
      if (preset) {
        updateSourcePreview(domain, preset);
      }
    });
  }
  
  // Translate button
  if (elements.translateButton) {
    elements.translateButton.addEventListener('click', performTranslation);
  }
}

// Animation is now always enabled
function toggleAnimation() {
  // This function is kept for backward compatibility
  // Animation is now permanently enabled
  appState.animationsEnabled = true;
  
  // Always ensure animation is running
  if (!appState.isAnimating) {
    startAnimation();
  }
}

// Start the animation loop
function startAnimation() {
  if (appState.isAnimating) return;
  
  appState.isAnimating = true;
  
  // Animation variables
  const animationState = {
    time: 0,
    noiseOffset: 0
  };
  
  // Animation loop
  function animate() {
    // Update time
    animationState.time += 0.016; // Approximately 60fps
    animationState.noiseOffset += mapValue(vibeState.temporalPace, 0, 100, 0.001, 0.01);
    
    // Render updated visualization
    renderColorTexture(animationState);
    
    // Continue animation loop
    appState.frameRequestId = requestAnimationFrame(animate);
  }
  
  // Start the loop
  appState.frameRequestId = requestAnimationFrame(animate);
}

// Stop the animation loop
function stopAnimation() {
  if (!appState.isAnimating) return;
  
  // Cancel animation frame
  if (appState.frameRequestId) {
    cancelAnimationFrame(appState.frameRequestId);
    appState.frameRequestId = null;
  }
  
  appState.isAnimating = false;
  
  // Redraw static visualization
  renderVisualizations();
}

// Resize canvases to fit their containers
function resizeCanvases() {
  try {
    console.log("Resizing canvases to fit containers");
    
    // Re-initialize contexts first to ensure they exist
    initializeContexts();
    
    // Color and texture canvases
    if (elements.colorCanvas && elements.textureCanvas) {
      const container = elements.colorCanvas.parentElement;
      if (container) {
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        console.log(`Setting color/texture canvas dimensions to: ${width}x${height}`);
        
        elements.colorCanvas.width = width;
        elements.colorCanvas.height = height;
        elements.textureCanvas.width = width;
        elements.textureCanvas.height = height;
      } else {
        console.warn("Color canvas parent element not found");
      }
    } else {
      console.warn("Color or texture canvas elements not found");
    }
    
    // Radar chart
    if (elements.radarChart) {
      const radarContainer = elements.radarChart.parentElement;
      if (radarContainer) {
        const containerWidth = radarContainer.clientWidth;
        const containerHeight = radarContainer.clientHeight;
        const radarSize = Math.min(containerWidth, containerHeight, 600); // Set maximum size
        
        console.log(`Setting radar chart dimensions to: ${radarSize}x${radarSize}`);
        
        elements.radarChart.width = radarSize;
        elements.radarChart.height = radarSize;
      } else {
        console.warn("Radar chart parent element not found");
      }
    } else {
      console.warn("Radar chart element not found");
    }
  } catch (error) {
    console.error("Error resizing canvases:", error);
  }
}

// Load a preset vibe configuration
function loadPreset(presetName) {
  const preset = presets[presetName];
  
  // Update vibe state with preset values
  Object.entries(preset).forEach(([key, value]) => {
    if (key !== 'description') {
      vibeState[key] = value;
      
      // Update slider UI
      if (elements.sliders[key]) {
        elements.sliders[key].value = value;
      }
    }
  });
  
  // Update description
  if (elements.vibeDescriptionText) {
    elements.vibeDescriptionText.textContent = preset.description;
  }
  
  // Update app state
  appState.activePreset = presetName;
  
  // Re-render visualizations only if on visualizer view
  if (appState.currentView === 'visualizer') {
    renderVisualizations();
    
    // Update domain translations if that tab is active
    if (appState.currentTab === 'domain-translation') {
      updateDomainTranslations();
    }
  }
}

// Load a domain-specific example
function loadDomainExample(domain, exampleName) {
  const example = domainExamples[domain][exampleName];
  
  // Update vibe state with example settings
  Object.entries(example.vibeSettings).forEach(([key, value]) => {
    vibeState[key] = value;
    
    // Update slider UI
    if (elements.sliders[key]) {
      elements.sliders[key].value = value;
    }
  });
  
  // Update description
  elements.vibeDescriptionText.textContent = example.description;
  
  // Clear active preset buttons
  elements.presetButtons.forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Update app state
  appState.activePreset = null;
  
  // Re-render visualizations
  renderVisualizations();
  
  // Update domain translations if that tab is active
  if (appState.currentTab === 'domain-translation') {
    updateDomainTranslations();
  }
}

// Render all visualizations based on current vibe state
function renderVisualizations() {
  // Only render if visualizer view is active
  if (appState.currentView !== 'visualizer' && appState.currentView !== 'explorer') return;
  
  // Render different visualizations based on current tab
  switch (appState.currentTab) {
    case 'color-texture':
      renderColorTexture();
      break;
    case 'radar-chart':
      // Ensure radar chart renders properly by adding a small delay
      setTimeout(() => {
        renderRadarChart();
      }, 50);
      break;
    case 'domain-translation':
      updateDomainTranslations();
      break;
  }
  
  // Force render radar chart in background to ensure it's initialized
  if (appState.currentTab !== 'radar-chart') {
    setTimeout(() => {
      if (elements.radarChart && elements.radarChart.parentElement) {
        console.log("Pre-rendering radar chart in background");
        renderRadarChart();
      }
    }, 100);
  }
}

// Render the color and texture visualization
function renderColorTexture(animationState = null) {
  // Clear canvases
  colorCtx.clearRect(0, 0, elements.colorCanvas.width, elements.colorCanvas.height);
  textureCtx.clearRect(0, 0, elements.textureCanvas.width, elements.textureCanvas.height);
  
  // Calculate visualization parameters from vibe state
  const params = calculateVisualizationParams(animationState);
  
  // Render background color gradient
  renderColorGradient(params);
  
  // Render texture overlay
  renderTexturePattern(params);
}

// Calculate visual parameters based on vibe state
function calculateVisualizationParams(animationState = null) {
  // Basic parameters directly mapped from vibe state
  const params = {
    // Color parameters
    hue: mapValue(vibeState.sensoryWarmth, 0, 100, 240, 0), // Cool to warm (blue to red)
    saturation: mapValue(vibeState.energyIntensity, 0, 100, 20, 90), // Low to high saturation
    lightness: mapValue(vibeState.sensoryBrightness, 0, 100, 10, 90), // Dark to bright
    
    // Gradient parameters
    gradientAngle: mapValue(vibeState.energyFlow, 0, 100, 0, 360), // Direction of gradient
    gradientSpread: mapValue(vibeState.temporalRhythm, 0, 100, 0.1, 0.9), // How spread out the gradient is
    
    // Texture parameters
    textureScale: mapValue(vibeState.temporalDensity, 0, 100, 0.01, 0.15), // Size of texture elements
    textureComplexity: mapValue(vibeState.sensoryTexture, 0, 100, 1, 10), // Complexity of texture
    textureOpacity: mapValue(vibeState.sensoryTexture, 0, 100, 0.1, 0.7), // Opacity of texture overlay
    
    // Motion parameters
    motionSpeed: mapValue(vibeState.temporalPace, 0, 100, 0.1, 5), // Speed of any animations
    motionVariability: mapValue(vibeState.energyStability, 0, 100, 1, 0.1), // Inverse of stability
    
    // Structure parameters
    structureOrder: mapValue(vibeState.energyStability, 0, 100, 0.1, 0.9), // How ordered vs chaotic
  };
  
  // Add animation-specific parameters if animating
  if (animationState) {
    params.time = animationState.time;
    params.noiseOffset = animationState.noiseOffset;
  }
  
  return params;
}

// Render the color gradient background
function renderColorGradient(params) {
  const width = elements.colorCanvas.width;
  const height = elements.colorCanvas.height;
  
  // Create gradient
  const angleInRadians = params.gradientAngle * (Math.PI / 180);
  const gradientX1 = width / 2 - Math.cos(angleInRadians) * width;
  const gradientY1 = height / 2 - Math.sin(angleInRadians) * height;
  const gradientX2 = width / 2 + Math.cos(angleInRadians) * width;
  const gradientY2 = height / 2 + Math.sin(angleInRadians) * height;
  
  const gradient = colorCtx.createLinearGradient(gradientX1, gradientY1, gradientX2, gradientY2);
  
  // Primary color based on hue/saturation/lightness
  const mainColor = `hsl(${params.hue}, ${params.saturation}%, ${params.lightness}%)`;
  
  // Secondary color - complementary or analogous based on energy stability
  const secondaryHue = (params.hue + 180 * params.structureOrder) % 360;
  const secondaryColor = `hsl(${secondaryHue}, ${params.saturation}%, ${params.lightness}%)`;
  
  // Add gradient stops
  gradient.addColorStop(0, mainColor);
  gradient.addColorStop(params.gradientSpread, secondaryColor);
  gradient.addColorStop(1, mainColor);
  
  // Fill background
  colorCtx.fillStyle = gradient;
  colorCtx.fillRect(0, 0, width, height);
  
  // Add vignette effect based on energy intensity
  if (params.saturation > 60) {
    const vignetteSize = mapValue(params.saturation, 60, 90, 0.7, 0.5);
    const vignetteGradient = colorCtx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height) * vignetteSize
    );
    
    vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignetteGradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
    
    colorCtx.fillStyle = vignetteGradient;
    colorCtx.fillRect(0, 0, width, height);
  }
  
  // If animating, add a pulsing overlay based on temporal parameters
  if (params.time !== undefined) {
    const pulseSize = 0.2 + 0.1 * Math.sin(params.time * params.motionSpeed);
    const pulseOpacity = 0.1 + 0.1 * Math.sin(params.time * params.motionSpeed * 0.7);
    
    const pulseGradient = colorCtx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height) * pulseSize
    );
    
    pulseGradient.addColorStop(0, `hsla(${params.hue}, ${params.saturation}%, ${params.lightness + 10}%, ${pulseOpacity})`);
    pulseGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    colorCtx.fillStyle = pulseGradient;
    colorCtx.fillRect(0, 0, width, height);
  }
}

// Render texture pattern overlay
function renderTexturePattern(params) {
  // Choose pattern type based on texture complexity
  if (params.textureComplexity < 3) {
    // Simple noise texture
    renderNoiseTexture(params);
  } else if (params.textureComplexity < 7) {
    // Line pattern
    renderLineTexture(params);
  } else {
    // Complex pattern
    renderComplexTexture(params);
  }
}

// Render simple noise texture
function renderNoiseTexture(params) {
  const width = elements.textureCanvas.width;
  const height = elements.textureCanvas.height;
  
  const imageData = textureCtx.createImageData(width, height);
  const data = imageData.data;
  
  // Scale determines graininess
  const scale = Math.ceil(width * params.textureScale);
  const intensity = params.textureOpacity * 255;
  
  // Add animation offset if present
  const noiseOffset = params.noiseOffset || 0;
  
  // Generate noise
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      
      // Use structured randomness based on stability
      const noiseValue = Math.random() < params.structureOrder ? 
        Math.round(Math.random() * intensity) : 
        Math.round(perlinNoise(x/scale + noiseOffset, y/scale) * intensity);
      
      data[i] = data[i + 1] = data[i + 2] = 255;
      data[i + 3] = noiseValue;
    }
  }
  
  textureCtx.putImageData(imageData, 0, 0);
}

// Render line-based texture
function renderLineTexture(params) {
  const width = elements.textureCanvas.width;
  const height = elements.textureCanvas.height;
  
  textureCtx.clearRect(0, 0, width, height);
  
  // Line parameters
  const lineSpacing = width * params.textureScale;
  const lineCount = Math.ceil(Math.max(width, height) / lineSpacing) * 2;
  const lineWidth = lineSpacing * 0.2;
  
  // Line angle based on energy flow
  const lineAngle = params.gradientAngle / 2;
  
  // Add animation offset if present
  const timeOffset = params.time ? params.time * params.motionSpeed : 0;
  
  textureCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  textureCtx.lineWidth = lineWidth;
  
  // Draw lines
  textureCtx.save();
  textureCtx.translate(width / 2, height / 2);
  textureCtx.rotate(lineAngle * Math.PI / 180);
  
  for (let i = -lineCount; i < lineCount; i++) {
    const pos = i * lineSpacing + (timeOffset * lineSpacing * 0.2) % lineSpacing;
    const variability = params.motionVariability * lineSpacing * 0.5;
    
    textureCtx.beginPath();
    
    // Add variability to lines based on stability
    if (params.structureOrder > 0.7) {
      // Straight lines for high order
      textureCtx.moveTo(-width, pos);
      textureCtx.lineTo(width, pos);
    } else {
      // Wavy lines for low order
      textureCtx.moveTo(-width, pos);
      
      for (let x = -width; x < width; x += 20) {
        const waveOffset = params.time ? timeOffset * 5 : 0;
        const offsetY = Math.sin((x * 0.02) + waveOffset) * variability * Math.random();
        textureCtx.lineTo(x, pos + offsetY);
      }
    }
    
    textureCtx.stroke();
  }
  
  textureCtx.restore();
}

// Render complex texture pattern
function renderComplexTexture(params) {
  const width = elements.textureCanvas.width;
  const height = elements.textureCanvas.height;
  
  textureCtx.clearRect(0, 0, width, height);
  
  // Shape parameters
  const shapeSize = width * params.textureScale;
  const gridSize = shapeSize * 1.5;
  const rows = Math.ceil(height / gridSize) + 1;
  const cols = Math.ceil(width / gridSize) + 1;
  
  // Determine shape complexity
  const shapeComplexity = Math.floor(params.textureComplexity);
  
  // Add animation offset if present
  const timeOffset = params.time ? params.time * params.motionSpeed * 0.5 : 0;
  
  textureCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  
  // Draw grid of shapes
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * gridSize - gridSize / 2;
      const y = row * gridSize - gridSize / 2;
      
      // Add movement if animating
      const animX = timeOffset ? Math.sin(timeOffset + row * 0.5) * gridSize * 0.1 : 0;
      const animY = timeOffset ? Math.cos(timeOffset + col * 0.5) * gridSize * 0.1 : 0;
      
      // Add some randomness to position based on structure order
      const xOffset = params.structureOrder > 0.7 ? 0 : (Math.random() - 0.5) * gridSize * 0.6;
      const yOffset = params.structureOrder > 0.7 ? 0 : (Math.random() - 0.5) * gridSize * 0.6;
      
      // Draw shape
      textureCtx.save();
      textureCtx.translate(x + xOffset + animX, y + yOffset + animY);
      
      // Add rotation based on animation if present
      const rotation = params.time ? 
        (timeOffset * (1 - params.structureOrder) * 0.2) + (Math.random() * 2 * Math.PI * (1 - params.structureOrder)) : 
        (Math.random() * 2 * Math.PI * (1 - params.structureOrder));
      
      textureCtx.rotate(rotation);
      
      drawComplexShape(shapeSize, shapeComplexity, params.structureOrder);
      
      textureCtx.restore();
    }
  }
}

// Draw a complex shape with given parameters
function drawComplexShape(size, complexity, order) {
  textureCtx.beginPath();
  
  if (order > 0.7) {
    // More ordered shapes
    if (complexity % 3 === 0) {
      // Squares or rectangles
      textureCtx.rect(-size/2, -size/2, size, size);
    } else if (complexity % 3 === 1) {
      // Circles or ellipses
      textureCtx.ellipse(0, 0, size/2, size/2, 0, 0, 2 * Math.PI);
    } else {
      // Triangles
      textureCtx.moveTo(0, -size/2);
      textureCtx.lineTo(size/2, size/2);
      textureCtx.lineTo(-size/2, size/2);
      textureCtx.closePath();
    }
  } else {
    // More organic shapes
    const points = 5 + complexity;
    const jitter = (1 - order) * 0.5;
    
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * 2 * Math.PI;
      const radius = size/2 * (1 - jitter + Math.random() * jitter);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      if (i === 0) {
        textureCtx.moveTo(x, y);
      } else {
        textureCtx.lineTo(x, y);
      }
    }
    
    textureCtx.closePath();
  }
  
  textureCtx.fill();
}

// Render radar chart visualization
function renderRadarChart() {
  if (!elements.radarChart || !radarCtx) {
    console.error("Radar chart or context not available");
    return;
  }
  
  const canvas = elements.radarChart;
  const ctx = radarCtx;
  
  // Make sure the radar chart is properly sized
  resizeCanvases();
  
  const width = canvas.width;
  const height = canvas.height;
  
  if (width === 0 || height === 0) {
    console.warn("Radar chart has zero dimensions");
    return;
  }
  
  console.log("Rendering radar chart with dimensions:", width, "x", height);
  
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.4;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Draw radar chart background
  drawRadarBackground(centerX, centerY, radius);
  
  // Draw data points
  drawDataPoints(centerX, centerY, radius);
}

// Draw radar chart background with axes
function drawRadarBackground(centerX, centerY, radius) {
  const ctx = radarCtx;
  const axisCount = 9; // Number of axes (all vibe dimensions)
  
  // Draw concentric circles
  const levelCount = 5;
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillStyle = 'rgba(240, 240, 245, 0.4)';
  
  // Background circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fill();
  
  // Level circles
  for (let i = 1; i <= levelCount; i++) {
    const levelRadius = radius * (i / levelCount);
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, levelRadius, 0, 2 * Math.PI);
    ctx.stroke();
  }
  
  // Draw axes
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  for (let i = 0; i < axisCount; i++) {
    const angle = (i / axisCount) * 2 * Math.PI - Math.PI / 2;
    const axisX = centerX + Math.cos(angle) * radius;
    const axisY = centerY + Math.sin(angle) * radius;
    
    // Draw axis line
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(axisX, axisY);
    ctx.stroke();
    
    // Draw axis label
    const labelDistance = radius * 1.1;
    const labelX = centerX + Math.cos(angle) * labelDistance;
    const labelY = centerY + Math.sin(angle) * labelDistance;
    
    const labels = [
      'Pace', 'Rhythm', 'Density', 
      'Intensity', 'Flow', 'Stability',
      'Brightness', 'Warmth', 'Texture'
    ];
    
    ctx.fillText(labels[i], labelX, labelY);
  }
}

// Draw data points on radar chart
function drawDataPoints(centerX, centerY, radius) {
  const ctx = radarCtx;
  const axisCount = 9;
  const dataPoints = [
    vibeState.temporalPace,
    vibeState.temporalRhythm,
    vibeState.temporalDensity,
    vibeState.energyIntensity,
    vibeState.energyFlow,
    vibeState.energyStability,
    vibeState.sensoryBrightness,
    vibeState.sensoryWarmth,
    vibeState.sensoryTexture
  ];
  
  // Draw data polygon
  ctx.beginPath();
  
  for (let i = 0; i < axisCount; i++) {
    const angle = (i / axisCount) * 2 * Math.PI - Math.PI / 2;
    const value = dataPoints[i] / 100; // Normalize to 0-1
    const pointRadius = radius * value;
    const pointX = centerX + Math.cos(angle) * pointRadius;
    const pointY = centerY + Math.sin(angle) * pointRadius;
    
    if (i === 0) {
      ctx.moveTo(pointX, pointY);
    } else {
      ctx.lineTo(pointX, pointY);
    }
  }
  
  ctx.closePath();
  ctx.fillStyle = 'rgba(99, 102, 241, 0.3)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(79, 70, 229, 0.8)';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Draw data points
  for (let i = 0; i < axisCount; i++) {
    const angle = (i / axisCount) * 2 * Math.PI - Math.PI / 2;
    const value = dataPoints[i] / 100; // Normalize to 0-1
    const pointRadius = radius * value;
    const pointX = centerX + Math.cos(angle) * pointRadius;
    const pointY = centerY + Math.sin(angle) * pointRadius;
    
    ctx.beginPath();
    ctx.arc(pointX, pointY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(99, 102, 241, 1)';
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

// Update the description of the current vibe
function updateDescription() {
  // Only generate a new description if not using a preset
  if (!appState.activePreset) {
    const description = generateVibeDescription();
    elements.vibeDescriptionText.textContent = description;
  }
}

// Generate a description based on the current vibe state
function generateVibeDescription() {
  // Generate adjectives based on vibe state
  const paceAdj = vibeState.temporalPace > 70 ? 'fast-paced' : 
                (vibeState.temporalPace < 30 ? 'slow, deliberate' : 'moderately paced');
  
  const energyAdj = vibeState.energyIntensity > 70 ? 'high-energy' : 
                  (vibeState.energyIntensity < 30 ? 'calm, relaxed' : 'balanced energy');
  
  const stabilityAdj = vibeState.energyStability > 70 ? 'structured, predictable' : 
                     (vibeState.energyStability < 30 ? 'dynamic, unpredictable' : 'moderately structured');
  
  const brightAdj = vibeState.sensoryBrightness > 70 ? 'bright, illuminated' : 
                  (vibeState.sensoryBrightness < 30 ? 'dim, shadowy' : 'moderately lit');
  
  const warmthAdj = vibeState.sensoryWarmth > 70 ? 'warm, cozy' : 
                  (vibeState.sensoryWarmth < 30 ? 'cool, crisp' : 'temperature-balanced');
  
  const textureAdj = vibeState.sensoryTexture > 70 ? 'richly textured' : 
                   (vibeState.sensoryTexture < 30 ? 'smooth, minimal' : 'subtly textured');
  
  // Build description from adjectives
  return `A ${paceAdj}, ${energyAdj} vibe with ${stabilityAdj} qualities. The atmosphere is ${brightAdj} and ${warmthAdj}, with a ${textureAdj} aesthetic feel.`;
}

// Update domain translations in the domain translation tab
function updateDomainTranslations() {
  if (appState.currentTab !== 'domain-translation') return;
  
  // Update music domain translation
  if (elements.musicDescription) {
    elements.musicDescription.textContent = domainTranslations.music.getDescription(vibeState);
  }
  
  // Update space domain translation
  if (elements.spaceDescription) {
    elements.spaceDescription.textContent = domainTranslations.space.getDescription(vibeState);
  }
  
  // Update visual domain translation
  if (elements.visualDescription) {
    elements.visualDescription.textContent = domainTranslations.visual.getDescription(vibeState);
  }
}

// Populate source presets based on domain
function populateSourcePresets(domain) {
  if (!elements.sourcePresetSelect) return;
  
  // Clear existing options
  while (elements.sourcePresetSelect.options.length > 1) {
    elements.sourcePresetSelect.remove(1);
  }
  
  // If custom is selected, we don't add any presets
  if (domain === 'custom') {
    elements.sourcePreview.innerHTML = '<p>Use current explorer settings as source</p>';
    return;
  }
  
  // Add options from the domain
  const examples = domainExamples[domain];
  if (examples) {
    Object.entries(examples).forEach(([key, example]) => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = example.name;
      elements.sourcePresetSelect.appendChild(option);
    });
  }
  
  // Update preview if there are options
  if (elements.sourcePresetSelect.options.length > 1) {
    elements.sourcePresetSelect.selectedIndex = 1;
    updateSourcePreview(domain, elements.sourcePresetSelect.value);
  }
}

// Update source preview
function updateSourcePreview(domain, preset) {
  if (!elements.sourcePreview) return;
  
  if (domain === 'custom') {
    elements.sourcePreview.innerHTML = '<p>Use current explorer settings as source</p>';
    return;
  }
  
  const example = domainExamples[domain][preset];
  if (example) {
    elements.sourcePreview.innerHTML = `
      <p><strong>${example.name}</strong></p>
      <p>${example.description}</p>
    `;
  }
}

// Perform translation between domains
function performTranslation() {
  const sourceDomain = elements.sourceDomainSelect.value;
  const targetDomain = elements.targetDomainSelect.value;
  
  if (sourceDomain === targetDomain) {
    showNotification('Source and target domains should be different', 'error');
    return;
  }
  
  // Get source vibe settings
  let sourceSettings;
  
  if (sourceDomain === 'custom') {
    // Use current explorer settings
    sourceSettings = { ...vibeState };
  } else {
    const sourcePreset = elements.sourcePresetSelect.value;
    if (!sourcePreset) {
      showNotification('Please select a source example', 'warning');
      return;
    }
    
    sourceSettings = { ...domainExamples[sourceDomain][sourcePreset].vibeSettings };
  }
  
  // Generate translation
  const translation = domainTranslations[targetDomain].getDescription(sourceSettings);
  
  // Show the result
  elements.resultContent.innerHTML = `
    <h4>${targetDomain.charAt(0).toUpperCase() + targetDomain.slice(1)} Translation</h4>
    <p>${translation}</p>
    <button id="apply-translation-button" class="action-button">Apply to Explorer</button>
  `;
  elements.resultContent.classList.remove('hidden');
  
  // Hide instructions
  document.querySelector('.translation-instructions').style.display = 'none';
  
  // Set up button to apply the translation to explorer
  document.getElementById('apply-translation-button').addEventListener('click', () => {
    // Apply the source settings to the explorer
    Object.entries(sourceSettings).forEach(([key, value]) => {
      vibeState[key] = value;
      
      // Update slider UI
      if (elements.sliders[key]) {
        elements.sliders[key].value = value;
      }
    });
    
    // Clear active preset
    clearActivePreset();
    
    // Update visualization
    renderVisualizations();
    
    // Switch to explorer view
    const explorerButton = document.querySelector('.nav-button[data-view="explorer"]');
    if (explorerButton) {
      explorerButton.click();
    }
    
    showNotification('Applied translation to Explorer', 'success');
  });
}

// Clear the active preset
function clearActivePreset() {
  appState.activePreset = null;
  
  // Clear active preset buttons
  elements.presetButtons.forEach(btn => {
    btn.classList.remove('active');
  });
}

// Show a notification to the user
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Add an X button for manual closing
  const closeButton = document.createElement('span');
  closeButton.innerHTML = '&times;';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '5px';
  closeButton.style.right = '10px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.fontSize = '18px';
  closeButton.addEventListener('click', () => {
    notification.remove();
  });
  notification.appendChild(closeButton);
  notification.style.position = 'relative';
  notification.style.paddingRight = '30px';
  
  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(10px)';
    notification.style.transition = 'opacity 0.3s, transform 0.3s';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 5000);
}

// Process ANY text input to affect sliders based on semantic meaning
function processVibeText() {
  // Debug logging to see if function is being called
  console.log("processVibeText function called");
  
  if (!elements || !elements.vibeTextInput) {
    console.error("Vibe text input element not found or elements not initialized");
    console.error("Elements state:", elements);
    return;
  }
  
  const text = elements.vibeTextInput.value.trim();
  console.log("Input text:", text);
  
  if (!text) {
    showNotification('Please enter a vibe description', 'warning');
    return;
  }
  
  console.log(`Processing text: "${text}"`);
  showNotification(`Processing: "${text}"`, 'info');
  
  // Generate vibe parameters from input text using the enhanced semantic analyzer
  let vibeValues;
  
  if (window.semanticAnalyzer) {
    // Use the enhanced semantic analyzer which includes vibe proximity
    vibeValues = window.semanticAnalyzer.analyzeText(text);
    
    // Show special notification for direct value matches
    const directMatchDetails = [];
    
    // Get attribute values for common dimensions
    const attributes = ['color', 'texture', 'warmth', 'brightness', 'pace', 'rhythm', 'intensity', 'flow'];
    
    attributes.forEach(attr => {
      if (window.semanticAnalyzer) {
        const result = window.semanticAnalyzer.getAttributeValue(text, attr);
        if (result && result.confidence > 0.8) {
          // Format the value nicely
          let formattedValue;
          if (attr === 'color' && result.value !== null) {
            formattedValue = `hue ${result.value}°`;
          } else if (result.value !== null) {
            formattedValue = result.value.toString();
          } else {
            formattedValue = 'neutral';
          }
          
          directMatchDetails.push(`${attr}: ${formattedValue}`);
        }
      }
    });
    
    // Show special notification for direct matches
    if (directMatchDetails.length > 0) {
      const detailsText = directMatchDetails.join(', ');
      showNotification(`Detected specific values: ${detailsText}`, 'success');
      
      // Update semantic results display
      const semanticResultsEl = document.getElementById('semantic-results');
      if (semanticResultsEl) {
        // Clear previous results
        semanticResultsEl.innerHTML = '';
        
        // Add animated heading with icon
        const heading = document.createElement('h4');
        heading.innerHTML = '<span class="semantic-icon">🔍</span> Semantic Analysis Results';
        semanticResultsEl.appendChild(heading);
        
        // Add detected matches
        attributes.forEach(attr => {
          if (window.semanticAnalyzer) {
            const result = window.semanticAnalyzer.getAttributeValue(text, attr);
            if (result && result.value !== null) {
              // Format the value nicely
              let displayValue;
              if (attr === 'color' && result.value !== null) {
                // For color, show the color name and hue value
                const hue = result.value;
                // Find the color name based on hue value
                let colorName = 'unknown';
                for (const [name, value] of Object.entries(window.semanticAnalyzer.attributeValueMaps.color)) {
                  if (value === hue) {
                    colorName = name;
                    break;
                  }
                }
                displayValue = `${colorName} (${hue}°)`;
                
                // Add CSS color display if possible
                if (hue !== null) {
                  const hslColor = `hsl(${hue}, 70%, 50%)`;
                  displayValue = `<span style="color: ${hslColor}; font-weight: bold;">${colorName}</span> (${hue}°)`;
                }
              } else {
                // For other attributes, map numerical values to human-readable names
                const valueMap = window.semanticAnalyzer.attributeValueMaps[attr];
                if (valueMap && result.value !== null) {
                  // Find term for this value
                  let termName = null;
                  for (const [term, value] of Object.entries(valueMap)) {
                    if (value === result.value) {
                      termName = term;
                      break;
                    }
                  }
                  
                  // If found a term, use it, otherwise use the numeric value
                  if (termName) {
                    displayValue = termName;
                  } else {
                    // Check for scales that might need custom handling
                    if (attr === 'valence') {
                      // Valence is special with negative values
                      const normalizedValue = result.value + 5; // Convert -5...5 to 0...10
                      const isPositive = result.value > 0;
                      const isNegative = result.value < 0;
                      const intensity = Math.abs(result.value);
                      
                      if (isPositive) {
                        displayValue = intensity > 3 ? "very positive" : "positive";
                      } else if (isNegative) {
                        displayValue = intensity > 3 ? "very negative" : "negative";
                      } else {
                        displayValue = "neutral";
                      }
                    } else {
                      // Generic 0-10 scale with polarities
                      // Comprehensive sample value mappings for all common attributes
                      const sampleValueMappings = {
                        'texture': {
                          0: 'smooth', 1: 'silky', 2: 'satin', 3: 'soft', 
                          4: 'fine', 5: 'moderate', 6: 'patterned',
                          7: 'textured', 8: 'rough', 9: 'rugged', 10: 'jagged'
                        },
                        'brightness': {
                          0: 'dark', 1: 'shadowy', 2: 'dim', 3: 'dusky', 4: 'muted',
                          5: 'medium', 6: 'clear', 7: 'light', 
                          8: 'bright', 9: 'luminous', 10: 'brilliant'
                        },
                        'warmth': {
                          0: 'icy', 1: 'cold', 2: 'cool', 3: 'fresh', 4: 'mild',
                          5: 'neutral', 6: 'lukewarm', 7: 'warm', 
                          8: 'toasty', 9: 'hot', 10: 'burning'
                        },
                        'pace': {
                          0: 'still', 1: 'slow', 2: 'leisurely', 3: 'relaxed', 4: 'gentle',
                          5: 'moderate', 6: 'flowing', 7: 'brisk',
                          8: 'rapid', 9: 'fast', 10: 'frantic'
                        },
                        'rhythm': {
                          0: 'linear', 1: 'direct', 2: 'progressive', 3: 'sequential', 
                          4: 'structured', 5: 'mixed', 6: 'varied',
                          7: 'wave', 8: 'oscillating', 9: 'circular', 10: 'cyclical'
                        },
                        'intensity': {
                          0: 'ambient', 1: 'subtle', 2: 'gentle', 3: 'mild', 4: 'light',
                          5: 'moderate', 6: 'firm', 7: 'strong',
                          8: 'powerful', 9: 'forceful', 10: 'intense'
                        },
                        'flow': {
                          0: 'flowing', 1: 'smooth', 2: 'steady', 3: 'consistent',
                          4: 'even', 5: 'regular', 6: 'periodic',
                          7: 'rhythmic', 8: 'beating', 9: 'throbbing', 10: 'pulsing'
                        },
                        'arousal': {
                          0: 'calming', 1: 'peaceful', 2: 'relaxing', 3: 'gentle',
                          4: 'mild', 5: 'moderate', 6: 'engaging',
                          7: 'active', 8: 'energetic', 9: 'exciting', 10: 'stimulating'
                        },
                        'abstraction': {
                          0: 'concrete', 1: 'specific', 2: 'tangible', 3: 'practical',
                          4: 'grounded', 5: 'representational', 6: 'interpretive',
                          7: 'symbolic', 8: 'conceptual', 9: 'theoretical', 10: 'abstract'
                        }
                      };
                      
                      // Fallback polarities for any attributes not in the mapping
                      const fallbackPolarities = {
                        'texture': ['smooth', 'rough'],
                        'brightness': ['dark', 'bright'],
                        'warmth': ['cool', 'warm'],
                        'pace': ['slow', 'fast'],
                        'rhythm': ['linear', 'cyclical'],
                        'intensity': ['ambient', 'intense'],
                        'flow': ['flowing', 'pulsing'],
                        'arousal': ['calming', 'stimulating'],
                        'abstraction': ['concrete', 'abstract']
                      };
                      
                      // First try to find exact term in the mapping
                      if (sampleValueMappings[attr] && sampleValueMappings[attr][result.value] !== undefined) {
                        displayValue = sampleValueMappings[attr][result.value];
                      } else {
                        // Find closest term within mappings
                        let closestTerm = null;
                        let closestDiff = Infinity;
                        
                        if (sampleValueMappings[attr]) {
                          for (const [valueStr, term] of Object.entries(sampleValueMappings[attr])) {
                            const value = parseInt(valueStr);
                            const diff = Math.abs(value - result.value);
                            if (diff < closestDiff) {
                              closestDiff = diff;
                              closestTerm = term;
                            }
                          }
                        }
                        
                        // If we found a close term within 1.5 points, use it
                        if (closestTerm && closestDiff <= 1.5) {
                          displayValue = closestTerm;
                        } else {
                          // Otherwise use polarities with intensity
                          let lowPole, highPole;
                          
                          // Use fallback polarities
                          if (fallbackPolarities[attr]) {
                            lowPole = fallbackPolarities[attr][0];
                            highPole = fallbackPolarities[attr][1];
                          } else {
                            // If still not found, use generic terms
                            lowPole = "low";
                            highPole = "high";
                          }
                          
                          // Map value to descriptive range
                          const normalizedValue = result.value / 10; // Assume 0-10 scale, normalize to 0-1
                          if (normalizedValue > 0.85) {
                            displayValue = `extremely ${highPole}`;
                          } else if (normalizedValue > 0.7) {
                            displayValue = `very ${highPole}`;
                          } else if (normalizedValue > 0.6) {
                            displayValue = `${highPole}`;
                          } else if (normalizedValue > 0.4) {
                            displayValue = `moderate`;
                          } else if (normalizedValue > 0.3) {
                            displayValue = `${lowPole}`;
                          } else if (normalizedValue > 0.15) {
                            displayValue = `very ${lowPole}`;
                          } else {
                            displayValue = `extremely ${lowPole}`;
                          }
                        }
                      }
                      } else {
                        // Just use the number if no mapping is available
                        displayValue = result.value.toString();
                      }
                    }
                  }
                } else {
                  displayValue = result.value.toString();
                }
              }
              
              // Create match element with improved styling
              const matchEl = document.createElement('div');
              matchEl.className = 'semantic-match';
              
              // Add visual indicator for confidence
              const confidencePercent = Math.round(result.confidence * 100);
              const confidenceClass = confidencePercent > 90 ? 'high-confidence' : 
                                      confidencePercent > 70 ? 'medium-confidence' : 'low-confidence';
              
              // Style based on attribute type
              let attrClass = '';
              if (attr === 'color') attrClass = 'color-attribute';
              else if (['texture', 'brightness', 'warmth'].includes(attr)) attrClass = 'sensory-attribute';
              else if (['pace', 'rhythm'].includes(attr)) attrClass = 'temporal-attribute';
              else if (['intensity', 'flow'].includes(attr)) attrClass = 'energy-attribute';
              else attrClass = 'other-attribute';
              
              matchEl.classList.add(attrClass);
              
              // Add HTML with confidence indicator
              matchEl.innerHTML = `
                <span class="attr-name">${attr}:</span> 
                <span class="attr-value">${displayValue}</span>
                <span class="attr-confidence ${confidenceClass}">${confidencePercent}%</span>
              `;
              semanticResultsEl.appendChild(matchEl);
            }
          }
        });
        
        // Show the results container
        semanticResultsEl.classList.add('has-results');
      }
    } else {
      // Hide semantic results if no direct matches
      const semanticResultsEl = document.getElementById('semantic-results');
      if (semanticResultsEl) {
        semanticResultsEl.classList.remove('has-results');
      }
    }
  } else {
    // Fall back to the standard algorithm
    vibeValues = generateVibeParametersFromText(text);
  }
  
  // Apply the generated values to all sliders
  Object.entries(vibeValues).forEach(([param, value]) => {
    // Update vibe state
    vibeState[param] = value;
    
    // Update slider UI
    if (elements.sliders[param]) {
      elements.sliders[param].value = value;
    }
  });
  
  // Clear active preset
  clearActivePreset();
  
  // Update description
  updateDescription();
  
  // Update visualizations if on visualizer view
  if (appState.currentView === 'visualizer') {
    renderVisualizations();
  }
  
  // Show general confirmation
  showNotification(`Generated vibe from text description`, 'success');
  
  // Switch to visualizer view to show the changes
  const visualizerButton = document.querySelector('.nav-button[data-view="visualizer"]');
  if (visualizerButton) {
    visualizerButton.click();
  }
}

// Generate vibe parameters from ANY text input
function generateVibeParametersFromText(text) {
  // We'll derive vibe values by looking at semantic, linguistic, and cultural patterns in the text
  
  // This leverages semantic space embeddings conceptually:
  // - Words that denote speed/pace occupy certain regions in embedding space
  // - Words that denote brightness/darkness have different embedding patterns
  // - Cultural references (like "jazz" or "cyberpunk") have associated vibes
  
  // 1. First, let's create context vectors by analyzing how much the text resonates with 
  //    different conceptual "poles" across our vibe dimensions
  
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
  
  // 2. Cultural/domain associations to adjust the values
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
  
  // 3. Special contexts that have strong established cultural vibes
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
  
  // 4. Transform the contextual associations into meaningful vibe parameter values
  
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
  
  // 5. Apply cultural modifiers to enhance the semantic understanding
  
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
  
  // 6. Apply special context modifiers
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
  
  // 7. Add a touch of hash-based pseudo-randomness to make each input uniquely deterministic
  const textHash = stringToHash(text);
  const randomBasis = (textHash % 100) / 100; // Value between 0-1
  
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
  
  console.log('Generated semantic vibe values:', values);
  
  return values;
}

// Helper function to determine how much the text resonates with a concept cluster
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

// Helper function to map a pair of opposing poles to a parameter value
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

// Helper function to adjust a value while keeping it in range
function adjustValue(value, adjustment) {
  return Math.max(0, Math.min(100, value + adjustment));
}

// Simple hash function for consistent pseudo-randomness
function stringToHash(string) {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    const char = string.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Utility function to map a value from one range to another
function mapValue(value, inMin, inMax, outMin, outMax) {
  // If we're mapping to strings, handle differently
  if (typeof outMin === 'string' && typeof outMax === 'string') {
    // For string outputs, we treat it as a binary choice based on the input value
    const normalizedValue = (value - inMin) / (inMax - inMin); // 0 to 1
    // If value is closer to inMax, return outMax, otherwise return outMin
    return normalizedValue >= 0.5 ? outMax : outMin;
  }
  
  // For numeric outputs, do the standard linear interpolation
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

// Simple perlin noise approximation for texture generation
function perlinNoise(x, y) {
  // Simple implementation - in a real app you'd use a proper perlin noise library
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  
  const topRight = (X + 1 + (Y + 1) * 57) / 5770;
  const topLeft = (X + (Y + 1) * 57) / 5770;
  const bottomRight = (X + 1 + Y * 57) / 5770;
  const bottomLeft = (X + Y * 57) / 5770;
  
  // Smoothed lerp for perlin noise
  const u = smootherstep(xf);
  const v = smootherstep(yf);
  
  return lerp(
    lerp(bottomLeft, bottomRight, u),
    lerp(topLeft, topRight, u),
    v
  );
}

// Improved smooth step function for noise
function smootherstep(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

// Linear interpolation
function lerp(a, b, t) {
  return a + t * (b - a);
}

// Expose critical functions globally to ensure they're available to inline scripts
window.processVibeText = function() {
  console.log("GLOBAL processVibeText called directly");
  
  const textInput = document.getElementById('vibe-text-input');
  if (!textInput) {
    console.error("Vibe text input element not found");
    alert("Error: Text input field not found.");
    return;
  }
  
  const text = textInput.value.trim();
  console.log("Input text:", text);
  
  if (!text) {
    alert('Please enter a vibe description');
    return;
  }
  
  // Show processing indication
  console.log(`Processing text: "${text}"`);
  
  // Check if semantic analyzer is loaded
  if (!window.semanticAnalyzer || !window.semanticAnalyzer.analyzeText) {
    console.error("Semantic analyzer not loaded or missing analyzeText function");
    alert("Error: Semantic analyzer not loaded. Please refresh the page.");
    return;
  }
  
  try {
    // Generate vibe parameters from input text
    const vibeValues = window.semanticAnalyzer.analyzeText(text);
    console.log("Generated vibe values:", vibeValues);
    
    // Update state with new values
    Object.keys(vibeValues).forEach(key => {
      if (vibeState[key] !== undefined) {
        vibeState[key] = vibeValues[key];
      }
    });
    
    // Update UI sliders
    Object.keys(vibeState).forEach(key => {
      const slider = document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase());
      if (slider) {
        slider.value = vibeState[key];
      }
    });
    
    // Update description
    const descEl = document.getElementById('vibe-description-text');
    if (descEl) {
      descEl.textContent = `Custom vibe generated from "${text}". Adjust sliders to fine-tune.`;
    }
    
    // Attempt to update visualizations
    try {
      if (typeof renderVisualizations === 'function') {
        renderVisualizations();
      } else {
        console.warn("renderVisualizations function not available");
      }
    } catch (visError) {
      console.error("Error rendering visualizations:", visError);
    }
    
    console.log("Text processing completed successfully");
  } catch (error) {
    console.error("Error processing text:", error);
    alert("Sorry, there was an error processing your text. Please try again.");
  }
};

window.loadPreset = function(presetName) {
  console.log(`GLOBAL loadPreset called for: ${presetName}`);
  
  if (!presets[presetName]) {
    console.error(`Preset "${presetName}" not found!`);
    return;
  }
  
  try {
    // Apply preset values to state
    Object.keys(presets[presetName]).forEach(key => {
      if (key !== 'description') {
        vibeState[key] = presets[presetName][key];
      }
    });
    
    // Update UI
    Object.keys(vibeState).forEach(key => {
      const slider = document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase());
      if (slider) {
        slider.value = vibeState[key];
      }
    });
    
    // Update description
    const descEl = document.getElementById('vibe-description-text');
    if (descEl && presets[presetName].description) {
      descEl.textContent = presets[presetName].description;
    }
    
    // Update visualizations
    if (typeof renderVisualizations === 'function') {
      renderVisualizations();
    } else {
      console.warn("renderVisualizations function not available");
    }
    
    console.log(`Preset "${presetName}" applied successfully`);
  } catch (error) {
    console.error("Error applying preset:", error);
    alert("Sorry, there was an error applying the preset. Please try again.");
  }
};

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM fully loaded, initializing app...");
  
  try {
    initApp();
    console.log("App initialization completed successfully");
  } catch (error) {
    console.error("ERROR DURING APP INITIALIZATION:", error);
    alert("There was a problem initializing the app. Please check console for details and try refreshing.");
  }
});