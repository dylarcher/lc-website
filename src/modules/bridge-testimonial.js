class BridgeTestimonial extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["author", "position", "company", "avatar", "variant", "rating"];
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

  get author() {
    return this.getAttribute("author") || "";
  }

  get position() {
    return this.getAttribute("position") || "";
  }

  get company() {
    return this.getAttribute("company") || "";
  }

  get avatar() {
    return this.getAttribute("avatar") || "";
  }

  get variant() {
    return this.getAttribute("variant") || "card";
  }

  get rating() {
    return parseInt(this.getAttribute("rating")) || 0;
  }

  setupAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const testimonial = this.shadowRoot.querySelector(".testimonial");
            if (testimonial) {
              testimonial.style.opacity = "1";
              testimonial.style.transform = "translateY(0)";
            }
            observer.unobserve(this);
          }
        });
      },
      { threshold: 0.3 }
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

      .testimonial {
        opacity: 0;
        transform: translateY(20px);
        transition: var(--transition-base, all 0.3s cubic-bezier(0.4, 0, 0.2, 1));
        font-family: var(--font-primary, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif);
      }

      /* Card variant */
      .testimonial.card {
        text-align: center;
        padding: 40px;
        background: var(--bg-light, #f8f8f8);
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      }

      /* Quote variant */
      .testimonial.quote {
        padding: 40px 0;
        border-left: 4px solid var(--primary-color, #1abc9c);
        padding-left: 40px;
        background: transparent;
      }

      /* Minimal variant */
      .testimonial.minimal {
        text-align: center;
        padding: 20px 0;
        background: transparent;
      }

      /* Bubble variant */
      .testimonial.bubble {
        position: relative;
        padding: 30px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        margin-bottom: 20px;
      }

      .testimonial.bubble::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 10px solid white;
      }

      .testimonial-text {
        font-size: 20px;
        line-height: 1.6;
        font-style: italic;
        margin-bottom: 30px;
        color: var(--text-dark, #333333);
        position: relative;
      }

      .testimonial.quote .testimonial-text {
        font-size: 24px;
        margin-bottom: 20px;
      }

      .testimonial-text::before {
        content: '"';
        font-size: 60px;
        color: var(--primary-color, #1abc9c);
        position: absolute;
        left: -20px;
        top: -10px;
        font-family: Georgia, serif;
        opacity: 0.3;
      }

      .testimonial.minimal .testimonial-text::before,
      .testimonial.quote .testimonial-text::before {
        display: none;
      }

      .testimonial-author {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
      }

      .testimonial.quote .testimonial-author {
        justify-content: flex-start;
      }

      .testimonial-avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid var(--primary-color, #1abc9c);
      }

      .testimonial.minimal .testimonial-avatar {
        width: 50px;
        height: 50px;
        border-width: 2px;
      }

      .testimonial-info h4 {
        margin-bottom: 5px;
        font-size: 18px;
        font-weight: 600;
        color: var(--text-dark, #333333);
      }

      .testimonial-meta {
        font-size: 14px;
        color: var(--text-light, #777777);
        line-height: 1.3;
      }

      .testimonial-rating {
        display: flex;
        justify-content: center;
        gap: 4px;
        margin-bottom: 20px;
      }

      .testimonial.quote .testimonial-rating {
        justify-content: flex-start;
      }

      .star {
        color: #ffd700;
        font-size: 16px;
      }

      .star.empty {
        color: var(--border-color, #e5e5e5);
      }

      /* Responsive design */
      @media (max-width: 768px) {
        .testimonial.card,
        .testimonial.bubble {
          padding: 30px 20px;
        }

        .testimonial.quote {
          padding-left: 20px;
          border-left-width: 3px;
        }

        .testimonial-text {
          font-size: 18px;
          margin-bottom: 25px;
        }

        .testimonial.quote .testimonial-text {
          font-size: 20px;
        }

        .testimonial-author {
          flex-direction: column;
          text-align: center;
        }

        .testimonial.quote .testimonial-author {
          flex-direction: row;
          text-align: left;
        }
      }
    `;
  }

  getTemplate() {
    const author = this.author;
    const position = this.position;
    const company = this.company;
    const avatar = this.avatar;
    const variant = this.variant;
    const rating = this.rating;

    const stars =
      rating > 0
        ? Array.from(
            { length: 5 },
            (_, i) => `<span class="star ${i < rating ? "" : "empty"}">★</span>`
          ).join("")
        : "";

    return `
      <div class="testimonial ${variant}">
        ${rating > 0 ? `<div class="testimonial-rating">${stars}</div>` : ""}

        <blockquote class="testimonial-text">
          <slot></slot>
        </blockquote>

        <div class="testimonial-author">
          ${
            avatar
              ? `<img class="testimonial-avatar" src="${avatar}" alt="${author}" loading="lazy">`
              : ""
          }
          <div class="testimonial-info">
            <h4>${author}</h4>
            <div class="testimonial-meta">
              ${position ? `<div>${position}</div>` : ""}
              ${company ? `<div>${company}</div>` : ""}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("bridge-testimonial", BridgeTestimonial);
