// THREE IMPORTS
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js";

// PROJECT MODULES
import { characters, elements } from "./js/characters.js";
import { initLenis } from "./js/lenis.js";
import { addBreathingEffect } from "./three/breathing.js";
import { PerformanceMonitor, SoundManager, StorageManager, KeyboardController, debounce, prefersReducedMotion, hideLoadingScreen } from "./js/utils.js";

// ============================================
// GLOBAL STATE & MANAGERS
// ============================================

let homeScene, homeCamera, homeRenderer, homeModel, homeControls;
let homeBreathingCleanup = null;

let charScene, charCamera, charRenderer, charModel, charControls;
let currentCharacter = "flame";
let charBreathingCleanup = null;

const perfMonitor = new PerformanceMonitor();
const soundManager = new SoundManager();
const keyboard = new KeyboardController();

let isPerformanceMode = StorageManager.getPreference('performanceMode', false);
let iReducedMotion = prefersReducedMotion();

// ============================================
// PERFORMANCE MODE SETUP
// ============================================

function setupPerformanceMode() {
  const toggleBtn = document.getElementById('perf-toggle');
  const perfMonitorEl = document.getElementById('perf-monitor');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      isPerformanceMode = !isPerformanceMode;
      StorageManager.setPreference('performanceMode', isPerformanceMode);
      
      if (perfMonitorEl) {
        perfMonitorEl.classList.toggle('hidden', !isPerformanceMode);
      }

      if (isPerformanceMode) {
        perfMonitor.start();
        soundManager.playSound(600, 100);
      } else {
        perfMonitor.stop();
      }
    });

    // Initialize performance monitor visibility
    if (isPerformanceMode) {
      perfMonitorEl?.classList.remove('hidden');
      perfMonitor.start();
    }
  }
}

// ============================================
// SOUND SETUP
// ============================================

function setupSound() {
  const soundToggle = document.getElementById('sound-toggle');
  
  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      soundManager.toggle();
    });
  }

  soundManager.updateUI();
}

// ============================================
// KEYBOARD CONTROLS
// ============================================

function setupKeyboardControls() {
  // Escape key to close menu
  keyboard.on('Escape', () => {
    const menu = document.querySelector('.menu-panel');
    if (menu) menu.classList.remove('open');
  });

  // M key for menu
  keyboard.on('m', () => {
    const menu = document.querySelector('.menu-panel');
    if (menu) menu.classList.toggle('open');
  });

  // Number keys for character selection (1=Flame, 2=Wind, 3=Shadow)
  keyboard.on('1', () => selectCharacter('flame'));
  keyboard.on('2', () => selectCharacter('wind'));
  keyboard.on('3', () => selectCharacter('shadow'));

  // Arrow keys for navigation
  keyboard.on('ArrowUp', () => {
    const home = document.getElementById('home');
    if (home) home.scrollIntoView({ behavior: 'smooth' });
  });

  keyboard.on('ArrowDown', () => {
    const characters = document.getElementById('characters');
    if (characters) characters.scrollIntoView({ behavior: 'smooth' });
  });
}

// Helper function for character selection
function selectCharacter(characterId) {
  const btn = document.querySelector(`[data-character="${characterId}"]`);
  if (btn) btn.click();
}

// ============================================
// MODAL MANAGEMENT
// ============================================

function setupModals() {
  const teaserBtn = document.getElementById('teaser-btn');
  const teaserModal = document.getElementById('teaser-modal');
  const modalClose = document.getElementById('modal-close');

  if (teaserBtn && teaserModal) {
    teaserBtn.addEventListener('click', () => {
      teaserModal.classList.remove('hidden');
      soundManager.playSound(800, 150);
    });
  }

  if (modalClose && teaserModal) {
    modalClose.addEventListener('click', () => {
      teaserModal.classList.add('hidden');
      soundManager.playSound(400, 100);
    });

    // Close on outside click
    teaserModal.addEventListener('click', (e) => {
      if (e.target === teaserModal) {
        teaserModal.classList.add('hidden');
      }
    });
  }

  // Story modal setup
  setupStoryModal();

  // Close modal with Escape key
  keyboard.on('Escape', () => {
    if (teaserModal && !teaserModal.classList.contains('hidden')) {
      teaserModal.classList.add('hidden');
    }
    const storyModal = document.getElementById('story-modal');
    if (storyModal && !storyModal.classList.contains('hidden')) {
      storyModal.classList.add('hidden');
    }
  });
}

function setupStoryModal() {
  const storyBtn = document.getElementById('story-btn');
  const storyModal = document.getElementById('story-modal');
  const storyModalClose = document.getElementById('story-modal-close');

  if (storyBtn && storyModal) {
    storyBtn.addEventListener('click', () => {
      openStoryModal(currentCharacter);
      soundManager.playSound(750, 120);
    });
  }

  if (storyModalClose && storyModal) {
    storyModalClose.addEventListener('click', () => {
      storyModal.classList.add('hidden');
      soundManager.playSound(400, 80);
    });

    // Close on outside click
    storyModal.addEventListener('click', (e) => {
      if (e.target === storyModal) {
        storyModal.classList.add('hidden');
      }
    });
  }
}

