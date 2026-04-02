/**
 * EDGEBLADE Matchups - Modern Comparison System
 * Advanced element matchup filtering with smooth animations
 * Lead Developer: Premium interactive matchup showcase
 */

document.addEventListener('DOMContentLoaded', function() {
  const categoryBtns = document.querySelectorAll('.category-btn');
  const matchupCards = document.querySelectorAll('.matchup-comparison-card');

  console.log(`🎮 Matchups page initialized with ${matchupCards.length} comparison cards`);

  /**
   * Filter matchup cards based on selected category
   * @param {string} category - The category to show ('all', 'favorable', 'unfavorable')
   */
  function filterMatchups(category) {
    let visibleCount = 0;
    let delay = 0;

    matchupCards.forEach((card) => {
      const cardCategory = card.getAttribute('data-category');
      const shouldShow = category === 'all' || cardCategory === category;
      
      if (shouldShow) {
        // Show card with staggered animation
        setTimeout(() => {
          card.classList.remove('hidden');
          card.style.display = 'grid';
          card.style.pointerEvents = 'auto';
          card.style.animation = 'fadeIn 0.5s ease forwards';
        }, delay);
        
        delay += 50;
        visibleCount++;
      } else {
        // Hide card
        card.style.display = 'none';
        card.classList.add('hidden');
        card.style.animation = 'none';
      }
    });

    console.log(`📊 Category: ${category.toUpperCase()} | Visible: ${visibleCount} matchups`);
  }

  /**
   * Handle category button clicks
   */
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Update active state with premium effect
      categoryBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Apply category filter
      const category = this.getAttribute('data-category');
      filterMatchups(category);
    });
  });

  /**
   * Initialize all cards with proper display
   */
  matchupCards.forEach((card) => {
    card.style.display = 'grid';
    card.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
  });

  /**
   * Keyboard shortcuts for quick navigation
   */
  document.addEventListener('keydown', function(e) {
    // Alt + 1: Show all matchups
    if (e.altKey && e.code === 'Digit1') {
      e.preventDefault();
      categoryBtns[0]?.click?.();
      console.log('⌨️ Shortcut: Alt+1 - Show All');
    }
    // Alt + 2: Show favorable only
    else if (e.altKey && e.code === 'Digit2') {
      e.preventDefault();
      categoryBtns[1]?.click?.();
      console.log('⌨️ Shortcut: Alt+2 - Favorable Only');
    }
    // Alt + 3: Show unfavorable only
    else if (e.altKey && e.code === 'Digit3') {
      e.preventDefault();
      categoryBtns[2]?.click?.();
      console.log('⌨️ Shortcut: Alt+3 - Unfavorable Only');
    }
  });

  /**
   * Touch optimization for mobile
   */
  categoryBtns.forEach(btn => {
    btn.addEventListener('touchend', function(e) {
      e.preventDefault();
      this.click();
    });
  });

  /**
   * Add hover interactions to cards
   */
  matchupCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.zIndex = '10';
    });
    card.addEventListener('mouseleave', function() {
      this.style.zIndex = '1';
    });
  });

  console.log('✅ Matchups system ready');
  console.log('💡 Keyboard: Alt+1 (All), Alt+2 (Favorable), Alt+3 (Unfavorable)');
});
