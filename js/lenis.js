// js/lenis.js

export function initLenis() {
  if (typeof Lenis === "undefined") {
    console.warn("Lenis not loaded from CDN - smooth scrolling disabled");
    return;
  }

  try {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true
    });

    let rafId = null;

    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    console.log("Lenis initialized successfully");

    // Return cleanup function if needed
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  } catch (error) {
    console.error("Error initializing Lenis:", error);
  }
}
