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
      
      // Determine if card should be shown
      const shouldShow = filterType === 'all' || matchupType === filterType;
      
      if (shouldShow) {
        // Show with smooth animation
        card.classList.remove('hidden');
        setTimeout(() => {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 10);
        }, index * 50); // Stagger animation
      } else {
        // Hide with smooth animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(-10px) scale(0.95)';
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
      
      // Remove active state from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      
      // Add active state to clicked button
      this.classList.add('active');
      
      // Get filter type and apply
      const filter = this.getAttribute('data-filter');
      filterMatchups(filter);
    });
  });

  /**
   * Initialize with all matchups shown
   */
  matchupCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px) scale(0.95)';
    
    setTimeout(() => {
      card.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0) scale(1)';
    }, index * 100);
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
   * Analytics tracking (console logging for demo)
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