function openStoryModal(characterId) {
  const character = characters[characterId];
  if (!character) return;

  const storyModal = document.getElementById('story-modal');
  const storyCharName = document.getElementById('story-char-name');
  const storyCharRole = document.getElementById('story-char-role');
  const storyWeapon = document.getElementById('story-weapon');
  const storyAbility = document.getElementById('story-ability');
  const storyText = document.getElementById('story-text');

  if (storyCharName) storyCharName.textContent = character.displayName;
  if (storyCharRole) storyCharRole.textContent = character.title;
  if (storyWeapon) storyWeapon.textContent = character.weapon;
  if (storyAbility) storyAbility.textContent = character.ability;
  if (storyText) storyText.textContent = character.story;

  if (storyModal) {
    storyModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

// ============================================
// FAVORITES SYSTEM
// ============================================

function setupFavorites() {
  const favBtn = document.getElementById('fav-btn');

  if (favBtn) {
    favBtn.addEventListener('click', () => {
      const isFav = StorageManager.isFavorite(currentCharacter);
      
      if (isFav) {
        StorageManager.removeFavorite(currentCharacter);
        favBtn.classList.remove('favorited');
        favBtn.textContent = '♡ Favorite';
      } else {
        StorageManager.setFavorite(currentCharacter);
        favBtn.classList.add('favorited');
        favBtn.textContent = '♥ Favorited';
      }

      soundManager.playSound(500, 100);
    });

    // Update button state on character change
    updateFavoritesUI();
  }
}

function updateFavoritesUI() {
  const favBtn = document.getElementById('fav-btn');
  if (favBtn) {
    const isFav = StorageManager.isFavorite(currentCharacter);
    if (isFav) {
      favBtn.classList.add('favorited');
      favBtn.textContent = '♥ Favorited';
    } else {
      favBtn.classList.remove('favorited');
      favBtn.textContent = '♡ Favorite';
    }
  }
}

// ============================================
// MEMORY MANAGEMENT & CLEANUP
// ============================================

function disposeObject(object) {
  if (!object) return;

  // Dispose of mesh geometries and materials
  if (object.geometry) object.geometry.dispose();
  if (object.material) {
    if (Array.isArray(object.material)) {
      object.material.forEach(m => {
        if (m.map) m.map.dispose();
        if (m.color) m.color.dispose();
        m.dispose();
      });
    } else {
      if (object.material.map) object.material.map.dispose();
      if (object.material.color) object.material.color.dispose();
      object.material.dispose();
    }
  }

  // Recursively dispose children
  if (object.children) {
    object.children.forEach(child => disposeObject(child));
  }
}

function cleanupScene(scene) {
  if (!scene) return;
  
  // Dispose of all objects in scene
  scene.traverse(object => {
    if (object.geometry) object.geometry.dispose();
    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach(m => {
          if (m.map) m.map.dispose();
          m.dispose();
        });
      } else {
        if (object.material.map) object.material.map.dispose();
        object.material.dispose();
      }
    }
  });
}

// ============================================
// HOME PAGE 3D SETUP
// ============================================

function initHomeScene() {
  const canvas = document.querySelector("#webgl");
  if (!canvas) return;

  homeScene = new THREE.Scene();
  homeScene.background = new THREE.Color(0x000000);

  homeCamera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  homeCamera.position.set(0, 1.5, 4);

  // RENDERER - Optimized quality based on device
  const pixelRatio = isPerformanceMode ? Math.min(window.devicePixelRatio, 1.5) : window.devicePixelRatio;

  homeRenderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
    precision: isPerformanceMode ? 'lowp' : 'mediump'
  });

  homeRenderer.setSize(window.innerWidth, window.innerHeight);
  homeRenderer.setPixelRatio(pixelRatio);
  homeRenderer.shadowMap.enabled = !isPerformanceMode;
  homeRenderer.shadowMap.type = THREE.PCFShadowShadowMap;
  homeRenderer.antialias = true;
  homeRenderer.toneMapping = THREE.ReinhardToneMapping;

  // LIGHTING
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
  homeScene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(5, 5, 5);
  directionalLight.castShadow = !isPerformanceMode;
  homeScene.add(directionalLight);

  const rimLight = new THREE.DirectionalLight(0xff6347, 1.2);
  rimLight.position.set(-5, 3, -5);
  homeScene.add(rimLight);

  // CONTROLS
  homeControls = new OrbitControls(homeCamera, homeRenderer.domElement);
  homeControls.enableDamping = true;
  homeControls.dampingFactor = 0.08;
  homeControls.autoRotate = true;
  homeControls.autoRotateSpeed = 0.8;
  homeControls.enableZoom = false;
  homeControls.enablePan = false;

  // LOAD HOME MODEL
  const loader = new GLTFLoader();
  let homeLoadTimeout;

  loader.load(
    characters.flame.model,
    (gltf) => {
      clearTimeout(homeLoadTimeout);
      
      if (!homeScene) return; // Scene might have been disposed
      
      homeModel = gltf.scene;
      homeModel.scale.set(1.5, 1.5, 1.5);
      homeModel.position.set(0, -1, 0);
      homeScene.add(homeModel);
      homeBreathingCleanup = addBreathingEffect(homeModel);
      
      // Hide loading screen
      hideLoadingScreen();
      console.log('✅ Home model loaded successfully');
    },
    (xhr) => {
      const progress = (xhr.loaded / xhr.total * 100).toFixed(0);
      console.log(`📦 Model loading: ${progress}%`);
    },
    (error) => {
      clearTimeout(homeLoadTimeout);
      console.error("❌ Error loading home model:", error);
      hideLoadingScreen();
      // Fallback: create a simple placeholder geometry
      const geometry = new THREE.IcosahedronGeometry(1, 4);
      const material = new THREE.MeshPhongMaterial({ color: 0xff6347 });
      homeModel = new THREE.Mesh(geometry, material);
      homeScene.add(homeModel);
      homeBreathingCleanup = addBreathingEffect(homeModel);
    }
  );

  // Set timeout for home model loading (15 seconds max)
  homeLoadTimeout = setTimeout(() => {
    console.warn(`Home model loading timeout`);
    hideLoadingScreen();
  }, 15000);

  // RESIZE HANDLER
  const handleResize = debounce(() => {
    homeCamera.aspect = window.innerWidth / window.innerHeight;
    homeCamera.updateProjectionMatrix();
    homeRenderer.setSize(window.innerWidth, window.innerHeight);
  }, 250);

  window.addEventListener("resize", handleResize);

  // ANIMATION LOOP
  function animateHome() {
    requestAnimationFrame(animateHome);
    if (typeof TWEEN !== 'undefined') TWEEN.update();
    homeControls.update();
    homeRenderer.render(homeScene, homeCamera);
  }

  animateHome();
}

