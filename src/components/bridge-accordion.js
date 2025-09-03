class BridgeAccordion extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["allow-multiple", "collapse-siblings", "show-controls"];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    
    // Update control states after initial render
    if (this.showControls) {
      setTimeout(() => this.updateControlStates(), 0);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  get allowMultiple() {
    return this.hasAttribute("allow-multiple");
  }

  get collapseSiblings() {
    return this.hasAttribute("collapse-siblings");
  }

  get showControls() {
    return this.hasAttribute("show-controls");
  }

  get areAllExpanded() {
    const allDetails = this.shadowRoot.querySelectorAll("details");
    return Array.from(allDetails).every(details => details.open);
  }

  get areAllCollapsed() {
    const allDetails = this.shadowRoot.querySelectorAll("details");
    return Array.from(allDetails).every(details => !details.open);
  }

  setupEventListeners() {
    this.shadowRoot.addEventListener("toggle", (e) => {
      // Skip sibling collapse logic if all are expanded and controls are shown
      const skipSiblingCollapse = this.showControls && this.areAllExpanded;
      
      if (
        (!this.allowMultiple || this.collapseSiblings) &&
        !skipSiblingCollapse &&
        e.target.tagName === "DETAILS" &&
        e.target.open
      ) {
        // Close other details elements if allow-multiple is false or collapse-siblings is true
        const allDetails = this.shadowRoot.querySelectorAll("details");
        allDetails.forEach((details) => {
          if (details !== e.target && details.open) {
            details.open = false;
          }
        });
      }

      // Update control states if controls are shown
      if (this.showControls) {
        this.updateControlStates();
      }

      // Dispatch custom event
      this.dispatchEvent(
        new CustomEvent("accordion-toggle", {
          bubbles: true,
          detail: {
            target: e.target,
            open: e.target.open,
            title: e.target.querySelector("summary").textContent,
            allExpanded: this.areAllExpanded,
            allCollapsed: this.areAllCollapsed,
          },
        })
      );
    });

    // Add control event listeners if controls are shown
    if (this.showControls) {
      this.shadowRoot.addEventListener("click", (e) => {
        if (e.target.classList.contains("expand-all-btn")) {
          this.expandAll();
        } else if (e.target.classList.contains("collapse-all-btn")) {
          this.collapseAll();
        }
      });
    }
  }

  expandAll() {
    const allDetails = this.shadowRoot.querySelectorAll("details");
    allDetails.forEach((details) => {
      details.open = true;
    });
    this.updateControlStates();
    
    // Dispatch custom event
    this.dispatchEvent(
      new CustomEvent("accordion-expand-all", {
        bubbles: true,
        detail: { accordion: this }
      })
    );
  }

  collapseAll() {
    const allDetails = this.shadowRoot.querySelectorAll("details");
    allDetails.forEach((details) => {
      details.open = false;
    });
    this.updateControlStates();
    
    // Dispatch custom event
    this.dispatchEvent(
      new CustomEvent("accordion-collapse-all", {
        bubbles: true,
        detail: { accordion: this }
      })
    );
  }

  updateControlStates() {
    const expandBtn = this.shadowRoot.querySelector(".expand-all-btn");
    const collapseBtn = this.shadowRoot.querySelector(".collapse-all-btn");
    
    if (expandBtn && collapseBtn) {
      expandBtn.disabled = this.areAllExpanded;
      collapseBtn.disabled = this.areAllCollapsed;
    }
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

      .controls {
        display: ${this.showControls ? 'flex' : 'none'};
        gap: 0.5rem;
        margin-bottom: 1rem;
        justify-content: flex-end;
        flex-wrap: wrap;
      }

      .expand-all-btn,
      .collapse-all-btn {
        padding: var(--bridge-padding-xs, 0.25rem 0.5rem);
        font-size: 0.875rem;
        font-weight: var(--bridge-font-medium, 500);
        border: 1px solid var(--bridge-border-light, #e5e5e5);
        background: var(--bridge-bg-light, #f8f8f8);
        color: var(--bridge-text-dark, #333);
        border-radius: var(--bridge-radius-button, var(--bridge-radius-md, 0.5rem));
        cursor: pointer;
        transition: var(--bridge-transition-base, all 0.3s ease);
        font-family: var(--bridge-font-primary, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif);
      }

      .expand-all-btn:hover,
      .collapse-all-btn:hover {
        background: var(--bridge-primary, var(--primary-color, #1abc9c));
        color: var(--bridge-text-white, white);
        border-color: var(--bridge-primary, var(--primary-color, #1abc9c));
      }

      .expand-all-btn:disabled,
      .collapse-all-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background: var(--bridge-bg-light, #f8f8f8);
        color: var(--bridge-text-muted, #777);
        border-color: var(--bridge-border-light, #e5e5e5);
      }

      .expand-all-btn:disabled:hover,
      .collapse-all-btn:disabled:hover {
        background: var(--bridge-bg-light, #f8f8f8);
        color: var(--bridge-text-muted, #777);
        border-color: var(--bridge-border-light, #e5e5e5);
      }

      /* Screen reader only content */
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      ::slotted(bridge-accordion-item) {
        margin-bottom: 10px;
      }

      ::slotted(bridge-accordion-item:last-child) {
        margin-bottom: 0;
      }

      details {
        border: 1px solid var(--bridge-border-light, #e5e5e5);
        margin-bottom: var(--bridge-spacing-sm, 0.5rem);
        border-radius: var(--bridge-radius-card, var(--bridge-radius-lg, 0.75rem));
        overflow: hidden;
      }

      details:last-child {
        margin-bottom: 0;
      }

      summary {
        padding: var(--bridge-padding-lg, 1.5rem 2rem);
        background: var(--bridge-bg-light, #f8f8f8);
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: var(--bridge-transition-base, all 0.3s ease);
        list-style: none;
        font-family: var(--bridge-font-primary, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif);
        font-weight: var(--bridge-font-medium, 500);
        position: relative;
        color: var(--bridge-text-dark, #333);
      }

      summary:focus {
        outline: 2px solid var(--bridge-primary, var(--primary-color, #1abc9c));
        outline-offset: -2px;
      }

      summary:focus-visible {
        outline: 2px solid var(--bridge-primary, var(--primary-color, #1abc9c));
        outline-offset: 2px;
      }

      summary::-webkit-details-marker {
        display: none;
      }

      summary:hover {
        background: var(--bridge-bg-section, #f9f9f9);
      }

      summary:focus {
        outline: 2px solid var(--primary-color, #1abc9c);
        outline-offset: -2px;
      }

      summary::after {
        content: '▼';
        transition: transform 0.3s;
        font-size: 12px;
        color: var(--text-light, #777777);
      }

      details[open] summary::after {
        transform: rotate(180deg);
      }

      .accordion-content {
        padding: var(--bridge-padding-lg, 1.5rem 2rem);
        animation: slideDown 0.3s ease-out;
        font-family: var(--bridge-font-primary, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif);
        line-height: var(--bridge-line-height-base, 1.6);
        color: var(--bridge-text-dark, #333333);
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
  }

  getTemplate() {
    const accordionId = `accordion-${Math.random().toString(36).substr(2, 9)}`;
    
    return `
      <div class="accordion-wrapper" role="region" aria-labelledby="${accordionId}-label">
        ${this.getAttribute('label') ? `<h2 id="${accordionId}-label" class="sr-only">${this.getAttribute('label')}</h2>` : ''}
        ${this.showControls ? `
          <div class="controls" role="toolbar" aria-label="Accordion controls">
            <button type="button" 
                    class="expand-all-btn" 
                    ${this.areAllExpanded ? 'disabled' : ''}
                    aria-label="Expand all accordion panels"
                    aria-describedby="${accordionId}-expand-desc">
              Expand All
            </button>
            <button type="button" 
                    class="collapse-all-btn" 
                    ${this.areAllCollapsed ? 'disabled' : ''}
                    aria-label="Collapse all accordion panels"
                    aria-describedby="${accordionId}-collapse-desc">
              Collapse All
            </button>
            <div id="${accordionId}-expand-desc" class="sr-only">Opens all collapsed accordion panels</div>
            <div id="${accordionId}-collapse-desc" class="sr-only">Closes all open accordion panels</div>
          </div>
        ` : ''}
        <div class="accordion-container" role="group" aria-label="Accordion panels">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

class BridgeAccordionItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["title", "open"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  get title() {
    return this.getAttribute("title") || "";
  }

  get isOpen() {
    return this.hasAttribute("open");
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

      details {
        border: 1px solid var(--bridge-border-light, #e5e5e5);
        border-radius: var(--bridge-radius-sm, 4px);
        overflow: hidden;
      }

      summary {
        padding: var(--bridge-spacing-lg, 1.25rem);
        background: var(--bridge-bg-light, #f8f8f8);
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: var(--bridge-transition-base, all 0.3s cubic-bezier(0.4, 0, 0.2, 1));
        list-style: none;
        font-family: var(--bridge-font-primary, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif);
        font-weight: var(--bridge-font-medium, 500);
        color: var(--bridge-text-dark, #333333);
      }

      summary::-webkit-details-marker {
        display: none;
      }

      summary:hover {
        background: var(--bridge-bg-section, #e8e8e8);
      }

      summary:focus {
        outline: 2px solid var(--bridge-primary, #1abc9c);
        outline-offset: -2px;
      }

      summary::after {
        content: '▼';
        transition: var(--bridge-transition-base, transform 0.3s);
        font-size: var(--bridge-font-size-xs, 12px);
        color: var(--bridge-text-light, #777777);
      }

      details[open] summary::after {
        transform: rotate(180deg);
      }

      .accordion-content {
        padding: var(--bridge-padding-lg, 1.5rem 2rem);
        animation: slideDown 0.3s ease-out;
        font-family: var(--bridge-font-primary, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif);
        line-height: var(--bridge-line-height-base, 1.6);
        color: var(--bridge-text-dark, #333333);
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
  }

  getTemplate() {
    const title = this.title;
    const isOpen = this.isOpen;
    const itemId = `accordion-item-${Math.random().toString(36).substr(2, 9)}`;

    return `
      <details ${isOpen ? "open" : ""} role="group">
        <summary role="button" 
                 aria-expanded="${isOpen}" 
                 aria-controls="${itemId}-content"
                 tabindex="0">${title}</summary>
        <div id="${itemId}-content" 
             class="accordion-content" 
             role="region"
             aria-labelledby="${itemId}-summary">
          <slot></slot>
        </div>
      </details>
    `;
  }
}

customElements.define("bridge-accordion", BridgeAccordion);
customElements.define("bridge-accordion-item", BridgeAccordionItem);
