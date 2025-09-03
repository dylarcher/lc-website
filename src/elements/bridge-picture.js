class BridgePicture extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return [
      'src', 
      'alt', 
      'sizes', 
      'srcset', 
      'loading', 
      'width', 
      'height',
      'object-fit',
      'object-position',
      'aspect-ratio'
    ];
  }

  connectedCallback() {
    this.render();
    this.setupLazyLoading();
  }

  attributeChangedCallback() {
    if (this.shadowRoot) {
      this.render();
    }
  }

  get src() {
    return this.getAttribute('src') || '';
  }

  get alt() {
    return this.getAttribute('alt') || '';
  }

  get sizes() {
    return this.getAttribute('sizes') || '100vw';
  }

  get srcset() {
    return this.getAttribute('srcset') || '';
  }

  get loading() {
    return this.getAttribute('loading') || 'lazy';
  }

  get width() {
    return this.getAttribute('width');
  }

  get height() {
    return this.getAttribute('height');
  }

  get objectFit() {
    return this.getAttribute('object-fit') || 'cover';
  }

  get objectPosition() {
    return this.getAttribute('object-position') || 'center';
  }

  get aspectRatio() {
    return this.getAttribute('aspect-ratio') || '';
  }

  setupLazyLoading() {
    if (this.loading === 'lazy' && 'IntersectionObserver' in window) {
      const img = this.shadowRoot.querySelector('img');
      if (img && img.dataset.src) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              img.src = img.dataset.src;
              if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
              }
              img.removeAttribute('data-src');
              img.removeAttribute('data-srcset');
              observer.unobserve(entry.target);
            }
          });
        }, {
          rootMargin: '50px 0px',
          threshold: 0.01
        });

        observer.observe(img);
      }
    }
  }

  handleImageLoad() {
    this.dispatchEvent(new CustomEvent('bridge-picture-load', {
      bubbles: true,
      detail: { element: this }
    }));
  }

  handleImageError() {
    const img = this.shadowRoot.querySelector('img');
    if (img && !img.getAttribute('data-error-handled')) {
      img.setAttribute('data-error-handled', 'true');
      
      // Try fallback source if available
      const fallback = this.getAttribute('fallback-src');
      if (fallback && img.src !== fallback) {
        img.src = fallback;
        return;
      }

      // Show placeholder
      img.style.display = 'none';
      const placeholder = this.shadowRoot.querySelector('.placeholder');
      if (placeholder) {
        placeholder.style.display = 'flex';
      }

      this.dispatchEvent(new CustomEvent('bridge-picture-error', {
        bubbles: true,
        detail: { element: this, src: img.src }
      }));
    }
  }

  render() {
    const useLazyLoading = this.loading === 'lazy';
    const srcAttr = useLazyLoading ? 'data-src' : 'src';
    const srcsetAttr = useLazyLoading ? 'data-srcset' : 'srcset';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          overflow: hidden;
          background: var(--bg-light, #f8f8f8);
        }

        picture {
          display: block;
          width: 100%;
          height: 100%;
        }

        img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: ${this.objectFit};
          object-position: ${this.objectPosition};
          ${this.aspectRatio ? `aspect-ratio: ${this.aspectRatio};` : ''}
          transition: opacity 0.3s ease, filter 0.3s ease;
        }

        img[data-src] {
          opacity: 0;
          filter: blur(5px);
        }

        img:not([data-src]) {
          opacity: 1;
          filter: none;
        }

        .placeholder {
          display: none;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--border-color, #e5e5e5);
          align-items: center;
          justify-content: center;
          color: var(--text-light, #777);
          font-size: 2rem;
        }

        .loading {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          border: 3px solid var(--border-color, #e5e5e5);
          border-top: 3px solid var(--primary-color, #1abc9c);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          display: ${useLazyLoading ? 'block' : 'none'};
        }

        @keyframes spin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }

        /* Responsive behavior */
        :host([responsive]) img {
          max-width: 100%;
          height: auto;
        }

        /* Border radius support */
        :host([rounded]) {
          border-radius: var(--border-radius, 8px);
        }

        :host([rounded]) img {
          border-radius: inherit;
        }

        /* Shadow support */
        :host([shadow]) {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        /* Hover effects */
        :host([hover-zoom]) img {
          transition: transform 0.3s ease, opacity 0.3s ease, filter 0.3s ease;
        }

        :host([hover-zoom]:hover) img {
          transform: scale(1.05);
        }

        :host([hover-fade]:hover) img {
          opacity: 0.8;
        }
      </style>

      <picture>
        ${this.srcset ? `
          <source 
            ${srcsetAttr}="${this.srcset}" 
            sizes="${this.sizes}"
            ${this.getAttribute('media') ? `media="${this.getAttribute('media')}"` : ''}
          >
        ` : ''}
        <img
          ${srcAttr}="${this.src}"
          alt="${this.alt}"
          ${this.width ? `width="${this.width}"` : ''}
          ${this.height ? `height="${this.height}"` : ''}
          ${!useLazyLoading ? `loading="${this.loading}"` : ''}
          @load="${() => this.handleImageLoad()}"
          @error="${() => this.handleImageError()}"
        >
      </picture>

      <div class="loading"></div>
      <div class="placeholder">
        📷
      </div>
    `;

    // Add event listeners
    const img = this.shadowRoot.querySelector('img');
    if (img) {
      img.addEventListener('load', () => this.handleImageLoad());
      img.addEventListener('error', () => this.handleImageError());
    }
  }
}

customElements.define("bridge-picture", BridgePicture);