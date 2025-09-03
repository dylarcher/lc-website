class BridgePortfolio extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["columns", "gap", "hover-effect", "masonry"];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.setupAnimations();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  get columns() {
    return this.getAttribute("columns") || "3";
  }

  get gap() {
    return this.getAttribute("gap") || "0";
  }

  get hoverEffect() {
    return this.getAttribute("hover-effect") || "overlay";
  }

  get masonry() {
    return this.hasAttribute("masonry");
  }

  setupEventListeners() {
    this.shadowRoot.addEventListener("click", (e) => {
      const portfolioItem = e.target.closest(".portfolio-item");
      if (portfolioItem) {
        const index = Array.from(
          this.shadowRoot.querySelectorAll(".portfolio-item")
        ).indexOf(portfolioItem);

        this.dispatchEvent(
          new CustomEvent("portfolio-item-click", {
            bubbles: true,
            detail: {
              index,
              item: portfolioItem,
              originalEvent: e,
            },
          })
        );
      }
    });
  }

  setupAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe items after render
    setTimeout(() => {
      this.shadowRoot.querySelectorAll(".portfolio-item").forEach((item) => {
        observer.observe(item);
      });
    }, 100);
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

      .portfolio-container {
        width: 100%;
      }

      .portfolio-grid {
        display: ${this.masonry ? "block" : "grid"};
        ${
          !this.masonry
            ? `grid-template-columns: repeat(${this.columns}, 1fr);`
            : `column-count: ${this.columns};`
        }
        gap: ${this.gap};
        ${this.masonry ? `column-gap: ${this.gap};` : ""}
      }

      .portfolio-item {
        position: relative;
        overflow: hidden;
        cursor: pointer;
        ${
          !this.masonry
            ? "aspect-ratio: 1;"
            : "break-inside: avoid; margin-bottom: " + this.gap + ";"
        }
        opacity: 0;
        transform: translateY(20px);
        transition: var(--transition-base, all 0.3s cubic-bezier(0.4, 0, 0.2, 1));
        border-radius: 8px;
      }

      .portfolio-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
        display: block;
      }

      /* Hover Effects */
      .portfolio-item.overlay .portfolio-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        color: white;
        text-align: center;
        padding: 20px;
      }

      .portfolio-item.overlay:hover .portfolio-overlay {
        opacity: 1;
      }

      .portfolio-item.overlay:hover img {
        transform: scale(1.1);
      }

      .portfolio-item.zoom:hover img {
        transform: scale(1.1);
      }

      .portfolio-item.fade:hover {
        opacity: 0.8;
      }

      .portfolio-item.lift:hover {
        transform: translateY(-10px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      }

      .portfolio-title {
        font-size: 24px;
        margin-bottom: 10px;
        transform: translateY(20px);
        transition: transform 0.3s ease;
        font-family: var(--font-primary, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif);
        font-weight: 600;
      }

      .portfolio-category {
        font-size: 14px;
        color: var(--primary-color, #1abc9c);
        transform: translateY(20px);
        transition: transform 0.3s ease 0.1s;
        font-family: var(--font-primary, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif);
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .portfolio-item:hover .portfolio-title,
      .portfolio-item:hover .portfolio-category {
        transform: translateY(0);
      }

      .portfolio-description {
        font-size: 14px;
        margin-top: 15px;
        opacity: 0.9;
        line-height: 1.4;
      }

      /* Focus styles for accessibility */
      .portfolio-item:focus {
        outline: 2px solid var(--primary-color, #1abc9c);
        outline-offset: 4px;
      }

      /* Alternative layout for bottom info */
      .portfolio-item.info-bottom {
        background: white;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      }

      .portfolio-item.info-bottom .portfolio-info {
        padding: 20px;
        color: var(--text-dark, #333333);
      }

      .portfolio-item.info-bottom .portfolio-title {
        color: var(--text-dark, #333333);
        font-size: 20px;
        margin-bottom: 8px;
        transform: none;
      }

      .portfolio-item.info-bottom .portfolio-category {
        transform: none;
        color: var(--text-light, #777777);
      }

      /* Responsive design */
      @media (max-width: 1024px) {
        .portfolio-grid {
          ${
            !this.masonry
              ? `grid-template-columns: repeat(${Math.min(
                  parseInt(this.columns),
                  2
                )}, 1fr);`
              : `column-count: ${Math.min(parseInt(this.columns), 2)};`
          }
        }
      }

      @media (max-width: 768px) {
        .portfolio-grid {
          ${!this.masonry ? "grid-template-columns: 1fr;" : "column-count: 1;"}
        }

        .portfolio-title {
          font-size: 20px;
        }

        .portfolio-category {
          font-size: 12px;
        }
      }
    `;
  }

  getTemplate() {
    const hoverEffect = this.hoverEffect;

    return `
      <div class="portfolio-container">
        <div class="portfolio-grid">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

class BridgePortfolioItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return [
      "image",
      "title",
      "category",
      "description",
      "hover-effect",
      "layout",
    ];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  get image() {
    return this.getAttribute("image") || "";
  }

  get title() {
    return this.getAttribute("title") || "";
  }

  get category() {
    return this.getAttribute("category") || "";
  }

  get description() {
    return this.getAttribute("description") || "";
  }

  get hoverEffect() {
    return this.getAttribute("hover-effect") || "overlay";
  }

  get layout() {
    return this.getAttribute("layout") || "overlay";
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
      }

      .portfolio-item {
        position: relative;
        overflow: hidden;
        cursor: pointer;
        transition: var(--transition-base, all 0.3s cubic-bezier(0.4, 0, 0.2, 1));
        border-radius: 8px;
        height: 100%;
      }

      .portfolio-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
        display: block;
      }

      .portfolio-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        color: white;
        text-align: center;
        padding: 20px;
      }

      .portfolio-item:hover .portfolio-overlay {
        opacity: 1;
      }

      .portfolio-item:hover img {
        transform: scale(1.1);
      }

      .portfolio-title {
        font-size: 24px;
        margin-bottom: 10px;
        transform: translateY(20px);
        transition: transform 0.3s ease;
        font-family: var(--font-primary, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif);
        font-weight: 600;
      }

      .portfolio-category {
        font-size: 14px;
        color: var(--primary-color, #1abc9c);
        transform: translateY(20px);
        transition: transform 0.3s ease 0.1s;
        font-family: var(--font-primary, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif);
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .portfolio-item:hover .portfolio-title,
      .portfolio-item:hover .portfolio-category {
        transform: translateY(0);
      }

      .portfolio-description {
        font-size: 14px;
        margin-top: 15px;
        opacity: 0.9;
        line-height: 1.4;
      }

      /* Bottom info layout */
      .portfolio-item.info-bottom {
        background: white;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        display: flex;
        flex-direction: column;
      }

      .portfolio-item.info-bottom .portfolio-info {
        padding: 20px;
        color: var(--text-dark, #333333);
      }

      .portfolio-item.info-bottom .portfolio-title {
        color: var(--text-dark, #333333);
        font-size: 20px;
        margin-bottom: 8px;
        transform: none;
      }

      .portfolio-item.info-bottom .portfolio-category {
        transform: none;
        color: var(--text-light, #777777);
      }

      .portfolio-item.info-bottom img {
        height: 200px;
        object-fit: cover;
      }
    `;
  }

  getTemplate() {
    const image = this.image;
    const title = this.title;
    const category = this.category;
    const description = this.description;
    const layout = this.layout;

    if (layout === "bottom") {
      return `
        <article class="portfolio-item info-bottom">
          <img src="${image}" alt="${title}" loading="lazy">
          <div class="portfolio-info">
            <h3 class="portfolio-title">${title}</h3>
            <span class="portfolio-category">${category}</span>
            ${
              description
                ? `<p class="portfolio-description">${description}</p>`
                : ""
            }
            <slot></slot>
          </div>
        </article>
      `;
    }

    return `
      <article class="portfolio-item">
        <img src="${image}" alt="${title}" loading="lazy">
        <div class="portfolio-overlay">
          <h3 class="portfolio-title">${title}</h3>
          <span class="portfolio-category">${category}</span>
          ${
            description
              ? `<p class="portfolio-description">${description}</p>`
              : ""
          }
          <slot></slot>
        </div>
      </article>
    `;
  }
}

customElements.define("bridge-portfolio", BridgePortfolio);
customElements.define("bridge-portfolio-item", BridgePortfolioItem);
