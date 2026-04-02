/**
 * EDGEBLADE Matchups Filtering System
 * Advanced element matchup filtering with smooth animations
 * Lead Developer: Enhanced feature set for interactive matchup analysis
 */

document.addEventListener('DOMContentLoaded', function() {
  const filterBtns = document.querySelectorAll('.matchup-filter-btn');
  const matchupCards = document.querySelectorAll('.matchup-card');

  /**
   * Filter matchup cards based on selected filter
   * @param {string} filterType - The filter to apply ('all', 'favorable', 'unfavorable')
   */
  function filterMatchups(filterType) {
    matchupCards.forEach((card, index) => {
      const matchupType = card.getAttribute('data-matchup');
      const shouldShow = filterType === 'all' || matchupType === filterType;
      
      if (shouldShow) {
        // Show card with animation
        card.classList.remove('hidden');
        card.style.display = 'block';
        card.style.pointerEvents = 'auto';
        
        // Trigger reflow to ensure display: block is applied
        void card.offsetHeight;
        
        // Animate in with stagger
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0) scale(1)';
        }, index * 50);
      } else {
        // Hide card with animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(-10px) scale(0.95)';
        card.style.pointerEvents = 'none';
        
        setTimeout(() => {
          card.style.display = 'none';
          card.classList.add('hidden');
        }, 300);
      }
    });
  }

  /**
   * Handle filter button clicks
   */
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Apply filter
      const filter = this.getAttribute('data-filter');
      filterMatchups(filter);
    });
  });

  /**
   * Initialize cards with proper styling and transitions
   */
  matchupCards.forEach((card, index) => {
    // Set initial state
    card.style.display = 'block';
    card.style.opacity = '1';
    card.style.transform = 'translateY(0) scale(1)';
    card.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
  });

  /**
   * Add keyboard shortcuts for filter navigation
   */
  document.addEventListener('keydown', function(e) {
    // Alt + 1: Show all matchups
    if (e.altKey && e.code === 'Digit1') {
      e.preventDefault();
      filterBtns[0].click();
    }
    // Alt + 2: Show favorable only
    if (e.altKey && e.code === 'Digit2') {
      e.preventDefault();
      filterBtns[1].click();
    }
    // Alt + 3: Show unfavorable only
    if (e.altKey && e.code === 'Digit3') {
      e.preventDefault();
      filterBtns[2].click();
    }
  });

  /**
   * Analytics tracking
   */
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      const visibleCount = Array.from(matchupCards).filter(card => 
        card.style.display !== 'none'
      ).length;
      
      console.log(`📊 Filter Applied: ${filter.toUpperCase()} | Visible Matchups: ${visibleCount}`);
    });
  });

  /**
   * Mobile touch optimization
   */
  filterBtns.forEach(btn => {
    btn.addEventListener('touchend', function(e) {
      e.preventDefault();
      this.click();
    });
  });

  console.log('✅ Matchups filtering system initialized');
  console.log('💡 Keyboard Shortcuts: Alt+1 (All), Alt+2 (Favorable), Alt+3 (Unfavorable)');
});
