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
  // Initialize DOM elements first
  initializeElements();
  
  // Initialize canvas contexts
  initializeContexts();
  
  // Set up event listeners
  setupEventListeners();
  
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
  
  // Preset button click events
  elements.presetButtons.forEach(button => {
    button.addEventListener('click', () => {
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
      }
    });
  });
  
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
  
  // Auto-dismiss after 3 seconds
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
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

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);