class BridgeCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["variant", "hover-effect", "image", "title"];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  get variant() {
    return this.getAttribute("variant") || "default";
  }

  get hoverEffect() {
    return this.getAttribute("hover-effect") || "lift";
  }

  get image() {
    return this.getAttribute("image") || "";
  }

  get title() {
    return this.getAttribute("title") || "";
  }

  setupEventListeners() {
    this.addEventListener("click", (e) => {
      this.dispatchEvent(
        new CustomEvent("card-click", {
          bubbles: true,
          detail: {
            card: this,
            originalEvent: e,
          },
        })
      );
    });
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

      .card {
        background: var(--bridge-bg-white, #fff);
        border-radius: var(--bridge-radius-card, var(--bridge-radius-xl, 1rem));
        overflow: hidden;
        box-shadow: var(--bridge-shadow-md, 0 4px 6px rgba(0,0,0,0.1));
        transition: var(--bridge-transition-base, all 0.3s ease);
        border: 1px solid transparent;
        height: 100%;
        display: flex;
        flex-direction: column;
        cursor: pointer;
      }

      .card.lift:hover {
        transform: translateY(-10px);
        box-shadow: var(--bridge-shadow-xl, 0 20px 25px rgba(0,0,0,0.15));
      }

      .card.scale:hover {
        transform: scale(1.02);
        box-shadow: var(--bridge-shadow-lg, 0 10px 15px rgba(0,0,0,0.15));
      }

      .card.glow:hover {
        box-shadow: 0 0 20px rgba(26, 188, 156, 0.3);
        border-color: var(--bridge-primary, var(--primary-color, #1abc9c));
      }

      .card.none:hover {
        /* No hover effect */
      }

      .card:focus-within {
        outline: 2px solid var(--bridge-primary, var(--primary-color, #1abc9c));
        outline-offset: 2px;
      }

      .card-image {
        width: 100%;
        height: 200px;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        position: relative;
        overflow: hidden;
      }

      .card-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }

      .card:hover .card-image img {
        transform: scale(1.05);
      }

      .card-content {
        padding: var(--bridge-padding-xl, var(--bridge-spacing-xl, 2rem) var(--bridge-spacing-2xl, 3rem));
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .card-title {
        font-size: var(--bridge-font-size-xl, 1.5rem);
        margin-bottom: var(--bridge-spacing-lg, 1.5rem);
        font-weight: var(--bridge-font-semibold, 600);
        color: var(--bridge-text-dark, #333333);
        font-family: var(--bridge-font-primary, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif);
        line-height: var(--bridge-line-height-tight, 1.2);
      }

      .card-text {
        color: var(--bridge-text-light, #777777);
        line-height: var(--bridge-line-height-base, 1.6);
        font-family: var(--bridge-font-primary, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif);
        flex: 1;
        margin-bottom: var(--bridge-spacing-xl, 2rem);
      }

      .card-actions {
        margin-top: auto;
        padding-top: var(--bridge-spacing-xl, 2rem);
        display: flex;
        gap: var(--bridge-spacing-lg, 1.5rem);
        flex-wrap: wrap;
      }

      /* Variant styles */
      .card.elevated {
        box-shadow: var(--bridge-shadow-lg, 0 8px 16px rgba(0,0,0,0.1));
      }

      .card.outlined {
        box-shadow: none;
        border: 1px solid var(--bridge-border-light, #e5e5e5);
      }

      .card.flat {
        box-shadow: none;
        border-radius: 0;
      }

      .card.minimal {
        box-shadow: none;
        border: none;
        border-radius: var(--bridge-radius-sm, 4px);
        background: var(--bridge-bg-light, #f8f8f8);
      }

      .card.featured {
        border: 2px solid var(--bridge-primary, #1abc9c);
        position: relative;
      }

      .card.featured::before {
        content: 'FEATURED';
        position: absolute;
        top: var(--bridge-spacing-md, 15px);
        right: var(--bridge-spacing-md, 15px);
        background: var(--bridge-primary, #1abc9c);
        color: var(--bridge-text-white, white);
        padding: var(--bridge-spacing-xs, 4px) var(--bridge-spacing-sm, 12px);
        border-radius: var(--bridge-radius-full, 12px);
        font-size: var(--bridge-font-size-xs, 12px);
        font-weight: var(--bridge-font-semibold, 600);
        z-index: 1;
      }

      /* Responsive design */
      @media (max-width: 768px) {
        .card-content {
          padding: var(--bridge-spacing-lg, 1.25rem);
        }

        .card-title {
          font-size: var(--bridge-font-size-lg, 1.25rem);
        }
      }
    `;
  }

  getTemplate() {
    const variant = this.variant;
    const hoverEffect = this.hoverEffect;
    const image = this.image;
    const title = this.title;

    return `
      <article class="card ${variant} ${hoverEffect}" role="article">
        ${
          image
            ? `
          <div class="card-image">
            <img src="${image}" alt="${title}" loading="lazy">
          </div>
        `
            : ""
        }

        <div class="card-content">
          ${title ? `<h3 class="card-title">${title}</h3>` : ""}

          <div class="card-text">
            <slot></slot>
          </div>

          <div class="card-actions">
            <slot name="actions"></slot>
          </div>
        </div>
      </article>
    `;
  }
}

customElements.define("bridge-card", BridgeCard);
