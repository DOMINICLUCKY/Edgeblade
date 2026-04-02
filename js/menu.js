// js/menu.js

// Menu Toggle
const menuBtn = document.getElementById("menu-btn");
const menuPanel = document.querySelector(".menu-panel");

if (menuBtn && menuPanel) {
  // Add proper error handling
  let isMenuOpen = false;
  
  // Handler with debouncing to prevent crashes
  let menuClickTimeout;
  menuBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Debounce rapid clicks
    if (menuClickTimeout) clearTimeout(menuClickTimeout);
    
    isMenuOpen = !isMenuOpen;
    
    if (isMenuOpen) {
      menuPanel.classList.add("open");
    } else {
      menuPanel.classList.remove("open");
    }
  });

  // Close menu when clicking outside (with throttle to prevent lag)
  let closeMenuTimeout;
  document.addEventListener("click", (e) => {
    if (closeMenuTimeout) clearTimeout(closeMenuTimeout);
    
    closeMenuTimeout = setTimeout(() => {
      // Only close if clicking outside menu and button
      const isOutside = menuPanel && !menuPanel.contains(e.target) && e.target !== menuBtn;
      const isMenuBtn = e.target === menuBtn || menuBtn?.contains(e.target);
      
      if (isOutside && isMenuOpen) {
        menuPanel.classList.remove("open");
        isMenuOpen = false;
      }
    }, 50); // Small delay to prevent rapid toggling
  });

  // Close menu when clicking a link (prevent double-closing)
  const menuLinks = menuPanel.querySelectorAll("a");
  menuLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      if (link.id !== 'reduce-motion-toggle') { // Don't close for special links
        menuPanel.classList.remove("open");
        isMenuOpen = false;
      }
    });
  });

  console.log("✅ Menu system initialized");
} else {
  console.warn("Menu button or menu panel not found");
}
