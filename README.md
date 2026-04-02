# ⚔️ EDGEBLADE - Interactive Element Battle Arena

![Edgeblade Banner](assets/backgrounds/flamefog.png)

## 🎮 Overview

**EDGEBLADE** is an immersive interactive web experience featuring three elemental warriors locked in eternal combat. Explore dynamic character matchups, build strategic teams, master abilities, and dive deep into a rich fantasy lore system. This is a premium HTML5/CSS3/JavaScript experience with stunning animations and glassmorphic UI design.

- 🔥 **Flame Element** - The Inferno Vanguard (Kael Ignivar)
- 🌪️ **Wind Element** - The Wind Sentinel (Aelith Stormborne)
- 🌑 **Shadow Element** - The Silent Eclipse (Morvyn Shadeveil)

---

## ✨ Features

### 🏠 **Home Page**
- Immersive landing page with hero section
- Character showcase with smooth scrolling
- Story introduction and world-building
- Navigation to all game features

### 📊 **Rankings Page**
- Character tier rankings with detailed stats
- Element-based filtering system (Flame/Wind/Shadow)
- Pulsing element badges for quick identification
- Power level meters showing total warrior strength
- Smooth filter animations with visual feedback

### 🎨 **Gallery Page**
- High-resolution character artwork showcase
- Interactive lightbox modal for fullscreen viewing
- Gallery filtering by element type
- Element indicator badges on each image
- PNG background overlays creating atmospheric depth
- Keyboard shortcuts: Escape to close, click outside to dismiss

### ⚡ **Abilities Page**
- Comprehensive ability listings for each element
- Interactive cards with descriptions and effects
- Detailed power level and cooldown information
- Element-specific color coding

### 🎯 **Element Matchups**
- Interactive matchup analysis system
- Favorable and unfavorable element combinations
- Strategic advantage breakdown
- Visual element indicators
- Fixed text overlap for clean display

### 👥 **Team Builder**
- Create custom warrior teams
- Share team compositions
- Analyze team matchups
- Strategic planning interface
- Visual team preview

### 🧩 **Element Quiz**
- Determine your elemental nature
- Interactive question-based system
- Personality-to-element matching
- Detailed result explanations
- Shareable quiz results

### 📖 **Lore Page**
- Rich world-building and backstory
- Elemental history and mythology
- Character origin stories
- Lore tabs for organized reading
- Deep narrative content

---

## 🎨 Design Highlights

### Visual Elements
- **Glassmorphic UI**: Backdrop filters with blur effects for modern aesthetics
- **Gradient Overlays**: Element-specific color themes (Fire/Wind/Shadow)
- **CSS Animations**: Smooth transitions, hover effects, and pulse animations
- **PNG Integrations**: Atmospheric background overlays (flamefog, windfog, shadowfog)
- **Responsive Design**: Mobile-first approach with breakpoints for all device sizes

### Color Scheme
- **Primary (Flame)**: `#ff6347` - Tomato red for fire element
- **Secondary (Wind)**: `#4db8ff` - Sky blue for wind element  
- **Tertiary (Shadow)**: `#8b4789` - Deep purple for shadow element

### Typography
- **Headings**: Orbitron font for futuristic sci-fi aesthetic
- **Body**: Poppins font for readability and modern feel
- **Elements**: Custom text shadows and glow effects

---

## 📁 Project Structure

```
Edgeblade/
├── index.html                 # Main landing page
├── pages/
│   ├── stats.html            # Character rankings & filtering
│   ├── gallery.html          # Character artwork & lightbox
│   ├── abilities.html        # Ability descriptions
│   ├── matchups.html         # Element matchup analysis
│   ├── quiz.html             # Element personality quiz
│   ├── team-builder.html     # Team composition tool
│   └── lore.html             # World lore & backstory
├── js/
│   ├── menu.js               # Navigation menu functionality
│   ├── gallery-lightbox.js   # Gallery filtering & lightbox modal
│   ├── characters.js         # Character data & utilities
│   ├── team-builder.js       # Team builder logic
│   ├── quiz.js               # Quiz system functionality
│   ├── lore.js               # Lore page interactions
│   ├── lenis.js              # Smooth scrolling library
│   └── utils.js              # Utility functions
├── style.css                 # Main stylesheet (6500+ lines)
├── main.js                   # Global initialization
├── assets/
│   ├── backgrounds/
│   │   ├── flamefog.png      # Flame element background overlay
│   │   ├── windfog.png       # Wind element background overlay
│   │   └── shadowfog.png     # Shadow element background overlay
│   └── characters/
│       ├── flame.jpeg        # Flame character image
│       ├── wind.jpeg         # Wind character image
│       ├── shadow.jpeg       # Shadow character image
│       ├── flaming_knight.glb  # 3D flame character model
│       ├── wind_knight.glb     # 3D wind character model
│       └── shadow_knight.glb   # 3D shadow character model
└── README.md                 # This file
```