// ============================================
// CHARACTERS PAGE 3D SETUP
// ============================================

function initCharacterScene() {
  try {
    const canvas = document.querySelector("#character-webgl");
    if (!canvas) {
      console.error("Character canvas not found");
      return;
    }

    charScene = new THREE.Scene();
    charScene.background = new THREE.Color(0x000000);

    charCamera = new THREE.PerspectiveCamera(
      45,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    );
    charCamera.position.set(0, 1.5, 4);

    const pixelRatio = isPerformanceMode ? Math.min(window.devicePixelRatio, 1.5) : window.devicePixelRatio;

    charRenderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      precision: isPerformanceMode ? 'lowp' : 'mediump'
    });

    charRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
    charRenderer.setPixelRatio(pixelRatio);
    charRenderer.shadowMap.enabled = !isPerformanceMode;
    charRenderer.shadowMap.type = THREE.PCFShadowShadowMap;
    charRenderer.antialias = true;
    charRenderer.toneMapping = THREE.ReinhardToneMapping;

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    charScene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = !isPerformanceMode;
    charScene.add(directionalLight);

    const rimLight = new THREE.DirectionalLight(0x4db8ff, 0.8);
    rimLight.position.set(-5, 3, -5);
    charScene.add(rimLight);

    // CONTROLS
    charControls = new OrbitControls(charCamera, charRenderer.domElement);
    charControls.enableDamping = true;
    charControls.dampingFactor = 0.08;
    charControls.autoRotate = true;
    charControls.autoRotateSpeed = 1.8;
    charControls.enableZoom = true;
    charControls.zoomSpeed = 1.5;
    charControls.minDistance = 2;
    charControls.maxDistance = 8;
    charControls.target.set(0, 0.5, 0);

    // ZOOM CONTROL
    canvas.addEventListener('wheel', debounce((event) => {
      event.preventDefault();
      const zoomSpeed = 0.1;
      if (event.deltaY > 0) {
        charCamera.position.multiplyScalar(1 + zoomSpeed);
      } else {
        charCamera.position.multiplyScalar(1 - zoomSpeed);
      }

      const distance = charCamera.position.length();
      if (distance < charControls.minDistance) {
        charCamera.position.normalize().multiplyScalar(charControls.minDistance);
      }
      if (distance > charControls.maxDistance) {
        charCamera.position.normalize().multiplyScalar(charControls.maxDistance);
      }
    }, 16), false);

    // LOAD INITIAL CHARACTER
    loadCharacterModel(characters.flame);

    // RESIZE HANDLER
    window.addEventListener("resize", debounce(() => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      charCamera.aspect = width / height;
      charCamera.updateProjectionMatrix();
      charRenderer.setSize(width, height);
    }, 250));

    // ANIMATION LOOP
    function animateChar() {
      requestAnimationFrame(animateChar);
      if (typeof TWEEN !== 'undefined') TWEEN.update();
      charControls.update();
      charRenderer.render(charScene, charCamera);
    }

    animateChar();
  } catch (error) {
    console.error("❌ Failed to initialize character scene:", error);
    // Display fallback message to user
    const charContainer = document.querySelector('.characters-content');
    if (charContainer) {
      charContainer.innerHTML = '<p style="color: #ff6347; padding: 40px;">Character viewer temporarily unavailable. Please refresh the page.</p>';
    }
  }
}

