class BridgeHero extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["variant", "background", "overlay", "height", "align"];
  }

  connectedCallback() {
    this.render();
    this.setupAnimations();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  get variant() {
    return this.getAttribute("variant") || "default";
  }

  get background() {
    return this.getAttribute("background") || "";
  }

  get overlay() {
    return this.getAttribute("overlay") || "none";
  }

  get height() {
    return this.getAttribute("height") || "100vh";
  }

  get align() {
    return this.getAttribute("align") || "center";
  }

  setupAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const content = this.shadowRoot.querySelector(".hero-content");
            if (content) {
              content.style.animation = "heroFadeIn 1s ease-out forwards";
            }
            observer.unobserve(this);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(this);
  }

  render() {
    const styles = this.getStyles();
    const template = this.getTemplate();

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      ${template}
    `;
  }

  getStyles() {
    return `
      :host {
        display: block;
        width: 100%;
      }

      .hero {
        position: relative;
        width: 100%;
        height: ${this.height};
        display: flex;
        align-items: ${
          this.align === "top"
            ? "flex-start"
            : this.align === "bottom"
            ? "flex-end"
            : "center"
        };
        justify-content: center;
        overflow: hidden;
        color: white;
        text-align: center;
      }

      .hero-background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        ${this.background ? `background-image: url(${this.background});` : ""}
      }

      .hero-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
      }

      .hero-overlay.dark {
        background: rgba(0, 0, 0, 0.5);
      }

      .hero-overlay.light {
        background: rgba(255, 255, 255, 0.3);
      }

      .hero-overlay.gradient-dark {
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 100%);
      }

      .hero-overlay.gradient-primary {
        background: linear-gradient(135deg, rgba(26, 188, 156, 0.8) 0%, rgba(26, 188, 156, 0.4) 100%);
      }

      .hero-content {
        position: relative;
        z-index: 2;
        max-width: 1200px;
        padding: var(--spacing-lg, 3rem);
        opacity: 0;
        transform: translateY(30px);
      }

      .hero-title {
        font-size: 72px;
        font-weight: 700;
        margin-bottom: 20px;
        font-family: var(--font-display, "Montserrat", sans-serif);
        line-height: 1.1;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      }

      .hero-subtitle {
        font-size: 24px;
        margin-bottom: 40px;
        font-weight: 300;
        font-family: var(--font-primary, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif);
        line-height: 1.4;
        opacity: 0.9;
      }

      .hero-actions {
        display: flex;
        gap: 20px;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 40px;
      }

      /* Variant styles */
      .hero.minimal {
        background: var(--bg-light, #f8f8f8);
        color: var(--text-dark, #333333);
        min-height: 60vh;
      }

      .hero.split {
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: center;
        text-align: left;
        padding: 0;
      }

      .hero.split .hero-content {
        padding: var(--spacing-xl, 5rem);
        max-width: none;
      }

      .hero.centered {
        min-height: 80vh;
        background: linear-gradient(135deg, var(--primary-color, #1abc9c) 0%, var(--secondary-color, #2c3e50) 100%);
      }

      @keyframes heroFadeIn {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Responsive design */
      @media (max-width: 1024px) {
        .hero-title {
          font-size: 56px;
        }

        .hero-subtitle {
          font-size: 20px;
        }

        .hero.split {
          grid-template-columns: 1fr;
          text-align: center;
        }
      }

      @media (max-width: 768px) {
        .hero {
          height: auto;
          min-height: 60vh;
          padding: var(--spacing-lg, 3rem) 0;
        }

        .hero-content {
          padding: var(--spacing-md, 2rem);
        }

        .hero-title {
          font-size: 40px;
          margin-bottom: 15px;
        }

        .hero-subtitle {
          font-size: 18px;
          margin-bottom: 30px;
        }

        .hero-actions {
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }
      }
    `;
  }

  getTemplate() {
    const variant = this.variant;
    const overlay = this.overlay;

    return `
      <section class="hero ${variant}" role="banner">
        ${this.background ? '<div class="hero-background"></div>' : ""}
        ${
          overlay !== "none"
            ? `<div class="hero-overlay ${overlay}"></div>`
            : ""
        }

        <div class="hero-content">
          <slot name="title">
            <h1 class="hero-title">Welcome</h1>
          </slot>

          <slot name="subtitle">
            <p class="hero-subtitle">Your journey starts here</p>
          </slot>

          <div class="hero-actions">
            <slot name="actions"></slot>
          </div>
        </div>

        ${
          variant === "split"
            ? '<div class="hero-media"><slot name="media"></slot></div>'
            : ""
        }
      </section>
    `;
  }
}

customElements.define("bridge-hero", BridgeHero);
