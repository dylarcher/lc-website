// Bridge Hero Section Component
// Large hero sections with various layout options

class BridgeHeroSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['variant', 'height', 'background', 'overlay', 'alignment', 'parallax'];
  }

  connectedCallback() {
    this.render();
    this.setupParallax();
    this.setupAnimations();
  }

  attributeChangedCallback() {
    if (this.shadowRoot) {
      this.render();
    }
  }

  setupParallax() {
    if (this.getAttribute('parallax') === 'true') {
      const handleScroll = () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        const background = this.shadowRoot.querySelector('.hero-background');
        if (background) {
          background.style.transform = `translateY(${rate}px)`;
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
    }
  }

  setupAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const content = entry.target.querySelector('.hero-content');
          if (content) {
            content.classList.add('animate-in');
          }
        }
      });
    }, { threshold: 0.2 });

    observer.observe(this);
  }

  render() {
    const variant = this.getAttribute('variant') || 'default';
    const height = this.getAttribute('height') || '100vh';
    const background = this.getAttribute('background') || '';
    const overlay = this.getAttribute('overlay') || 'none';
    const alignment = this.getAttribute('alignment') || 'center';

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
          overflow: hidden;
        }

        .hero-section {
          position: relative;
          min-height: ${height};
          display: flex;
          align-items: ${alignment === 'top' ? 'flex-start' : alignment === 'bottom' ? 'flex-end' : 'center'};
          justify-content: center;
          padding: var(--bridge-spacing-xxl, 8rem) var(--bridge-spacing-md, 2rem);
        }

        .hero-background {
          position: absolute;
          top: -10%;
          left: -10%;
          width: 120%;
          height: 120%;
          background: ${background ? `url("${background}") center/cover` : 'var(--bridge-bg-dark, #1a1a1a)'};
          z-index: 1;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: ${overlayStyles[overlay] || overlayStyles.none};
          z-index: 2;
        }

        .hero-content {
          position: relative;
          z-index: 3;
          text-align: ${alignment === 'left' ? 'left' : alignment === 'right' ? 'right' : 'center'};
          max-width: 1000px;
          width: 100%;
          opacity: 0;
          transform: translateY(50px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hero-content.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        ::slotted(h1) {
          font-size: clamp(2.5rem, 6vw, 5rem);
          font-weight: var(--bridge-font-bold, 700);
          line-height: 1.2;
          margin-bottom: var(--bridge-spacing-md, 2rem);
          color: var(--bridge-text-white, #ffffff);
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        ::slotted(p) {
          font-size: clamp(1.125rem, 3vw, 1.5rem);
          font-weight: var(--bridge-font-light, 300);
          line-height: 1.6;
          margin-bottom: var(--bridge-spacing-lg, 3rem);
          color: rgba(255,255,255,0.9);
        }

        ::slotted(.hero-actions) {
          display: flex;
          gap: var(--bridge-spacing-md, 2rem);
          justify-content: ${alignment === 'left' ? 'flex-start' : alignment === 'right' ? 'flex-end' : 'center'};
          flex-wrap: wrap;
        }

        /* Variant Styles */
        .hero-section.minimal {
          padding: var(--bridge-spacing-xl, 5rem) var(--bridge-spacing-md, 2rem);
          min-height: 60vh;
        }

        .hero-section.split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: var(--bridge-spacing-xxl, 8rem);
          padding: var(--bridge-spacing-xxl, 8rem) var(--bridge-spacing-lg, 3rem);
        }

        .hero-section.video {
          overflow: hidden;
        }

        .hero-video {
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

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-section {
            padding: var(--bridge-spacing-xl, 5rem) var(--bridge-spacing-sm, 1rem);
            min-height: 70vh;
          }

          .hero-section.split {
            grid-template-columns: 1fr;
            gap: var(--bridge-spacing-lg, 3rem);
            text-align: center;
          }

          ::slotted(.hero-actions) {
            flex-direction: column;
            align-items: center;
          }

          ::slotted(h1) {
            font-size: clamp(2rem, 8vw, 3.5rem);
          }

          ::slotted(p) {
            font-size: clamp(1rem, 4vw, 1.25rem);
          }
        }

        /* Scroll Indicator */
        .scroll-indicator {
          position: absolute;
          bottom: var(--bridge-spacing-lg, 3rem);
          left: 50%;
          transform: translateX(-50%);
          color: var(--bridge-text-white, #ffffff);
          opacity: 0.8;
          animation: bounce 2s infinite;
          cursor: pointer;
          z-index: 3;
        }

        .scroll-indicator i {
          font-size: 1.5rem;
        }

        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          40%, 43% {
            transform: translateX(-50%) translateY(-10px);
          }
          70% {
            transform: translateX(-50%) translateY(-5px);
          }
          90% {
            transform: translateX(-50%) translateY(-2px);
          }
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .hero-content {
            transition: opacity 0.3s ease;
            transform: none;
          }
          
          .scroll-indicator {
            animation: none;
          }
        }
      </style>
      
      <section class="hero-section ${variant}">
        ${background && !background.includes('.mp4') ? `
          <div class="hero-background"></div>
        ` : ''}
        
        ${background && background.includes('.mp4') ? `
          <video class="hero-video" autoplay muted loop playsinline>
            <source src="${background}" type="video/mp4">
          </video>
        ` : ''}
        
        <div class="hero-overlay"></div>
        
        <div class="hero-content">
          <slot></slot>
        </div>
        
        <div class="scroll-indicator" onclick="window.scrollTo({top: window.innerHeight, behavior: 'smooth'})">
          <i class="fas fa-chevron-down" aria-hidden="true"></i>
        </div>
      </section>
    `;
  }
}

customElements.define('bridge-hero-section', BridgeHeroSection);