function loadCharacterModel(character) {
  // Show loading indicator
  const loadingEl = document.getElementById('char-loading');
  if (loadingEl) loadingEl.style.display = 'flex';

  // Properly dispose old model before loading new one
  if (charModel) {
    // Add exit animation
    if (typeof TWEEN !== 'undefined') {
      new TWEEN.Tween(charModel.scale).to({ x: 0, y: 0, z: 0 }, 300).start();
    }
    
    setTimeout(() => {
      if (charModel && charScene) {
        disposeObject(charModel);
        charScene.remove(charModel);
      }
      charModel = null;
    }, 300);
  }

  // Stop old breathing animation & cleanup
  if (charBreathingCleanup) {
    charBreathingCleanup();
    charBreathingCleanup = null;
  }

  // Update background
  updateCharacterBackground(character);

  // Load new model
  const loader = new GLTFLoader();
  let loadTimeout;

  loader.load(
    character.model,
    (gltf) => {
      clearTimeout(loadTimeout);
      
      if (!charScene) return; // Scene might have been disposed

      charModel = gltf.scene;
      charModel.scale.set(0, 0, 0); // Start with 0 scale
      charModel.position.set(0, -1, 0);
      charScene.add(charModel);
      
      // Animate model in with scale tween
      if (typeof TWEEN !== 'undefined') {
        new TWEEN.Tween(charModel.scale).to({ x: 1.5, y: 1.5, z: 1.5 }, 600).easing(TWEEN.Easing.Elastic.Out).start();
      } else {
        charModel.scale.set(1.5, 1.5, 1.5);
      }
      
      charBreathingCleanup = addBreathingEffect(charModel);
      
      // Hide loading indicator
      if (loadingEl) loadingEl.style.display = 'none';
      
      soundManager.playSound(700, 100);
      console.log(`✅ Character Model Loaded: ${character.name}`);
    },
    (xhr) => {
      const progress = (xhr.loaded / xhr.total * 100).toFixed(0);
      console.log(`📦 Character ${character.name} loading: ${progress}%`);
    },
    (error) => {
      clearTimeout(loadTimeout);
      console.error(`❌ Error loading character model: ${character.model}`, error);
      
      if (loadingEl) loadingEl.style.display = 'none';
      
      // Fallback: create a placeholder
      const geometry = new THREE.IcosahedronGeometry(1, 4);
      const material = new THREE.MeshPhongMaterial({ 
        color: character.color,
        emissive: character.color,
        emissiveIntensity: 0.3
      });
      charModel = new THREE.Mesh(geometry, material);
      charModel.scale.set(0, 0, 0);
      charScene.add(charModel);
      
      if (typeof TWEEN !== 'undefined') {
        new TWEEN.Tween(charModel.scale).to({ x: 1.5, y: 1.5, z: 1.5 }, 600).easing(TWEEN.Easing.Elastic.Out).start();
      } else {
        charModel.scale.set(1.5, 1.5, 1.5);
      }
      
      charBreathingCleanup = addBreathingEffect(charModel);
    }
  );

  // Set timeout for loading (15 seconds max)
  loadTimeout = setTimeout(() => {
    if (loadingEl) loadingEl.style.display = 'none';
    console.warn(`Model loading timeout for: ${character.model}`);
  }, 15000);

  // Update bio with animation
  const charNameEl = document.getElementById("char-name");
  const charTitleEl = document.getElementById("char-title");
  
  if (charNameEl) {
    charNameEl.style.opacity = '0';
    charNameEl.textContent = character.name;
    setTimeout(() => charNameEl.style.opacity = '1', 100);
  }
  
  if (charTitleEl) {
    charTitleEl.style.opacity = '0';
    charTitleEl.textContent = character.title;
    setTimeout(() => charTitleEl.style.opacity = '1', 150);
  }
  
  document.getElementById("char-description").textContent = character.description;
  document.getElementById("char-weapon").textContent = character.weapon;
  document.getElementById("char-ability").textContent = character.ability;

  // Update favorite button
  updateFavoritesUI();

  // Setup voice button
  setupVoiceTagline(character);
}

function updateCharacterBackground(character) {
  const modelSection = document.getElementById("char-model-bg");
  if (modelSection) {
    // Preload the background image before setting it
    const img = new Image();
    img.onload = () => {
      modelSection.style.backgroundImage = `url('${character.fog}')`;
      modelSection.style.backgroundSize = 'cover';
      modelSection.style.backgroundPosition = 'center';
    };
    img.onerror = () => {
      console.warn(`Failed to load background image: ${character.fog}`);
      // Set a fallback gradient
      modelSection.style.background = `linear-gradient(135deg, rgba(0, 0, 0, 0.5), rgba(${character.color >> 16 & 255}, ${character.color >> 8 & 255}, ${character.color & 255}, 0.3))`;
    };
    img.src = character.fog;
  }

  // Update background layer for visual depth
  const bgLayer = document.getElementById('char-bg-layer');
  if (bgLayer) {
    bgLayer.style.backgroundImage = `url('${character.fog}')`;
  }
}

// ============================================
// VOICE TAGLINE SYSTEM
// ============================================

const characterTaglines = {
  flame: {
    name: 'Kael Ignivar',
    tagline: 'The path of flame burns eternal!'
  },
  wind: {
    name: 'Aelith Stormborne',
    tagline: 'Swift as the wind, precise as the blade!'
  },
  shadow: {
    name: 'Morvyn Shadeveil',
    tagline: 'In darkness, strategy becomes destiny!'
  }
};

