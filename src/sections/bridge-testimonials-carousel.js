// Bridge Testimonials Carousel Component
// Carousel for testimonials with autoplay and navigation

class BridgeTestimonialsCarousel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.currentSlide = 0;
    this.testimonials = [];
    this.autoplayTimer = null;
    this.isPlaying = false;
  }

  static get observedAttributes() {
    return ['autoplay', 'duration', 'dots', 'arrows'];
  }

  connectedCallback() {
    this.render();
    this.setupCarousel();
    this.setupEventListeners();
    this.startAutoplay();
  }

  disconnectedCallback() {
    this.stopAutoplay();
  }

  setupCarousel() {
    const slotElement = this.shadowRoot.querySelector('slot');
    if (slotElement) {
      const assignedElements = slotElement.assignedElements();
      this.testimonials = assignedElements.filter(el => el.tagName === 'BRIDGE-TESTIMONIAL');
      
      this.testimonials.forEach((testimonial, index) => {
        testimonial.style.display = index === 0 ? 'block' : 'none';
        testimonial.classList.toggle('active', index === 0);
      });

      this.updateDots();
      this.updateArrows();
    }
  }

  setupEventListeners() {
    // Arrow navigation
    const prevBtn = this.shadowRoot.querySelector('.carousel-prev');
    const nextBtn = this.shadowRoot.querySelector('.carousel-next');
    
    if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());

    // Dot navigation
    const dotsContainer = this.shadowRoot.querySelector('.carousel-dots');
    if (dotsContainer) {
      dotsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('carousel-dot')) {
          const index = parseInt(e.target.dataset.index);
          this.goToSlide(index);
        }
      });
    }

    // Pause on hover
    this.addEventListener('mouseenter', () => this.pauseAutoplay());
    this.addEventListener('mouseleave', () => this.resumeAutoplay());

    // Touch/swipe support
    this.setupTouchEvents();
  }

  setupTouchEvents() {
    let startX = 0;
    let startY = 0;

    this.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    this.addEventListener('touchend', (e) => {
      if (!startX || !startY) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      
      const diffX = startX - endX;
      const diffY = startY - endY;

      // Only handle horizontal swipes
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
      }

      startX = 0;
      startY = 0;
    }, { passive: true });
  }

  startAutoplay() {
    if (this.getAttribute('autoplay') === 'true' && this.testimonials.length > 1) {
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
    this.goToSlide((this.currentSlide + 1) % this.testimonials.length);
  }

  prevSlide() {
    this.goToSlide(this.currentSlide === 0 ? this.testimonials.length - 1 : this.currentSlide - 1);
  }

  goToSlide(index) {
    if (index < 0 || index >= this.testimonials.length || index === this.currentSlide) return;

    const oldTestimonial = this.testimonials[this.currentSlide];
    const newTestimonial = this.testimonials[index];

    // Fade transition
    this.fadeTransition(oldTestimonial, newTestimonial);

    this.currentSlide = index;
    this.updateDots();
    this.updateArrows();

    // Dispatch change event
    this.dispatchEvent(new CustomEvent('testimonial-change', {
      detail: { 
        currentSlide: this.currentSlide,
        totalSlides: this.testimonials.length,
        testimonial: newTestimonial
      },
      bubbles: true
    }));
  }

  fadeTransition(oldTestimonial, newTestimonial) {
    newTestimonial.style.display = 'block';
    newTestimonial.style.opacity = '0';
    
    newTestimonial.animate([
      { opacity: 0, transform: 'translateY(20px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], {
      duration: 500,
      easing: 'ease-out'
    }).onfinish = () => {
      oldTestimonial.style.display = 'none';
      oldTestimonial.classList.remove('active');
      newTestimonial.classList.add('active');
      newTestimonial.style.opacity = '1';
    };
  }

  updateDots() {
    const dots = this.shadowRoot.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentSlide);
    });
  }

  updateArrows() {
    const prevBtn = this.shadowRoot.querySelector('.carousel-prev');
    const nextBtn = this.shadowRoot.querySelector('.carousel-next');
    
    if (prevBtn && nextBtn) {
      const hasMultipleSlides = this.testimonials.length > 1;
      prevBtn.style.opacity = hasMultipleSlides ? '1' : '0.5';
      nextBtn.style.opacity = hasMultipleSlides ? '1' : '0.5';
      prevBtn.style.pointerEvents = hasMultipleSlides ? 'auto' : 'none';
      nextBtn.style.pointerEvents = hasMultipleSlides ? 'auto' : 'none';
    }
  }

  render() {
    const showDots = this.getAttribute('dots') === 'true';
    const showArrows = this.getAttribute('arrows') === 'true';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          max-width: 800px;
          margin: 0 auto;
        }

        .testimonials-carousel {
          position: relative;
          padding: var(--bridge-spacing-md, 2rem);
        }

        .carousel-content {
          position: relative;
          min-height: 200px;
        }

        ::slotted(bridge-testimonial) {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          opacity: 0;
          transition: opacity 0.5s ease;
        }

        ::slotted(bridge-testimonial.active) {
          opacity: 1;
          position: static;
        }

        .carousel-navigation {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
        }

        .carousel-btn {
          background: rgba(255, 255, 255, 0.9);
          border: none;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          color: var(--bridge-text-dark, #333333);
          transition: var(--bridge-transition-base, all 0.3s ease);
          box-shadow: var(--bridge-shadow-md, 0 4px 6px rgba(0,0,0,0.1));
        }

        .carousel-btn:hover {
          background: var(--bridge-primary, #1abc9c);
          color: var(--bridge-text-white, #ffffff);
          transform: scale(1.1);
        }

        .carousel-prev {
          left: -25px;
        }

        .carousel-next {
          right: -25px;
        }

        .carousel-dots {
          display: flex;
          justify-content: center;
          gap: var(--bridge-spacing-xs, 0.5rem);
          margin-top: var(--bridge-spacing-lg, 3rem);
        }

        .carousel-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--bridge-border-light, #e5e5e5);
          cursor: pointer;
          transition: var(--bridge-transition-base, all 0.3s ease);
          border: none;
        }

        .carousel-dot:hover {
          background: var(--bridge-primary, #1abc9c);
          transform: scale(1.2);
        }

        .carousel-dot.active {
          background: var(--bridge-primary, #1abc9c);
          transform: scale(1.3);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .testimonials-carousel {
            padding: var(--bridge-spacing-sm, 1rem);
          }

          .carousel-btn {
            width: 40px;
            height: 40px;
            font-size: 1rem;
          }

          .carousel-prev {
            left: -20px;
          }

          .carousel-next {
            right: -20px;
          }

          .carousel-dots {
            margin-top: var(--bridge-spacing-md, 2rem);
          }

          .carousel-dot {
            width: 10px;
            height: 10px;
          }
        }

        @media (max-width: 480px) {
          .carousel-prev {
            left: 10px;
          }

          .carousel-next {
            right: 10px;
          }
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          ::slotted(bridge-testimonial) {
            transition: opacity 0.2s ease;
          }
          
          .carousel-btn:hover {
            transform: none;
          }
          
          .carousel-dot:hover,
          .carousel-dot.active {
            transform: none;
          }
        }

        /* Focus Styles */
        .carousel-btn:focus {
          outline: 2px solid var(--bridge-primary, #1abc9c);
          outline-offset: 2px;
        }

        .carousel-dot:focus {
          outline: 2px solid var(--bridge-primary, #1abc9c);
          outline-offset: 2px;
        }
      </style>
      
      <div class="testimonials-carousel">
        <div class="carousel-content">
          <slot></slot>
        </div>
        
        ${showArrows ? `
          <div class="carousel-navigation">
            <button class="carousel-btn carousel-prev" aria-label="Previous testimonial">
              <i class="fas fa-chevron-left" aria-hidden="true"></i>
            </button>
            <button class="carousel-btn carousel-next" aria-label="Next testimonial">
              <i class="fas fa-chevron-right" aria-hidden="true"></i>
            </button>
          </div>
        ` : ''}
        
        ${showDots ? `
          <div class="carousel-dots" role="tablist">
            ${Array.from({ length: this.children.length }, (_, i) => 
              `<button class="carousel-dot ${i === 0 ? 'active' : ''}" 
                       data-index="${i}" 
                       role="tab" 
                       aria-label="View testimonial ${i + 1}"></button>`
            ).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('bridge-testimonials-carousel', BridgeTestimonialsCarousel);