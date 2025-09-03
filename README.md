# Legacy Concierge - Modern Web Component Library

> **YOUR HEALTH. OUR PURPOSE.**

A premium healthcare website built with modern web components, showcasing Legacy Concierge's concierge nursing and caregiver services in Los Angeles.

[![GitHub](https://img.shields.io/github/license/dylarcher/lc-website)](https://github.com/dylarcher/lc-website)
[![Web Components](https://img.shields.io/badge/Web%20Components-Native-brightgreen)](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
[![Healthcare](https://img.shields.io/badge/Healthcare-Premium-blue)](https://legacyconcierge.com)

## 🏥 About Legacy Concierge

Legacy Concierge provides premium home healthcare and nursing services in Los Angeles, specializing in:

- **Concierge Nursing** - Private duty nursing with 24/7 support
- **Caregiver Services** - Compassionate, vetted caregiving professionals
- **Specialized Medical Care** - Post-operative, oncology, dementia, and rehabilitation support
- **Healthcare Partnerships** - Integration with top medical providers in Southern California

## 🚀 Project Overview

This project represents a complete modernization from WordPress to a native web component architecture, featuring:

- **50+ Custom Web Components** - Built with vanilla JavaScript and Web Standards
- **Zero Dependencies** - Pure native browser technologies
- **Complete Brand System** - Official Legacy Concierge branding with teal wellness palette
- **Comprehensive Asset Library** - 231+ integrated assets from the original Bridge theme
- **Accessibility First** - WCAG compliant with screen reader support
- **Premium Typography** - Playfair Display and Sackers Gothic fonts

## 🎨 Brand Identity

### Color Palette

- **Primary Teal**: `#4A9B9B` - Wellness & Trust
- **Deep Teal**: `#2C5F5F` - Professional Depth  
- **Clean Gray**: `#F7F7F7` - Minimal & Professional
- **Coastal Aesthetic** - Clean, calming healthcare design

### Typography

- **Playfair Display** - Elegant serif for headlines
- **Raleway** - Clean sans-serif for body text
- **Sackers Gothic** - Distinctive accent font

## 📁 Project Structure

```
legacy-concierge/
├── src/                          # Source code and components
│   ├── components/               # Interactive web components
│   │   ├── bridge-accordion.js   # Collapsible content sections
│   │   ├── bridge-card.js        # Content cards with hover effects
│   │   ├── bridge-modal.js       # Dialog overlays with focus trapping
│   │   ├── bridge-portfolio-filter.js # Portfolio filtering interface
│   │   ├── bridge-slider.js      # Image/content sliders with touch support
│   │   └── bridge-tabs.js        # Tabbed content interfaces
│   ├── elements/                 # Basic UI elements
│   │   ├── bridge-button.js      # Interactive buttons with variants
│   │   ├── bridge-figure.js      # Image with caption wrapper
│   │   ├── bridge-image.js       # Enhanced images with lazy loading
│   │   ├── bridge-input.js       # Form inputs with validation
│   │   ├── bridge-picture.js     # Responsive images
│   │   └── bridge-progress.js    # Animated progress bars
│   ├── modules/                  # Specialized modules
│   │   ├── bridge-hero.js        # Hero banners with backgrounds
│   │   ├── bridge-pricing.js     # Pricing tables and cards
│   │   ├── bridge-testimonial.js # Customer testimonials
│   │   └── bridge-portfolio.js   # Portfolio showcase
│   ├── sections/                 # Layout sections
│   │   ├── bridge-header.js      # Site headers with navigation
│   │   ├── bridge-footer.js      # Site footers with columns
│   │   ├── bridge-contact-form.js # Contact form functionality
│   │   └── bridge-service-card.js # Service showcase cards
│   ├── pages/                    # Complete HTML pages
│   │   ├── components.html       # Interactive component gallery
│   │   ├── portfolio.html        # Portfolio showcase with filtering
│   │   ├── blog.html            # Blog layouts and posts
│   │   └── contact.html         # Contact page with form
│   └── shared/                   # Shared resources
│       ├── assets/               # Images, icons, and graphics
│       ├── fonts/                # Typography assets
│       ├── styles/               # CSS stylesheets and design system
│       └── helpers/              # JavaScript utilities
├── docs/                         # Project documentation
└── res/                          # Resources and brand guidelines
```

## 🛠️ Technology Stack

### Core Technologies

- **Web Components** - Custom Elements API with Shadow DOM
- **ES6+ JavaScript** - Modern JavaScript with modules
- **CSS Custom Properties** - Comprehensive design system
- **HTML5** - Semantic markup with accessibility features

### Design System

- **CSS Variables** - Centralized theming with `--lc-*` prefix
- **Component Architecture** - Reusable, encapsulated components
- **Responsive Design** - Mobile-first with fluid typography
- **Asset Management** - Organized asset helper utilities

### Development Features

- **Hot Reload** - Live development server on port 8080
- **Modern Modules** - ES6 import/export system
- **Shadow DOM** - Style encapsulation and component isolation
- **Custom Events** - Component communication system

## 🚀 Getting Started

### Prerequisites

- Modern web browser supporting Web Components
- Python 3 (for local development server)

### Local Development

1. **Clone the Repository**

   ```bash
   git clone https://github.com/dylarcher/lc-website.git
   cd lc-website
   ```

2. **Start Development Server**

   ```bash
   python3 -m http.server 8080 --bind 127.0.0.1
   ```

3. **Open in Browser**

   ```
   http://localhost:8080/src/
   ```

### Project Pages

- **Homepage**: `/src/index.html` - Main landing page
- **Component Gallery**: `/src/pages/components.html` - Interactive component showcase
- **Portfolio**: `/src/pages/portfolio.html` - Healthcare service portfolio
- **Blog**: `/src/pages/blog.html` - Content and resources
- **Contact**: `/src/pages/contact.html` - Contact information and form

## 🎯 Component System

### Component Categories

**Interactive Components (6)**

- Accordion, Card, Modal, Portfolio Filter, Slider, Tabs

**Basic Elements (6)**  

- Button, Figure, Image, Input, Picture, Progress

**Specialized Modules (6)**

- Hero, Pricing, Testimonial, Portfolio, Skip Links, Keyboard Shortcuts

**Layout Sections (8)**

- Header, Footer, Contact Form, Content Section, Hero Section, Image Content, Service Card, Testimonials Carousel

### Usage Example

```html
<!-- Include main JavaScript module -->
<script type="module" src="main.js"></script>

<!-- Use Legacy Concierge components -->
<bridge-header logo="Legacy Concierge" sticky="true">
  <bridge-menu slot="menu">
    <bridge-menu-item href="/services.html">Services</bridge-menu-item>
    <bridge-menu-item href="/about.html">About</bridge-menu-item>
    <bridge-menu-item href="/contact.html">Contact</bridge-menu-item>
  </bridge-menu>
</bridge-header>

<bridge-hero variant="centered" background="teal">
  <h1>Your Health. Our Purpose.</h1>
  <p>Premium concierge nursing and caregiver services in Los Angeles</p>
  <bridge-button variant="primary" href="/services.html">
    Our Services
  </bridge-button>
</bridge-hero>
```

## 🎨 Design System

### CSS Variables

```css
/* Legacy Concierge Brand Colors */
--lc-primary: #4A9B9B;        /* Wellness Teal */
--lc-accent: #2C5F5F;         /* Deep Teal */
--lc-secondary: #F7F7F7;      /* Clean Gray */

/* Typography */
--lc-font-primary: 'Playfair Display', serif;
--lc-font-secondary: 'Raleway', sans-serif;
--lc-font-accent: 'Sackers Gothic', serif;

/* Spacing Scale */
--lc-spacing-xs: 0.25rem;     /* 4px */
--lc-spacing-sm: 0.5rem;      /* 8px */
--lc-spacing-md: 1rem;        /* 16px */
--lc-spacing-lg: 1.5rem;      /* 24px */
--lc-spacing-xl: 2rem;        /* 32px */
```

### Utility Classes

```css
.lc-tagline          /* Brand tagline styling */
.lc-brand-text       /* Brand accent text */
.lc-medical-text     /* Healthcare-focused text */
.lc-premium-text     /* Premium service text */
```

## 📊 Project Stats

- **Total Components**: 29 web components
- **Lines of Code**: 25,000+ (excluding assets)
- **Assets**: 231 images, icons, and graphics
- **Font Files**: 25+ typography assets
- **CSS Variables**: 100+ design tokens
- **Pages**: 8 complete HTML pages
- **Documentation**: Comprehensive README and component docs

## 🔧 Asset Management

### Asset Helper System

```javascript
import { Assets } from './shared/helpers/asset-helper.js';

// Brand assets
Assets.brand.logo()              // Legacy Concierge logo
Assets.brand.signatureLogo()     // Signature logo variant

// UI elements  
Assets.ui.searchIcon()           // Search interface icon
Assets.ui.sliderArrowLeft()      // Carousel navigation
Assets.ui.socialShare('blue')    // Social media icons

// Device mockups
Assets.devices.desktop()         // Desktop frame mockup
Assets.devices.phonePortrait()   // Mobile frame mockup
```

### Icon Libraries

- **Linea Icons** - 6 categories (arrows, basic, ecommerce, music, software, weather)
- **Elegant Icons** - Professional icon font collection
- **Custom Graphics** - Healthcare and wellness themed assets

## 🏥 Healthcare Services Integration

### Service Categories

- **Concierge Nursing** - Private duty nursing care
- **Caregiver Services** - Professional caregiving support
- **Specialized Care** - Post-op, oncology, dementia, rehabilitation
- **Medical Partnerships** - Integration with healthcare providers

### Quality Standards

- **3% Nurse Acceptance Rate** - Highly selective recruitment
- **24/7 Support** - Round-the-clock availability
- **Multi-level Oversight** - Clinical supervision and quality assurance
- **Premier Healthcare Standards** - Exceptional service delivery

## 🔗 Related Links

- **Live Website**: [legacyconcierge.com](https://legacyconcierge.com)
- **GitHub Repository**: [github.com/dylarcher/lc-website](https://github.com/dylarcher/lc-website)
- **Component Gallery**: [View Interactive Components](./src/pages/components.html)

## 📄 License

This project is proprietary and confidential. All rights reserved by Legacy Concierge.

---

**Built with ❤️ and modern web standards**  