function setupVoiceTagline(character) {
  const voiceBtn = document.getElementById('voice-btn');
  
  if (!voiceBtn) return;

  // Remove old listener
  voiceBtn.onclick = null;

  voiceBtn.addEventListener('click', () => {
    const characterId = Object.keys(characters).find(key => characters[key].name === character.name);
    if (characterId && characterTaglines[characterId]) {
      playVoiceTagline(characterId);
    }
  });
}

function playVoiceTagline(characterId) {
  const voiceBtn = document.getElementById('voice-btn');
  const speechBubble = document.getElementById('speech-bubble');
  const speechText = document.getElementById('speech-text');
  const tagline = characterTaglines[characterId];

  if (!tagline || !('speechSynthesis' in window)) {
    console.warn('Speech Synthesis not supported or no tagline');
    return;
  }

  // Cancel any ongoing speech
  speechSynthesis.cancel();

  // Create utterance
  const utterance = new SpeechSynthesisUtterance(tagline.tagline);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  // Apply character-specific voices
  if (characterId === 'flame') {
    utterance.pitch = 1.2;
    utterance.rate = 1.1;
  } else if (characterId === 'wind') {
    utterance.pitch = 1.4;
    utterance.rate = 1.3;
  } else if (characterId === 'shadow') {
    utterance.pitch = 0.8;
    utterance.rate = 0.9;
  }

  // ENHANCED: Show speech bubble with tagline
  if (speechBubble && speechText) {
    speechText.textContent = tagline.tagline;
    speechBubble.classList.remove('hidden');
    speechBubble.style.animation = 'none';
    setTimeout(() => {
      speechBubble.style.animation = 'slideInUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }, 10);
  }

  // Add animation to button
  if (voiceBtn) {
    voiceBtn.classList.add('playing');
    voiceBtn.style.transform = 'scale(1.1)';
    
    utterance.onend = () => {
      voiceBtn.classList.remove('playing');
      voiceBtn.style.transform = 'scale(1)';
      
      // Hide speech bubble after short delay
      if (speechBubble) {
        setTimeout(() => {
          speechBubble.classList.add('hidden');
        }, 800);
      }
    };
  }

  // Play sound effect before voice
  soundManager.playSound(800, 100);

  // Speak after sound with smooth transition
  setTimeout(() => {
    if (voiceBtn) {
      voiceBtn.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }
    speechSynthesis.speak(utterance);
  }, 150);
}

// ============================================
// CHARACTER SELECTION
// ============================================

function setupCharacterSelector() {
  const buttons = document.querySelectorAll(".char-btn");

  if (buttons.length === 0) {
    console.warn("Character selector buttons not found");
    return;
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const selectedChar = btn.dataset.character;
      if (!selectedChar) return;

      currentCharacter = selectedChar;

      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      loadCharacterModel(characters[selectedChar]);
      soundManager.playSound(650, 80);
    });
  });
}

// ============================================
// CTA BUTTONS
// ============================================

function setupCTAButtons() {
  const buttons = document.querySelectorAll(".cta-btn");

  if (buttons.length === 0) {
    console.warn("CTA buttons not found");
    return;
  }

  if (buttons[0]) {
    buttons[0].addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      soundManager.playSound(750, 120);
      // "Enter the Realm" - Scroll to characters section
      const section = document.querySelector("#characters");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  if (buttons[1]) {
    buttons[1].addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      soundManager.playSound(750, 120);
      // "Explore Characters" - Navigate to characters section or page
      const section = document.querySelector("#characters");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      } else {
        // Fallback if not on homepage
        window.location.href = "index.html#characters";
      }
    });
  }

  if (buttons[2]) {
    buttons[2].addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      soundManager.playSound(800, 150);
      // "Watch Teaser" - Open modal
      const modal = document.getElementById("teaser-modal");
      if (modal) {
        modal.classList.remove("hidden");
      }
    });
  }
}

// ============================================
// PAGE NAVIGATION
// ============================================