---

## 🚀 Recent Enhancements

### Latest Features Added ✅
- **Rankings Page Elements**: 
  - Element filter buttons (ALL WARRIORS, 🔥 FLAME, 🌪️ WIND, 🌑 SHADOW)
  - Pulsing element badges on character cards
  - Power level meters with animated bars
  - PNG background overlays for visual depth
  - Smooth filtering animations (300ms transitions)

- **Gallery Page Features**:
  - Gallery filter system by element type
  - Interactive lightbox modal for fullscreen viewing
  - Element indicator badges in gallery item corners
  - PNG background overlays on image containers
  - Hover overlays showing "Click to view fullscreen"
  - Keyboard support (Escape to close)

- **Pure JavaScript Implementation**:
  - Created `js/gallery-lightbox.js` (200+ lines)
  - Gallery filter functionality with smooth animations
  - Ranking page element filters
  - Lightbox modal with multiple close methods
  - Fully responsive and accessible

- **CSS Styling Enhancements**:
  - 500+ lines of new premium CSS
  - Element badge animations (pulsing effect)
  - Power meter gradient styling with glow
  - Gallery filter buttons with active states
  - Lightbox modal with glassmorphic design
  - Fixed matchups page text overlap issues

---

## 🛠️ Technologies Used

### Frontend Stack
- **HTML5**: Semantic markup and accessibility
- **CSS3**: Advanced features including:
  - CSS Grid & Flexbox layouts
  - Backdrop filters for glassmorphic effects
  - CSS custom properties (CSS variables)
  - @keyframe animations
  - Linear & radial gradients
  - Transform and transition effects

- **Vanilla JavaScript**: No frameworks, pure ES6+
  - Event listeners and DOM manipulation
  - Data attributes for semantic filtering
  - Smooth animation timing
  - Keyboard event handling

### Performance Features
- Optimized responsive design
- CSS-only animations (GPU accelerated)
- Efficient event delegation
- Minimal JavaScript footprint

---

## 📱 Responsive Breakpoints

| Screen Size | Breakpoint | Grid | Features |
|------------|-----------|------|----------|
| Desktop   | 1200px+   | Multi-column | Full experience |
| Tablet    | 768px-1199px | 2 columns  | Adjusted spacing |
| Mobile    | 480px-767px | 1 column | Stacked layout |
| Small Mobile | <480px | 1 column | Minimal padding |

---

