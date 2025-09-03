class BridgeTabs extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.currentTab = 0;
  }

  static get observedAttributes() {
    return ["active-tab"];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.initializeTabs();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "active-tab" && oldValue !== newValue) {
      this.currentTab = parseInt(newValue) || 0;
      this.updateActiveTab();
    }
  }

  get activeTab() {
    return parseInt(this.getAttribute("active-tab")) || 0;
  }

  set activeTab(index) {
    this.setAttribute("active-tab", index.toString());
  }

  initializeTabs() {
    const tabItems = Array.from(this.querySelectorAll("bridge-tab-item"));
    this.currentTab = this.activeTab;
    this.updateActiveTab();
  }

  setupEventListeners() {
    this.shadowRoot.addEventListener("click", (e) => {
      if (e.target.classList.contains("tab")) {
        const tabIndex = parseInt(e.target.dataset.index);
        this.activateTab(tabIndex);
      }
    });

    this.shadowRoot.addEventListener("keydown", (e) => {
      if (e.target.classList.contains("tab")) {
        this.handleKeyboardNavigation(e);
      }
    });
  }

  handleKeyboardNavigation(e) {
    const tabs = Array.from(this.shadowRoot.querySelectorAll(".tab"));
    const currentIndex = tabs.indexOf(e.target);
    let targetIndex;

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        targetIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
        break;
      case "ArrowRight":
        e.preventDefault();
        targetIndex = currentIndex === tabs.length - 1 ? 0 : currentIndex + 1;
        break;
      case "Home":
        e.preventDefault();
        targetIndex = 0;
        break;
      case "End":
        e.preventDefault();
        targetIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    tabs[targetIndex].focus();
    this.activateTab(targetIndex);
  }

  activateTab(index) {
    this.currentTab = index;
    this.activeTab = index;
    this.updateActiveTab();

    this.dispatchEvent(
      new CustomEvent("tab-change", {
        bubbles: true,
        detail: {
          activeIndex: index,
          previousIndex: this.currentTab,
        },
      })
    );
  }

  updateActiveTab() {
    // Update tab buttons
    const tabs = this.shadowRoot.querySelectorAll(".tab");
    tabs.forEach((tab, index) => {
      const isActive = index === this.currentTab;
      tab.setAttribute("aria-selected", isActive.toString());
      tab.classList.toggle("active", isActive);
    });

    // Update tab panels
    const tabItems = Array.from(this.querySelectorAll("bridge-tab-item"));
    tabItems.forEach((item, index) => {
      const isActive = index === this.currentTab;
      item.setAttribute("active", isActive ? "" : null);
    });
  }

  render() {
    const styles = this.getStyles();
    const template = this.getTemplate();

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      ${template}
    `;

    // Populate tabs after render
    this.populateTabHeaders();
  }

  populateTabHeaders() {
    const tabList = this.shadowRoot.querySelector(".tabs");
    const tabItems = Array.from(this.querySelectorAll("bridge-tab-item"));

    tabList.innerHTML = "";
    tabItems.forEach((item, index) => {
      const button = document.createElement("button");
      button.className = "tab";
      button.setAttribute("role", "tab");
      button.setAttribute(
        "aria-selected",
        index === this.currentTab ? "true" : "false"
      );
      button.setAttribute("aria-controls", `tab-panel-${index}`);
      button.setAttribute("id", `tab-${index}`);
      button.dataset.index = index.toString();
      button.textContent = item.getAttribute("title") || `Tab ${index + 1}`;

      if (index === this.currentTab) {
        button.classList.add("active");
      }

      tabList.appendChild(button);
    });
  }

  getStyles() {
    return `
      :host {
        display: block;
      }

      .tabs-container {
        width: 100%;
      }

      .tabs {
        border-bottom: 1px solid var(--bridge-border-light, #e5e5e5);
        display: flex;
        gap: var(--bridge-spacing-2xl, 2rem);
        margin-bottom: var(--bridge-spacing-2xl, 2rem);
      }

      .tab {
        padding: var(--bridge-spacing-md, 1rem) 0;
        color: var(--bridge-text-light, #777777);
        cursor: pointer;
        position: relative;
        transition: var(--bridge-transition-base, all 0.3s cubic-bezier(0.4, 0, 0.2, 1));
        background: none;
        border: none;
        font-size: var(--bridge-font-size-base, 1rem);
        font-family: var(--bridge-font-primary, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif);
        font-weight: var(--bridge-font-medium, 500);
      }

      .tab[aria-selected="true"],
      .tab.active {
        color: var(--bridge-primary, #1abc9c);
      }

      .tab[aria-selected="true"]::after,
      .tab.active::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--bridge-primary, #1abc9c);
      }

      .tab:hover {
        color: var(--bridge-primary, #1abc9c);
      }

      .tab:focus {
        outline: 2px solid var(--bridge-primary, #1abc9c);
        outline-offset: 2px;
      }

      .tab-content {
        font-family: var(--bridge-font-primary, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif);
        line-height: var(--bridge-line-height-base, 1.6);
        color: var(--bridge-text-dark, #333333);
      }
    `;
  }

  getTemplate() {
    return `
      <div class="tabs-container">
        <div role="tablist" class="tabs" aria-label="Tab Navigation"></div>
        <div class="tab-content">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

class BridgeTabItem extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["title", "active"];
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

  get isActive() {
    return this.hasAttribute("active");
  }

  render() {
    this.setAttribute("role", "tabpanel");
    this.style.display = this.isActive ? "block" : "none";

    if (this.isActive) {
      this.style.animation = "fadeIn var(--bridge-transition-base, 0.3s) ease-in-out";
    }
  }
}

customElements.define("bridge-tabs", BridgeTabs);
customElements.define("bridge-tab-item", BridgeTabItem);