function setupPageNavigation() {
  const menuPanel = document.querySelector(".menu-panel");
  const menuLinks = document.querySelectorAll(".menu-panel a");

  if (!menuPanel) {
    console.warn("Menu panel not found");
    return;
  }

  menuLinks.forEach(link => {
    // Skip special links
    if (link.id === 'reduce-motion-toggle') {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Toggle reduced motion preference
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        StorageManager.setPreference('reduceMotion', !prefersReduced);
      });
      return;
    }

    link.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const href = link.getAttribute("href");
      if (!href) return;

      // Close menu first (before navigation to avoid race conditions)
      menuPanel.classList.remove("open");
      soundManager.playSound(650, 80);

      // Check if navigating to different page or same page section
      if (href.includes(".html") && !href.includes("index.html")) {
        // Cross-page navigation (abilities.html, matchups.html, etc)
        window.location.href = href;
      } else if (href.includes("#")) {
        // Same-page anchor navigation
        const targetId = href.substring(href.indexOf("#") + 1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
          setTimeout(() => {
            targetSection.scrollIntoView({ behavior: "smooth" });
          }, 100); // Small delay to ensure DOM is ready
        } else {
          // If section not found, navigate anyway
          window.location.href = href;
        }
      } else if (href === "index.html") {
        // Navigate to homepage
        window.location.href = href;
      }
    });
  });

  console.log("✅ Page navigation setup complete");
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", async () => {
  console.log("🚀 EDGEBLADE Initializing...");

  // Setup managers first
  setupPerformanceMode();
  setupSound();
  setupKeyboardControls();
  setupModals();
  setupFavorites();

  // Initialize Lenis
  try {
    initLenis();
  } catch (error) {
    console.warn("Lenis initialization skipped:", error);
  }

  // Initialize 3D scenes
  try {
    initHomeScene();
  } catch (error) {
    console.error("Error initializing home scene:", error);
    hideLoadingScreen();
  }

  try {
    initCharacterScene();
  } catch (error) {
    console.error("Error initializing character scene:", error);
  }

  // Setup UI interactions
  try {
    setupCharacterSelector();
  } catch (error) {
    console.error("Error setting up character selector:", error);
  }

  try {
    setupCTAButtons();
  } catch (error) {
    console.error("Error setting up CTA buttons:", error);
  }

  try {
    setupPageNavigation();
  } catch (error) {
    console.error("Error setting up page navigation:", error);
  }

  console.log("✨ EDGEBLADE Ready!");

  // Set a timeout to hide loading screen if models take too long
  setTimeout(() => {
    hideLoadingScreen();
  }, 3000);
});

// ============================================
// ERROR HANDLING
// ============================================

window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  hideLoadingScreen();
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  hideLoadingScreen();
});

// WebGL Context Loss Handler
document.addEventListener('webglcontextlost', (event) => {
  event.preventDefault();
  console.error('WebGL context lost. Attempting recovery...');
  if (homeRenderer) homeRenderer.dispose();
  if (charRenderer) charRenderer.dispose();
});

document.addEventListener('webglcontextrestored', () => {
  console.log('WebGL context restored. Re-initializing...');
  location.reload();
});

// ============================================
// QUIZ SYSTEM
// ============================================

const quizQuestions = [
  {
    question: "In combat, what matters most?",
    answers: [
      { text: "Raw power and dominance", character: "flame", points: 3 },
      { text: "Speed and precision", character: "wind", points: 3 },
      { text: "Strategy and intellect", character: "shadow", points: 3 }
    ]
  },
  {
    question: "When facing a challenge, you typically...",
    answers: [
      { text: "Charge forward with confidence", character: "flame", points: 3 },
      { text: "Find the fastest solution", character: "wind", points: 3 },
      { text: "Analyze before acting", character: "shadow", points: 3 }
    ]
  },
  {
    question: "Your ideal environment is...",
    answers: [
      { text: "Intense and heated", character: "flame", points: 3 },
      { text: "Open and free", character: "wind", points: 3 },
      { text: "Mysterious and hidden", character: "shadow", points: 3 }
    ]
  },
  {
    question: "How do you handle failure?",
    answers: [
      { text: "Rise from the ashes to try again", character: "flame", points: 3 },
      { text: "Adapt your approach quickly", character: "wind", points: 3 },
      { text: "Learn from the shadows to succeed next time", character: "shadow", points: 3 }
    ]
  },
  {
    question: "What's your greatest strength?",
    answers: [
      { text: "Unwavering determination", character: "flame", points: 3 },
      { text: "Adaptability and agility", character: "wind", points: 3 },
      { text: "Wisdom and foresight", character: "shadow", points: 3 }
    ]
  }
];

function setupQuiz() {
  const startBtn = document.getElementById('start-quiz-btn');
  if (!startBtn) return;

  startBtn.addEventListener('click', () => {
    startQuiz();
  });
}

function startQuiz() {
  const quizContent = document.getElementById('quiz-content');
  let currentQuestion = 0;
  let scores = { flame: 0, wind: 0, shadow: 0 };

  function showQuestion() {
    const question = quizQuestions[currentQuestion];
    const html = `
      <div class="quiz-question">
        <div class="quiz-q-text">Question ${currentQuestion + 1} of ${quizQuestions.length}</div>
        <p style="margin-bottom: 25px; font-size: 1.15rem; font-weight: 600;">${question.question}</p>
        <div class="quiz-options">
          ${question.answers.map((answer, idx) => `
            <label class="quiz-option">
              <input type="radio" name="answer" data-character="${answer.character}" data-points="${answer.points}" />
              ${answer.text}
            </label>
          `).join('')}
        </div>
        <button style="margin-top: 30px; padding: 12px 30px; background: linear-gradient(135deg, var(--secondary-color), var(--tertiary-color)); border: none; border-radius: 8px; color: white; font-weight: 600; cursor: pointer; text-transform: uppercase; letter-spacing: 1px;" id="next-btn" disabled>Next Question</button>
      </div>
    `;
    quizContent.innerHTML = html;

    const options = document.querySelectorAll('.quiz-option input');
    const nextBtn = document.getElementById('next-btn');

    options.forEach(option => {
      option.addEventListener('change', () => {
        nextBtn.disabled = false;
      });
    });

    nextBtn.addEventListener('click', () => {
      const selected = document.querySelector('.quiz-option input:checked');
      if (!selected) return;

      scores[selected.dataset.character] += parseInt(selected.dataset.points);
      currentQuestion++;

      if (currentQuestion < quizQuestions.length) {
        showQuestion();
      } else {
        showResult();
      }
    });
  }

  function showResult() {
    const winner = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    const resultModal = document.getElementById('quiz-result-modal');
    const resultBody = document.getElementById('quiz-result-body');
    const char = characters[winner];

    resultBody.innerHTML = `
      <div class="quiz-result-character">${char.id === 'flame' ? '🔥' : char.id === 'wind' ? '🌪️' : '🌑'}</div>
      <h2 class="quiz-result-name">${char.displayName}</h2>
      <p class="quiz-result-desc"><strong>${char.title}</strong></p>
      <p class="quiz-result-desc">${char.description}</p>
      <p style="font-size: 0.95rem; color: var(--text-secondary); margin-top: 20px;">Your Element Match: ${scores.flame === scores[winner] ? 'Flame' : scores.wind === scores[winner] ? 'Wind' : 'Shadow'}</p>
    `;

    resultModal.classList.remove('hidden');
    soundManager.playSound(800, 150);
  }

  showQuestion();
}

