// Bridge Image Element
// Enhanced image component with lazy loading and animations

class BridgeImage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isLoaded = false;
    this.observer = null;
  }

  static get observedAttributes() {
    return ['src', 'alt', 'lazy', 'animation', 'width', 'height', 'object-fit', 'border-radius'];
  }

  connectedCallback() {
    this.render();
    this.setupLazyLoading();
    this.setupEventListeners();
  }

  disconnectedCallback() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  attributeChangedCallback() {
    if (this.shadowRoot) {
      this.render();
    }
  }

  setupLazyLoading() {
    const lazy = this.getAttribute('lazy') === 'true';
    if (!lazy) {
      this.loadImage();
      return;
    }

    // Use Intersection Observer for lazy loading
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.isLoaded) {
          this.loadImage();
          this.observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.1
    });

    this.observer.observe(this);
  }

  setupEventListeners() {
    const img = this.shadowRoot.querySelector('img');
    if (img) {
      img.addEventListener('load', () => {
        this.handleImageLoad();
      });

      img.addEventListener('error', () => {
        this.handleImageError();
      });
    }
  }

  loadImage() {
    if (this.isLoaded) return;

    const img = this.shadowRoot.querySelector('img');
    const src = this.getAttribute('src');
    
    if (img && src) {
      img.src = src;
      this.isLoaded = true;
    }
  }

  handleImageLoad() {
    const container = this.shadowRoot.querySelector('.image-container');
    const img = this.shadowRoot.querySelector('img');
    const placeholder = this.shadowRoot.querySelector('.placeholder');
    
    if (container) {
      container.classList.add('loaded');
    }
    
    if (img) {
      img.classList.add('loaded');
      
      // Apply animation if specified
      const animation = this.getAttribute('animation');
      if (animation) {
        img.classList.add(animation);
      }
    }
    
    if (placeholder) {
      placeholder.style.display = 'none';
    }

    // Dispatch load event
    this.dispatchEvent(new CustomEvent('image-load', {
      detail: { src: this.getAttribute('src') },
      bubbles: true
    }));
  }

  handleImageError() {
    const container = this.shadowRoot.querySelector('.image-container');
    const errorDiv = this.shadowRoot.querySelector('.error-placeholder');
    
    if (container) {
      container.classList.add('error');
    }
    
    if (errorDiv) {
      errorDiv.style.display = 'flex';
    }

    // Dispatch error event
    this.dispatchEvent(new CustomEvent('image-error', {
      detail: { src: this.getAttribute('src') },
      bubbles: true
    }));
  }

  render() {
    const src = this.getAttribute('src') || '';
    const alt = this.getAttribute('alt') || '';
    const width = this.getAttribute('width') || 'auto';
    const height = this.getAttribute('height') || 'auto';
    const objectFit = this.getAttribute('object-fit') || 'cover';
    const borderRadius = this.getAttribute('border-radius') || '0';
    const lazy = this.getAttribute('lazy') === 'true';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          overflow: hidden;
        }

        .image-container {
          position: relative;
          width: 100%;
          height: 100%;
          background: var(--bridge-bg-light, #f8f8f8);
          border-radius: ${borderRadius};
          overflow: hidden;
        }

        img {
          width: ${width};
          height: ${height};
          object-fit: ${objectFit};
          transition: var(--bridge-transition-base, all 0.3s ease);
          opacity: 0;
          transform: scale(1.05);
        }

        img.loaded {
          opacity: 1;
          transform: scale(1);
        }

        .placeholder {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bridge-bg-light, #f8f8f8);
          color: var(--bridge-text-muted, #999999);
          font-size: 0.875rem;
        }

        .placeholder::after {
          content: '';
          width: 40px;
          height: 40px;
          border: 2px solid var(--bridge-border-light, #e5e5e5);
          border-top-color: var(--bridge-primary, #1abc9c);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .error-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: none;
          align-items: center;
          justify-content: center;
          background: var(--bridge-bg-light, #f8f8f8);
          color: var(--bridge-text-muted, #999999);
          font-size: 0.875rem;
          flex-direction: column;
          gap: var(--bridge-spacing-sm, 1rem);
        }

        .error-icon {
          font-size: 2rem;
          color: var(--bridge-accent, #e74c3c);
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Animation classes */
        .fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .slide-up {
          animation: slideUp 0.6s ease-out forwards;
        }

        .zoom-in {
          animation: zoomIn 0.6s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(1);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Hover effects */
        :host(:hover) img.loaded {
          transform: scale(1.05);
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          img, .image-container {
            transition: none !important;
            animation: none !important;
          }
          
          :host(:hover) img.loaded {
            transform: none;
          }
        }
      </style>
      
      <div class="image-container">
        <img 
          ${lazy ? '' : `src="${src}"`}
          alt="${alt}"
          loading="${lazy ? 'lazy' : 'eager'}"
        />
        
        ${lazy ? `
          <div class="placeholder" aria-label="Loading image..."></div>
        ` : ''}
        
        <div class="error-placeholder">
          <i class="fas fa-image error-icon" aria-hidden="true"></i>
          <span>Failed to load image</span>
        </div>
      </div>
    `;

    this.setupEventListeners();
  }
}

customElements.define('bridge-image', BridgeImage);