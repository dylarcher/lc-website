// Bridge Slider Component
// Replaces WordPress Revolution Slider functionality

class BridgeSlider extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.currentSlide = 0;
    this.slides = [];
    this.autoplayTimer = null;
    this.isPlaying = false;
  }

  static get observedAttributes() {
    return ['autoplay', 'duration', 'navigation', 'pagination', 'height', 'effect'];
  }

  connectedCallback() {
    this.render();
    this.setupSlider();
    this.setupEventListeners();
    this.startAutoplay();
  }

  disconnectedCallback() {
    this.stopAutoplay();
  }

  attributeChangedCallback() {
    if (this.shadowRoot) {
      this.render();
      this.setupSlider();
    }
  }

  setupSlider() {
    const slotElement = this.shadowRoot.querySelector('slot');
    if (slotElement) {
      const assignedElements = slotElement.assignedElements();
      this.slides = assignedElements.filter(el => el.tagName === 'BRIDGE-SLIDE');
      
      this.slides.forEach((slide, index) => {
        slide.style.display = index === 0 ? 'block' : 'none';
        slide.classList.toggle('active', index === 0);
      });

      this.updatePagination();
      this.updateNavigation();
    }
  }

  setupEventListeners() {
    // Navigation buttons
    const prevBtn = this.shadowRoot.querySelector('.nav-prev');
    const nextBtn = this.shadowRoot.querySelector('.nav-next');
    
    if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());

    // Pagination dots
    const paginationContainer = this.shadowRoot.querySelector('.pagination');
    if (paginationContainer) {
      paginationContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('pagination-dot')) {
          const index = parseInt(e.target.dataset.index);
          this.goToSlide(index);
        }
      });
    }

    // Pause on hover
    this.addEventListener('mouseenter', () => this.pauseAutoplay());
    this.addEventListener('mouseleave', () => this.resumeAutoplay());

    // Keyboard navigation
    this.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prevSlide();
      if (e.key === 'ArrowRight') this.nextSlide();
    });

    // Touch/swipe support
    this.setupTouchEvents();
  }

  setupTouchEvents() {
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;

    this.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    this.addEventListener('touchmove', (e) => {
      currentX = e.touches[0].clientX;
      currentY = e.touches[0].clientY;
    }, { passive: true });

    this.addEventListener('touchend', () => {
      const diffX = startX - currentX;
      const diffY = startY - currentY;

      // Only handle horizontal swipes
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
      }
    }, { passive: true });
  }

  startAutoplay() {
    if (this.getAttribute('autoplay') === 'true' && this.slides.length > 1) {
      const duration = parseInt(this.getAttribute('duration')) || 5000;
      this.isPlaying = true;
      this.autoplayTimer = setInterval(() => {
        this.nextSlide();
      }, duration);
    }
  }

  stopAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
    this.isPlaying = false;
  }

  pauseAutoplay() {
    this.stopAutoplay();
  }

  resumeAutoplay() {
    if (this.getAttribute('autoplay') === 'true') {
      this.startAutoplay();
    }
  }

  nextSlide() {
    this.goToSlide((this.currentSlide + 1) % this.slides.length);
  }

  prevSlide() {
    this.goToSlide(this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1);
  }

  goToSlide(index) {
    if (index < 0 || index >= this.slides.length || index === this.currentSlide) return;

    const effect = this.getAttribute('effect') || 'fade';
    const oldSlide = this.slides[this.currentSlide];
    const newSlide = this.slides[index];

    // Apply transition effect
    this.applyTransition(oldSlide, newSlide, effect);

    this.currentSlide = index;
    this.updatePagination();
    this.updateNavigation();

    // Dispatch change event
    this.dispatchEvent(new CustomEvent('slide-change', {
      detail: { 
        currentSlide: this.currentSlide,
        totalSlides: this.slides.length,
        slide: newSlide
      },
      bubbles: true
    }));
  }

  applyTransition(oldSlide, newSlide, effect) {
    switch (effect) {
      case 'slide':
        this.slideTransition(oldSlide, newSlide);
        break;
      case 'fade':
      default:
        this.fadeTransition(oldSlide, newSlide);
        break;
    }
  }

  fadeTransition(oldSlide, newSlide) {
    newSlide.style.display = 'block';
    newSlide.style.opacity = '0';
    
    // Animate fade
    newSlide.animate([
      { opacity: 0 },
      { opacity: 1 }
    ], {
      duration: 500,
      easing: 'ease-in-out'
    }).onfinish = () => {
      oldSlide.style.display = 'none';
      oldSlide.classList.remove('active');
      newSlide.classList.add('active');
      newSlide.style.opacity = '1';
    };
  }

  slideTransition(oldSlide, newSlide) {
    const direction = this.currentSlide < this.slides.indexOf(newSlide) ? 1 : -1;
    
    newSlide.style.display = 'block';
    newSlide.style.transform = `translateX(${direction * 100}%)`;
    
    // Animate slide
    const animation = newSlide.animate([
      { transform: `translateX(${direction * 100}%)` },
      { transform: 'translateX(0%)' }
    ], {
      duration: 600,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    });

    oldSlide.animate([
      { transform: 'translateX(0%)' },
      { transform: `translateX(${-direction * 100}%)` }
    ], {
      duration: 600,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    });

    animation.onfinish = () => {
      oldSlide.style.display = 'none';
      oldSlide.style.transform = '';
      oldSlide.classList.remove('active');
      newSlide.classList.add('active');
      newSlide.style.transform = '';
    };
  }

  updatePagination() {
    const dots = this.shadowRoot.querySelectorAll('.pagination-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentSlide);
    });
  }

  updateNavigation() {
    const prevBtn = this.shadowRoot.querySelector('.nav-prev');
    const nextBtn = this.shadowRoot.querySelector('.nav-next');
    
    if (prevBtn) prevBtn.style.opacity = this.slides.length > 1 ? '1' : '0.5';
    if (nextBtn) nextBtn.style.opacity = this.slides.length > 1 ? '1' : '0.5';
  }

  render() {
    const height = this.getAttribute('height') || '60vh';
    const navigation = this.getAttribute('navigation') === 'true';
    const pagination = this.getAttribute('pagination') === 'true';
    const effect = this.getAttribute('effect') || 'fade';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          width: 100%;
          height: ${height};
          overflow: hidden;
          border-radius: var(--bridge-radius-lg, 1rem);
          background: var(--bridge-bg-dark, #1a1a1a);
        }

        .slider-container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        ::slotted(bridge-slide) {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: none;
        }

        ::slotted(bridge-slide.active) {
          display: block;
        }

        .navigation {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
        }

        .nav-btn {
          background: rgba(255, 255, 255, 0.9);
          border: none;
          width: 50px;
          height: 50px;
          border-radius: var(--bridge-radius-full, 50%);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--bridge-font-size-xl, 1.2rem);
          color: var(--bridge-text-dark, #333333);
          transition: var(--bridge-transition-base, all 0.3s ease);
          box-shadow: var(--bridge-shadow-md, 0 4px 6px rgba(0,0,0,0.1));
        }

        .nav-btn:hover {
          background: rgba(255, 255, 255, 1);
          transform: scale(1.1);
          box-shadow: var(--bridge-shadow-lg, 0 10px 15px rgba(0,0,0,0.1));
        }

        .nav-btn:active {
          transform: scale(0.95);
        }

        .nav-prev {
          left: var(--bridge-spacing-md, 2rem);
        }

        .nav-next {
          right: var(--bridge-spacing-md, 2rem);
        }

        .pagination {
          position: absolute;
          bottom: var(--bridge-spacing-md, 2rem);
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: var(--bridge-spacing-xs, 0.5rem);
          z-index: 10;
        }

        .pagination-dot {
          width: 12px;
          height: 12px;
          border-radius: var(--bridge-radius-full, 50%);
          background: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          transition: var(--bridge-transition-base, all 0.3s ease);
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .pagination-dot:hover {
          background: rgba(255, 255, 255, 0.8);
          transform: scale(1.2);
        }

        .pagination-dot.active {
          background: var(--bridge-primary, #1abc9c);
          border-color: var(--bridge-primary, #1abc9c);
          transform: scale(1.3);
        }

        .play-pause {
          position: absolute;
          top: var(--bridge-spacing-md, 2rem);
          right: var(--bridge-spacing-md, 2rem);
          background: rgba(0, 0, 0, 0.5);
          border: none;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: var(--bridge-radius-full, 50%);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--bridge-transition-base, all 0.3s ease);
          z-index: 10;
        }

        .play-pause:hover {
          background: rgba(0, 0, 0, 0.7);
        }

        @media (max-width: 768px) {
          .nav-btn {
            width: 40px;
            height: 40px;
            font-size: var(--bridge-font-size-base, 1rem);
          }

          .nav-prev {
            left: var(--bridge-spacing-sm, 1rem);
          }

          .nav-next {
            right: var(--bridge-spacing-sm, 1rem);
          }

          .pagination {
            bottom: var(--bridge-spacing-sm, 1rem);
          }

          .pagination-dot {
            width: 10px;
            height: 10px;
          }

          .play-pause {
            top: var(--bridge-spacing-sm, 1rem);
            right: var(--bridge-spacing-sm, 1rem);
            width: 35px;
            height: 35px;
          }
        }

        @media (max-width: 480px) {
          :host {
            height: 50vh;
          }
        }
      </style>
      
      <div class="slider-container">
        <slot></slot>
        
        ${navigation ? `
          <div class="navigation">
            <button class="nav-btn nav-prev" aria-label="Previous slide">
              <i class="fas fa-chevron-left"></i>
            </button>
            <button class="nav-btn nav-next" aria-label="Next slide">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        ` : ''}
        
        ${pagination ? `
          <div class="pagination" role="tablist">
            ${Array.from({ length: this.children.length }, (_, i) => 
              `<button class="pagination-dot ${i === 0 ? 'active' : ''}" 
                       data-index="${i}" 
                       role="tab" 
                       aria-label="Go to slide ${i + 1}"></button>`
            ).join('')}
          </div>
        ` : ''}
        
        ${this.getAttribute('autoplay') === 'true' ? `
          <button class="play-pause" aria-label="Play/Pause slideshow">
            <i class="fas fa-pause"></i>
          </button>
        ` : ''}
      </div>
    `;

    // Setup play/pause button
    const playPauseBtn = this.shadowRoot.querySelector('.play-pause');
    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', () => {
        if (this.isPlaying) {
          this.stopAutoplay();
          playPauseBtn.querySelector('i').className = 'fas fa-play';
        } else {
          this.startAutoplay();
          playPauseBtn.querySelector('i').className = 'fas fa-pause';
        }
      });
    }
  }
}

// Bridge Slide Component
class BridgeSlide extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['background', 'overlay', 'video-bg'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (this.shadowRoot) {
      this.render();
    }
  }

  render() {
    const background = this.getAttribute('background');
    const overlay = this.getAttribute('overlay') || 'none';
    const videoBg = this.getAttribute('video-bg');

    const overlayStyles = {
      none: 'transparent',
      light: 'rgba(255, 255, 255, 0.3)',
      dark: 'rgba(0, 0, 0, 0.5)',
      gradient: 'linear-gradient(135deg, rgba(26,188,156,0.8), rgba(52,152,219,0.6))',
      'gradient-dark': 'linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.4))'
    };

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .slide-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: ${background ? `url("${background}") center/cover` : 'var(--bridge-bg-dark, #1a1a1a)'};
          z-index: 1;
        }

        .slide-video {
          position: absolute;
          top: 50%;
          left: 50%;
          min-width: 100%;
          min-height: 100%;
          width: auto;
          height: auto;
          transform: translateX(-50%) translateY(-50%);
          z-index: 1;
        }

        .slide-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: ${overlayStyles[overlay] || overlayStyles.none};
          z-index: 2;
        }

        .slide-content {
          position: relative;
          z-index: 3;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        ::slotted([slot="content"]) {
          text-align: center;
          color: white;
          max-width: 800px;
          padding: 0 var(--bridge-spacing-md, 2rem);
        }

        @media (max-width: 768px) {
          ::slotted([slot="content"]) {
            padding: 0 var(--bridge-spacing-sm, 1rem);
          }
        }
      </style>
      
      ${videoBg ? `
        <video class="slide-video" autoplay muted loop playsinline>
          <source src="${videoBg}" type="video/mp4">
        </video>
      ` : `
        <div class="slide-background"></div>
      `}
      
      <div class="slide-overlay"></div>
      
      <div class="slide-content">
        <slot name="content"></slot>
      </div>
    `;
  }
}

// Register components
customElements.define('bridge-slider', BridgeSlider);
customElements.define('bridge-slide', BridgeSlide);