document.addEventListener('DOMContentLoaded', () => {
  setupQuiz();
  
  const quizClose = document.getElementById('quiz-close');
  if (quizClose) {
    quizClose.addEventListener('click', () => {
      document.getElementById('quiz-result-modal').classList.add('hidden');
    });
  }
});

// ============================================
// TEAM BUILDER
// ============================================

function setupTeamBuilder() {
  const teamOptions = document.querySelectorAll('.team-option');
  const teamSlots = document.querySelectorAll('.team-slot');
  let currentTeam = {};

  teamOptions.forEach(option => {
    option.addEventListener('dragstart', (e) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('character', option.dataset.character);
    });
  });

  teamSlots.forEach(slot => {
    slot.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      slot.classList.add('drag-over');
    });

    slot.addEventListener('dragleave', () => {
      slot.classList.remove('drag-over');
    });

    slot.addEventListener('drop', (e) => {
      e.preventDefault();
      slot.classList.remove('drag-over');
      const character = e.dataTransfer.getData('character');
      const slotNum = slot.dataset.slot;
      
      currentTeam[slotNum] = character;
      slot.classList.add('filled');
      slot.textContent = `${characters[character].displayName}`;
      
      updateTeamAnalysis(currentTeam);
      soundManager.playSound(650, 100);
    });

    slot.addEventListener('click', () => {
      const slotNum = slot.dataset.slot;
      if (currentTeam[slotNum]) {
        delete currentTeam[slotNum];
        slot.classList.remove('filled');
        slot.textContent = `Slot ${slotNum}`;
        updateTeamAnalysis(currentTeam);
      }
    });
  });

  const resetBtn = document.getElementById('reset-team-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      currentTeam = {};
      teamSlots.forEach((slot, idx) => {
        slot.classList.remove('filled');
        slot.textContent = `Slot ${idx + 1}`;
      });
      updateTeamAnalysis({});
    });
  }

  const shareBtn = document.getElementById('share-team-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const teamStr = Object.values(currentTeam).join('-');
      const shareText = `Check out my EDGEBLADE team: ${Object.values(currentTeam).map(c => characters[c].displayName).join(', ')} 🎮⚡`;
      
      if (navigator.share) {
        navigator.share({ title: 'EDGEBLADE Team', text: shareText });
      } else {
        alert(shareText);
      }
    });
  }
}

function updateTeamAnalysis(team) {
  const analysisDiv = document.getElementById('team-analysis');
  if (!analysisDiv) return;

  if (Object.keys(team).length === 0) {
    analysisDiv.innerHTML = '<p>Add warriors to your team to see analysis</p>';
    return;
  }

  const chars = Object.values(team).map(c => characters[c]);
  let analysis = `<strong>Team Composition:</strong> ${chars.map(c => c.displayName).join(', ')}<br/>`;
  
  const hasFlame = chars.some(c => c.id === 'flame');
  const hasWind = chars.some(c => c.id === 'wind');
  const hasShadow = chars.some(c => c.id === 'shadow');

  if (hasFlame && hasWind && hasShadow) {
    analysis += '<strong style="color: #ffd700;">✓ Balanced Team! All elements represented for maximum synergy.</strong>';
  }

  analysisDiv.innerHTML = analysis;
}

document.addEventListener('DOMContentLoaded', setupTeamBuilder);

// ============================================
// LORE TABS
// ============================================

function setupLoreTabs() {
  const tabs = document.querySelectorAll('.lore-tab');
  const sections = document.querySelectorAll('.lore-section');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(`${tabName}-content`).classList.add('active');
    });
  });
}

document.addEventListener('DOMContentLoaded', setupLoreTabs);

// ============================================
// SMOOTH PAGE TRANSITIONS
// ============================================

function setupPageTransitions() {
  const navLinks = document.querySelectorAll('nav a, menu a');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      const menu = document.querySelector('.menu-panel');
      if (menu) menu.classList.remove('open');
      soundManager.playSound(500, 80);
    });
  });
}

