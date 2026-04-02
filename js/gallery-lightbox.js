// Gallery Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Gallery Filters
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  galleryFilterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      
      // Update active button
      galleryFilterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Filter items
      galleryItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-filter') === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
          }, 10);
        } else {
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Lightbox Functionality
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxImage = document.querySelector('.lightbox-image');
  const lightboxTitle = document.querySelector('.lightbox-title');
  const lightboxDescription = document.querySelector('.lightbox-description');
  
  if (lightboxModal) {
    // Open lightbox on gallery item click
    galleryItems.forEach(item => {
      item.addEventListener('click', function() {
        const img = this.querySelector('.gallery-image');
        const title = this.querySelector('h3').textContent;
        const subtitle = this.querySelector('.character-title').textContent;
        const element = this.querySelector('.character-element').textContent;
        
        if (img) {
          lightboxImage.src = img.src;
          lightboxTitle.textContent = title;
          lightboxDescription.textContent = `${subtitle} • ${element}`;
          lightboxModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });
    
    // Close lightbox
    lightboxClose.addEventListener('click', function() {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
    
    // Close on background click
    lightboxModal.addEventListener('click', function(e) {
      if (e.target === this) {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  }
});

// Stats Page Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const statCards = document.querySelectorAll('.character-stat-card');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Filter cards
      statCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-element') === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
});
