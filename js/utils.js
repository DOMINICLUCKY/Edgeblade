// ============================================
// UTILITY FUNCTIONS
// ============================================

// Performance Monitoring
export class PerformanceMonitor {
  constructor() {
    this.fps = 0;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.isMonitoring = false;
  }

  start() {
    this.isMonitoring = true;
    this.update();
  }

  stop() {
    this.isMonitoring = false;
  }

  update() {
    const now = performance.now();
    this.frameCount++;

    if (now >= this.lastTime + 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastTime = now;

      this.updateUI();
    }

    if (this.isMonitoring) {
      requestAnimationFrame(() => this.update());
    }
  }

  updateUI() {
    const fpsEl = document.getElementById('fps');
    const memEl = document.getElementById('mem');

    if (fpsEl) {
      fpsEl.textContent = Math.round(this.fps);
    }

    if (memEl && performance.memory) {
      const memUsage = Math.round(performance.memory.usedJSHeapSize / 1048576);
      memEl.textContent = memUsage;
    }
  }

  getMetrics() {
    return {
      fps: this.fps,
      memory: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : 0
    };
  }
}

// Local Storage Manager
export class StorageManager {
  static setFavorite(characterId) {
    const favorites = this.getFavorites();
    if (!favorites.includes(characterId)) {
      favorites.push(characterId);
      localStorage.setItem('edgeblade_favorites', JSON.stringify(favorites));
    }
  }

  static removeFavorite(characterId) {
    const favorites = this.getFavorites();
    const index = favorites.indexOf(characterId);
    if (index > -1) {
      favorites.splice(index, 1);
      localStorage.setItem('edgeblade_favorites', JSON.stringify(favorites));
    }
  }

  static getFavorites() {
    try {
      const stored = localStorage.getItem('edgeblade_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static isFavorite(characterId) {
    return this.getFavorites().includes(characterId);
  }

  static setPreference(key, value) {
    const prefs = this.getPreferences();
    prefs[key] = value;
    localStorage.setItem('edgeblade_prefs', JSON.stringify(prefs));
  }

  static getPreference(key, defaultValue = null) {
    try {
      const prefs = JSON.parse(localStorage.getItem('edgeblade_prefs') || '{}');
      return prefs[key] !== undefined ? prefs[key] : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  static getPreferences() {
    try {
      return JSON.parse(localStorage.getItem('edgeblade_prefs') || '{}');
    } catch {
      return {};
    }
  }
}

// Sound Manager
export class SoundManager {
  constructor() {
    this.enabled = StorageManager.getPreference('soundEnabled', true);
    this.audioContext = null;
    this.oscillator = null;
    this.initAudioOnFirstInteraction();
  }

  initAudioOnFirstInteraction() {
    const initAudio = () => {
      try {
        if (!this.audioContext) {
          this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
          console.log('✅ AudioContext initialized');
        }
      } catch (error) {
        console.warn('AudioContext initialization failed:', error);
      }
      document.removeEventListener('click', initAudio);
      document.removeEventListener('keydown', initAudio);
      document.removeEventListener('touchstart', initAudio);
    };

    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('keydown', initAudio, { once: true });
    document.addEventListener('touchstart', initAudio, { once: true });
  }

  toggle() {
    this.enabled = !this.enabled;
    StorageManager.setPreference('soundEnabled', this.enabled);
    this.updateUI();
    return this.enabled;
  }

  updateUI() {
    const btn = document.getElementById('sound-toggle');
    if (btn) {
      btn.textContent = this.enabled ? '🔊' : '🔇';
    }
  }

  playSound(frequency = 440, duration = 100) {
    if (!this.enabled || !this.audioContext) return;

    try {
      const ctx = this.audioContext;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.type = 'sine';

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration / 1000);
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }
}

// Keyboard Controller
export class KeyboardController {
  constructor() {
    this.handlers = {};
    this.setupListeners();
  }

  on(key, callback) {
    if (!this.handlers[key]) {
      this.handlers[key] = [];
    }
    this.handlers[key].push(callback);
  }

  off(key, callback) {
    if (this.handlers[key]) {
      const index = this.handlers[key].indexOf(callback);
      if (index > -1) {
        this.handlers[key].splice(index, 1);
      }
    }
  }

  setupListeners() {
    document.addEventListener('keydown', (e) => {
      const handlers = this.handlers[e.key] || [];
      handlers.forEach(handler => handler(e));
    });
  }

  triggerKey(key) {
    const handlers = this.handlers[key] || [];
    handlers.forEach(handler => handler(null));
  }
}

// Debounce utility
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Detect reduced motion preference
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Loading screen management
export function hideLoadingScreen() {
  const screen = document.getElementById('loading-screen');
  if (screen) {
    screen.classList.add('fade-out');
    setTimeout(() => {
      screen.style.display = 'none';
      screen.style.pointerEvents = 'none';
    }, 600);
  }
}