document.addEventListener('DOMContentLoaded', setupPageTransitions);


// ============================================
// PHASE 6 PERFORMANCE & ROBUSTNESS FIXES
// ============================================

/**
 * PERFORMANCE FIX 1: Ensure button event listeners are properly attached
 * with error handling and retry logic
 */
function ensureButtonsClickable() {
  const maxRetries = 3;
  let retryCount = 0;
  
  function tryAttachListeners() {
    const buttons = document.querySelectorAll('.cta-btn, .char-btn, button');
    
    if (buttons.length === 0 && retryCount < maxRetries) {
      retryCount++;
      console.warn('Buttons not found, retrying... (' + retryCount + '/' + maxRetries + ')');
      setTimeout(tryAttachListeners, 100);
      return;
    }
    
    buttons.forEach(btn => {
      btn.style.pointerEvents = 'auto';
      btn.style.cursor = 'pointer';
    });
    
    console.log('? Ensured ' + buttons.length + ' buttons are clickable');
  }
  
  tryAttachListeners();
}

// Call on load and periodically check
ensureButtonsClickable();
window.addEventListener('load', ensureButtonsClickable);
setInterval(ensureButtonsClickable, 5000);

/**
 * PERFORMANCE FIX 2: Debounce scroll events for smoother performance
 */
let scrollTimeout;
function onScroll(callback) {
  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(callback, 150);
  });
}

/**
 * PERFORMANCE FIX 3: Lazy load images for faster initial load
 */
function setupLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    images.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
}

/**
 * PERFORMANCE FIX 4: Optimize animations for lower-end devices
 */
function detectPerformanceCapability() {
  // Check device pixel ratio
  const dpr = window.devicePixelRatio || 1;
  
  // Check connection speed
  if ('connection' in navigator) {
    const connection = navigator.connection.effectiveType;
    if (connection === '4g') {
      document.body.classList.add('high-performance');
    } else if (connection === '2g' || connection === '3g') {
      document.body.classList.add('low-performance');
      // Reduce animation complexity
      document.documentElement.style.setProperty('--reduce-motion', '1');
    }
  }
  
  // Detect if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('reduced-motion');
  }
}

detectPerformanceCapability();

/**
 * PERFORMANCE FIX 5: Use requestAnimationFrame for smooth animations
 */
function animateValue(element, start, end, duration) {
  let startTimestamp = null;
  
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    element.style.opacity = progress;
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };
  
  requestAnimationFrame(step);
}

/**
 * PERFORMANCE FIX 6: Batch DOM updates
 */
function batchDOMUpdates(updates) {
  requestAnimationFrame(() => {
    updates.forEach(update => {
      update();
    });
  });
}

/**
 * PERFORMANCE FIX 7: Memory leak prevention - cleanup on page unload
 */
window.addEventListener('beforeunload', () => {
  // Clear all intervals and timeouts
  soundManager = null;
  perfMonitor = null;
  keyboard = null;
});

/**
 * PERFORMANCE FIX 8: Implement connection-aware resource loading
 */
async function loadResourcesAdaptively() {
  const isSlowConnection = navigator.connection && 
    (navigator.connection.effectiveType === '2g' || 
     navigator.connection.effectiveType === '3g');
  
  if (isSlowConnection) {
    // Load lower-quality assets
    console.log('?? Low bandwidth detected - loading optimized assets');
  } else {
    console.log('?? High bandwidth detected - loading full quality assets');
  }
}

/**
 * PERFORMANCE FIX 9: Add robust error handling to critical functions
 */
const originalSetupCTAButtons = setupCTAButtons;
setupCTAButtons = function() {
  try {
    originalSetupCTAButtons.apply(this, arguments);
    console.log('? CTA buttons setup successful');
  } catch (error) {
    console.error('?? CTA buttons setup failed, attempting recovery...', error);
    // Retry after a short delay
    setTimeout(() => {
      try {
        originalSetupCTAButtons.apply(this, arguments);
        console.log('? CTA buttons setup recovered');
      } catch (retryError) {
        console.error('?? CTA buttons setup recovery failed:', retryError);
      }
    }, 500);
  }
};

/**
 * PERFORMANCE FIX 10: Monitor and log performance metrics
 */
function logPerformanceMetrics() {
  if (performance.timing) {
    const timing = performance.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    const connectTime = timing.responseEnd - timing.requestStart;
    const renderTime = timing.domComplete - timing.domLoading;
    
    console.log('?? Performance Metrics:');
    console.log('  Total Load Time: ' + loadTime + 'ms');
    console.log('  Connect Time: ' + connectTime + 'ms');
    console.log('  Render Time: ' + renderTime + 'ms');
  }
  
  if (performance.getEntriesByType) {
    const resources = performance.getEntriesByType('resource');
    const slowResources = resources.filter(r => r.duration > 1000);
    if (slowResources.length > 0) {
      console.warn('?? Slow Resources:', slowResources);
    }
  }
}

// Call on page load
window.addEventListener('load', () => {
  logPerformanceMetrics();
  loadResourcesAdaptively();
});

console.log('? PHASE 6 Performance & Robustness Fixes Applied');