## 🎓 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local or remote web server

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DOMINICLUCKY/Edgeblade.git
   cd Edgeblade
   ```

2. **Start a local web server**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js
   npx http-server
   
   # PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

---

## 🎮 How to Use

### Rankings Page
1. Navigate to **RANKINGS** from menu
2. Click element filter buttons (🔥 FLAME, 🌪️ WIND, 🌑 SHADOW)
3. View character cards with power levels
4. See pulsing element badges for quick identification
5. Check power meters for total stats

### Gallery Page
1. Navigate to **GALLERY** from menu
2. Use filter buttons to sort by element
3. Hover over images to see overlay
4. Click any image to open fullscreen lightbox
5. Close with × button, Escape key, or click outside

### Team Builder
1. Go to **TEAM BUILDER**
2. Select warriors for your team
3. View team matchup analysis
4. Share your team composition
5. Reset and create new teams

### Element Quiz
1. Navigate to **ELEMENT QUIZ**
2. Answer personality questions
3. Get your elemental assignment
4. View detailed result description
5. Share your result

### Lore Exploration
1. Visit **LORE** section
2. Switch between lore tabs
3. Discover world history
4. Learn character backgrounds
5. Explore elemental mythology

---

## 🎨 Customization

### Changing Element Colors
Edit CSS custom properties in `style.css`:
```css
:root {
  --primary-color: #ff6347;    /* Flame color */
  --secondary-color: #4db8ff;  /* Wind color */
  --tertiary-color: #8b4789;   /* Shadow color */
  --text-primary: #e0e0e0;
  --text-secondary: #a0a0a0;
}
```

### Modifying Background Overlays
Replace PNG files in `assets/backgrounds/`:
- `flamefog.png` - Flame element atmosphere
- `windfog.png` - Wind element atmosphere
- `shadowfog.png` - Shadow element atmosphere

### Adjusting Animations
Animation settings in `style.css`:
```css
@keyframes powerPulse {
  0% { box-shadow: inset 0 0 15px rgba(60, 220, 180, 0.5); }
  50% { box-shadow: inset 0 0 25px rgba(60, 220, 180, 0.8); }
  100% { box-shadow: inset 0 0 15px rgba(60, 220, 180, 0.5); }
}
```

---

## 🔧 Troubleshooting

### Text Overlapping on Matchups Page
✅ **FIXED**: Adjusted flex layout and font sizing for proper text wrapping

### Lightbox Not Opening
- Ensure JavaScript is enabled
- Check browser console for errors
- Verify image paths in HTML

### Gallery Filters Not Working  
- Check that `js/gallery-lightbox.js` is properly linked
- Verify `data-filter` attributes in HTML
- Check for JavaScript console errors

### Mobile Layout Issues
- Clear browser cache (Ctrl+F5)
- Test on actual device or responsive mode
- Check CSS media queries

---

## 📊 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 90+     | ✅ Fully supported |
| Firefox | 88+     | ✅ Fully supported |
| Safari  | 14+     | ✅ Fully supported |
| Edge    | 90+     | ✅ Fully supported |
| Mobile Safari | 14+ | ✅ Fully supported |
| Chrome Mobile | 90+ | ✅ Fully supported |

---

## 📝 File Size Analysis

| File | Size | Lines | Purpose |
|------|------|-------|---------|
| style.css | ~250KB | 6500+ | Complete styling |
| main.js | ~8KB | 200+ | Global init |
| gallery-lightbox.js | ~12KB | 200+ | Gallery & filters |
| characters.js | ~15KB | 300+ | Character data |
| team-builder.js | ~20KB | 400+ | Team logic |
| Total Assets | ~5MB | - | Images & models |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🙏 Credits

**Developer**: EDGEBLADE Team
**Design**: Premium glassmorphic UI
**Assets**: Original artwork and 3D models
**Libraries**: Lenis.js (smooth scrolling)

---

## 📞 Contact & Support

For issues, suggestions, or questions:
- 🐛 Create an issue on GitHub
- 💬 Submit feature requests
- 🤝 Contribute to improvements

---

## 🌟 Special Features

### Performance Optimizations
✅ CSS-only animations (GPU accelerated)
✅ Lazy-loaded image assets
✅ Lightweight vanilla JavaScript
✅ Responsive design with minimal reflow
✅ Efficient event delegation

### Accessibility
✅ Semantic HTML structure
✅ Keyboard navigation support
✅ Color contrast compliance
✅ Screen reader friendly
✅ ARIA labels where needed

### SEO Optimization
✅ Meta tags and descriptions
✅ Proper heading hierarchy
✅ Semantic markup
✅ Fast page load times
✅ Mobile-friendly design

---

## 🎯 Future Roadmap

- [ ] Dark/Light theme toggle
- [ ] Multiplayer battle system
- [ ] Leaderboard rankings
- [ ] Achievement system
- [ ] Sound effects & music
- [ ] Multilingual support
- [ ] Progressive Web App (PWA)
- [ ] Backend API integration

---

## 📊 Statistics

- **Total Pages**: 7+ interactive pages
- **Characters**: 3 elemental warriors
- **Abilities**: 15+ unique abilities
- **CSS Lines**: 6500+ (premium styling)
- **JavaScript Lines**: 1000+ (interactive features)
- **Responsive Breakpoints**: 4 custom breakpoints
- **Color Scheme**: 3 elemental color themes
- **Animation Types**: 20+ keyframe animations

---

**Last Updated**: April 2, 2026

⭐ **If you love EDGEBLADE, please give it a star!** ⭐

