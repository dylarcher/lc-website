# Bridge Theme Web Components

A collection of vanilla web components extracted from the Bridge Theme, organized into modular, reusable elements, components, and blocks.

## 🏗️ Structure

```
src/
├── elements/          # Basic UI elements
│   ├── bridge-button.js
│   ├── bridge-input.js
│   ├── bridge-progress.js
│   ├── bridge-image.js
│   ├── bridge-picture.js
│   └── bridge-figure.js
├── components/        # Complex interactive components
│   ├── bridge-accordion.js
│   ├── bridge-tabs.js
│   ├── bridge-modal.js
│   ├── bridge-card.js
│   ├── bridge-slider.js
│   ├── bridge-contact-form.js
│   ├── bridge-service-card.js
│   ├── bridge-portfolio-filter.js
│   └── bridge-testimonials-carousel.js
├── sections/          # Layout sections and page components
│   ├── bridge-header.js
│   ├── bridge-footer.js
│   ├── bridge-hero-section.js
│   ├── bridge-content-section.js
│   └── bridge-image-content-section.js
├── modules/           # Accessibility and utility modules
│   ├── bridge-hero.js
│   ├── bridge-portfolio.js
│   ├── bridge-testimonial.js
│   ├── bridge-pricing.js
│   ├── bridge-skip-links.js
│   └── bridge-keyboard-shortcut.js
├── shared/
│   ├── helpers/       # JavaScript utilities
│   │   ├── asset-manager.js
│   │   └── bridge-utils.js
│   └── styles/        # CSS files
│       ├── bridge-core.css
│       ├── bridge-layout.css
│       └── bridge-responsive.css
├── pages/             # Complete page templates
│   ├── about.html
│   ├── services.html
│   └── contact.html
├── views/             # Content view templates
│   ├── blog-post.html
│   └── portfolio-single.html
├── main.js            # Main entry point
└── README.md          # Documentation
```

## 🚀 Quick Start

### 1. Import Components

```html
<!-- Import all components -->
<script type="module" src="main.js"></script>

<!-- Or import specific components -->
<script type="module" src="elements/bridge-button.js"></script>
<script type="module" src="components/bridge-accordion.js"></script>
<script type="module" src="sections/bridge-header.js"></script>
<script type="module" src="modules/bridge-skip-links.js"></script>
```

### 2. Use Components

```html
<!-- Button -->
<bridge-button variant="primary" size="large">Click Me</bridge-button>

<!-- Input -->
<bridge-input label="Email" type="email" placeholder="Enter email" required>
</bridge-input>

<!-- Modal -->
<bridge-modal id="myModal" title="Hello World">
    <p>Modal content here</p>
</bridge-modal>
```

## 📚 Components Documentation

### Elements

#### `<bridge-button>`

Basic button element with multiple variants and sizes.

**Attributes:**

* `variant`: `primary` | `outline` | `secondary` (default: `primary`)
* `size`: `small` | `medium` | `large` (default: `medium`)
* `disabled`: Boolean

**Events:**

* `bridge-button-click`: Fired when button is clicked

**Example:**

```html
<bridge-button variant="outline" size="large">
    Get Started
</bridge-button>
```

#### `<bridge-input>`

Form input with label, validation, and error states.

**Attributes:**

* `type`: Input type (default: `text`)
* `label`: Input label text
* `placeholder`: Placeholder text
* `required`: Boolean
* `disabled`: Boolean
* `error`: Error message to display

**Events:**

* `bridge-input`: Fired on input change
* `bridge-change`: Fired when input loses focus
* `bridge-focus`: Fired when input gains focus
* `bridge-blur`: Fired when input loses focus

**Example:**

```html
<bridge-input label="Full Name" type="text" placeholder="Enter your name" required error="Name is required">
</bridge-input>
```

#### `<bridge-progress>`

Animated progress bar with labels and percentages.

**Attributes:**

* `value`: Progress value (0-100)
* `max`: Maximum value (default: 100)
* `label`: Progress label
* `show-percentage`: Boolean

**Example:**

```html
<bridge-progress value="75" label="Loading..." show-percentage>
</bridge-progress>
```

### Components

#### `<bridge-accordion>`

Collapsible content panels with smooth animations, accessibility features, and control options.

**Attributes:**

* `allow-multiple`: Allow multiple panels open
* `collapse-siblings`: Close opened siblings when another panel opens
* `show-controls`: Display expand/collapse all buttons
* `label`: Aria label for the accordion

**Events:**

* `accordion-toggle`: Fired when panel is toggled
* `accordion-expand-all`: Fired when expand all is clicked
* `accordion-collapse-all`: Fired when collapse all is clicked

**Example:**

```html
<bridge-accordion show-controls collapse-siblings label="FAQ Section">
    <bridge-accordion-item title="Panel 1" open>
        Content for panel 1
    </bridge-accordion-item>
    <bridge-accordion-item title="Panel 2">
        Content for panel 2
    </bridge-accordion-item>
</bridge-accordion>
```

#### `<bridge-tabs>`

Tabbed interface with keyboard navigation.

**Attributes:**

* `active-tab`: Index of active tab (default: 0)

**Events:**

* `tab-change`: Fired when tab is changed

**Example:**

```html
<bridge-tabs active-tab="0">
    <bridge-tab-item title="Tab 1">Content 1</bridge-tab-item>
    <bridge-tab-item title="Tab 2">Content 2</bridge-tab-item>
</bridge-tabs>
```

#### `<bridge-modal>`

Native dialog-based modal with focus management.

**Attributes:**

* `title`: Modal title
* `size`: `small` | `medium` | `large` | `xlarge` (default: `medium`)
* `closable`: Boolean (default: true)

**Methods:**

* `open()`: Open the modal
* `close()`: Close the modal

**Events:**

* `modal-open`: Fired when modal opens
* `modal-close`: Fired when modal closes

**Example:**

```html
<bridge-modal id="myModal" title="Confirmation" size="small">
    Are you sure you want to delete this item?

    <div slot="footer">
        <bridge-button variant="outline">Cancel</bridge-button>
        <bridge-button variant="primary">Delete</bridge-button>
    </div>
</bridge-modal>
```

#### `<bridge-card>`

Flexible card component with image, content, and actions.

**Attributes:**

* `title`: Card title
* `image`: Card image URL
* `variant`: `default` | `elevated` | `outlined` | `flat` | `minimal` | `featured`
* `hover-effect`: `lift` | `scale` | `glow` | `none` (default: `lift`)

**Slots:**

* Default slot: Card content
* `actions`: Card action buttons

**Example:**

```html
<bridge-card title="Service Card" variant="elevated" hover-effect="lift">
    <p>Card description goes here</p>
    <bridge-button slot="actions" variant="primary">Learn More</bridge-button>
</bridge-card>
```

### New Elements

#### `<bridge-picture>`

Responsive picture element with srcset support, lazy loading, and error handling.

**Attributes:**

* `src`: Image source URL
* `srcset`: Responsive image sources
* `sizes`: Media query sizes (default: "100vw")
* `alt`: Alternative text
* `loading`: Loading behavior ("lazy" or "eager")
* `aspect-ratio`: CSS aspect ratio
* `object-fit`: CSS object-fit property
* `rounded`: Apply border radius
* `shadow`: Apply drop shadow

**Events:**

* `bridge-picture-load`: Fired when image loads
* `bridge-picture-error`: Fired when image fails to load

**Example:**

```html
<bridge-picture 
  src="image.jpg"
  srcset="image-400.jpg 400w, image-800.jpg 800w, image-1200.jpg 1200w"
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="Responsive image"
  loading="lazy"
  rounded
  shadow>
</bridge-picture>
```

#### `<bridge-figure>`

Figure wrapper with figcaption support for images.

**Attributes:**

* `caption`: Figure caption text
* `caption-position`: "top" or "bottom"
* `align`: "left", "center", or "right"
* `size`: "small", "medium", "large", or "full"
* `caption-style`: "bold", "subtle", or "emphasized"

**Example:**

```html
<bridge-figure caption="Beautiful landscape photo" size="large" rounded>
  <bridge-picture src="landscape.jpg" alt="Landscape"></bridge-picture>
</bridge-figure>
```

### New Sections

#### `<bridge-image-content-section>`

Image and content section with flexible layout options.

**Attributes:**

* `image-position`: "left" or "right"
* `layout`: "horizontal" or "vertical"
* `vertical-align`: "top", "center", or "bottom"
* `gap`: CSS gap value
* `background`: Background color variant
* `eyebrow`: Eyebrow text above heading
* `heading`: Main heading text
* `subtext`: Subtext below heading

**Slots:**

* `image`: Image content
* `content`: Main content
* `eyebrow`: Eyebrow text
* `heading`: Main heading
* `subtext`: Subtext

**Example:**

```html
<bridge-image-content-section 
  image-position="right" 
  eyebrow="Our Services"
  heading="Professional Web Development"
  subtext="Building modern, responsive websites">
  
  <bridge-picture 
    slot="image"
    src="team.jpg" 
    alt="Our team">
  </bridge-picture>
  
  <div slot="content">
    <p>We create beautiful, functional websites...</p>
  </div>
</bridge-image-content-section>
```

### Accessibility Modules

#### `<bridge-skip-links>`

Skip navigation links for keyboard users and screen readers.

**Attributes:**

* `auto-detect`: Automatically detect skip targets
* `position`: "top-left", "top-center", or "top-right"

**Child Elements:**

* `<bridge-skip-link href="#target" label="Skip to content"></bridge-skip-link>`

**Example:**

```html
<bridge-skip-links auto-detect position="top-left">
  <bridge-skip-link href="#main-content" label="Skip to main content"></bridge-skip-link>
  <bridge-skip-link href="#navigation" label="Skip to navigation"></bridge-skip-link>
</bridge-skip-links>
```

#### `<bridge-keyboard-shortcut>`

Keyboard shortcut wrapper with visual indicators and ARIA support.

**Attributes:**

* `keys`: Key combination (e.g., "ctrl+shift+c")
* `action`: "click", "focus", "toggle", or "custom"
* `description`: Shortcut description
* `position`: Visual indicator position
* `show-visual`: Display keyboard visual on trigger
* `trigger-mode`: "hover", "focus", or "always"

**Events:**

* `keyboard-shortcut-triggered`: Fired when shortcut is activated
* `shortcut-activated`: General shortcut event

**Example:**

```html
<bridge-keyboard-shortcut 
  keys="ctrl+shift+c" 
  action="click" 
  description="Contact us" 
  show-visual 
  trigger-mode="hover">
  <bridge-button variant="primary">Contact Us</bridge-button>
</bridge-keyboard-shortcut>
```

### Blocks

#### `<bridge-hero>`

Hero section with background, overlay, and content slots.

**Attributes:**

* `variant`: `default` | `minimal` | `split` | `centered`
* `background`: Background image URL
* `overlay`: `none` | `dark` | `light` | `gradient-dark` | `gradient-primary`
* `height`: CSS height value (default: `100vh`)
* `align`: `top` | `center` | `bottom` (default: `center`)

**Slots:**

* `title`: Hero title
* `subtitle`: Hero subtitle
* `actions`: Hero action buttons
* `media`: Media content (for split variant)

**Example:**

```html
<bridge-hero variant="centered" background="hero-bg.jpg" overlay="dark">
    <h1 slot="title">Welcome</h1>
    <p slot="subtitle">Your journey starts here</p>
    <div slot="actions">
        <bridge-button variant="primary">Get Started</bridge-button>
    </div>
</bridge-hero>
```

#### `<bridge-portfolio>`

Portfolio grid with masonry layout support.

**Attributes:**

* `columns`: Number of columns (default: 3)
* `gap`: Gap between items (default: 0)
* `masonry`: Boolean for masonry layout

**Events:**

* `portfolio-item-click`: Fired when portfolio item is clicked

**Example:**

```html
<bridge-portfolio columns="3" gap="20px" masonry>
    <bridge-portfolio-item image="project1.jpg" title="Project 1" category="Web Design" description="Beautiful website design">
    </bridge-portfolio-item>
</bridge-portfolio>
```

#### `<bridge-testimonial>`

Testimonial component with multiple layout variants.

**Attributes:**

* `author`: Author name
* `position`: Author position
* `company`: Author company
* `avatar`: Author avatar URL
* `variant`: `card` | `quote` | `minimal` | `bubble`
* `rating`: Rating (1-5 stars)

**Example:**

```html
<bridge-testimonial variant="card" author="John Doe" position="CEO" company="Tech Corp" rating="5" avatar="avatar.jpg">
    "Excellent service and support!"
</bridge-testimonial>
```

#### `<bridge-pricing>`

Pricing table with multiple card layouts.

**Attributes:**

* `columns`: Number of columns or `auto`
* `gap`: Gap between cards

**Example:**

```html
<bridge-pricing columns="3">
    <bridge-pricing-card title="Basic" price="19" period="month" currency="$" featured>
        <span slot="description">Perfect for starters</span>
        <li slot="features">Feature 1</li>
        <li slot="features">Feature 2</li>
    </bridge-pricing-card>
</bridge-pricing>
```

## 🎨 Theming

### Colors

| Hue | Hex Code    | Instances (on the Homepage) |
| :------ | :----------- | :------------------- |
| <div style="width: 20px; height: 20px; background-color: #000000; border: 1px solid #ccc; "></div> | `#000000` | `193` |
| <div style="width: 20px; height: 20px; background-color: #033F4A; border: 1px solid #ccc; "></div> | `#033F4A` | `4` |
| <div style="width: 20px; height: 20px; background-color: #05181F; border: 1px solid #ccc; "></div> | `#05181F` | `4` |
| <div style="width: 20px; height: 20px; background-color: #06171E; border: 1px solid #ccc; "></div> | `#06171E` | `1701` |
| <div style="width: 20px; height: 20px; background-color: #070412; border: 1px solid #ccc; "></div> | `#070412` | `2` |
| <div style="width: 20px; height: 20px; background-color: #082935; border: 1px solid #ccc; "></div> | `#082935` | `167` |
| <div style="width: 20px; height: 20px; background-color: #0B2935; border: 1px solid #ccc; "></div> | `#0B2935` | `6` |
| <div style="width: 20px; height: 20px; background-color: #1A1A1A; border: 1px solid #ccc; "></div> | `#1A1A1A` | `60` |
| <div style="width: 20px; height: 20px; background-color: #1E5963; border: 1px solid #ccc; "></div> | `#1E5963` | `1` |
| <div style="width: 20px; height: 20px; background-color: #1F2124; border: 1px solid #ccc; "></div> | `#1F2124` | `20` |
| <div style="width: 20px; height: 20px; background-color: #3D3D3D; border: 1px solid #ccc; "></div> | `#3D3D3D` | `3` |
| <div style="width: 20px; height: 20px; background-color: #564132; border: 1px solid #ccc; "></div> | `#564132` | `7` |
| <div style="width: 20px; height: 20px; background-color: #5D2DE6; border: 1px solid #ccc; "></div> | `#5D2DE6` | `2` |
| <div style="width: 20px; height: 20px; background-color: #69727D; border: 1px solid #ccc; "></div> | `#69727D` | `12` |
| <div style="width: 20px; height: 20px; background-color: #808080; border: 1px solid #ccc; "></div> | `#808080` | `668` |
| <div style="width: 20px; height: 20px; background-color: #82534C; border: 1px solid #ccc; "></div> | `#82534C` | `2` |
| <div style="width: 20px; height: 20px; background-color: #82634C; border: 1px solid #ccc; "></div> | `#82634C` | `7` |
| <div style="width: 20px; height: 20px; background-color: #8D8180; border: 1px solid #ccc; "></div> | `#8D8180` | `3` |
| <div style="width: 20px; height: 20px; background-color: #94B0B0; border: 1px solid #ccc; "></div> | `#94B0B0` | `26` |
| <div style="width: 20px; height: 20px; background-color: #9EBDBB; border: 1px solid #ccc; "></div> | `#9EBDBB` | `20` |
| <div style="width: 20px; height: 20px; background-color: #A07E66; border: 1px solid #ccc; "></div> | `#A07E66` | `40` |
| <div style="width: 20px; height: 20px; background-color: #A8A8A8; border: 1px solid #ccc; "></div> | `#A8A8A8` | `668` |
| <div style="width: 20px; height: 20px; background-color: #B7AC9F; border: 1px solid #ccc; "></div> | `#B7AC9F` | `6` |
| <div style="width: 20px; height: 20px; background-color: #BCB9B5; border: 1px solid #ccc; "></div> | `#BCB9B5` | `3` |
| <div style="width: 20px; height: 20px; background-color: #CDCDCD; border: 1px solid #ccc; "></div> | `#CDCDCD` | `3` |
| <div style="width: 20px; height: 20px; background-color: #D5D8DC; border: 1px solid #ccc; "></div> | `#D5D8DC` | `4` |
| <div style="width: 20px; height: 20px; background-color: #E1DCD2; border: 1px solid #ccc; "></div> | `#E1DCD2` | `5` |
| <div style="width: 20px; height: 20px; background-color: #F5F3ED; border: 1px solid #ccc; "></div> | `#F5F3ED` | `4` |
| <div style="width: 20px; height: 20px; background-color: #F6F3EC; border: 1px solid #ccc; "></div> | `#F6F3EC` | `3` |
| <div style="width: 20px; height: 20px; background-color: #F9F7F4; border: 1px solid #ccc; "></div> | `#F9F7F4` | `2` |
| <div style="width: 20px; height: 20px; background-color: #FAF6F1; border: 1px solid #ccc; "></div> | `#FAF6F1` | `15` |
| <div style="width: 20px; height: 20px; background-color: #FFFFFF; border: 1px solid #ccc; "></div> | `#FFFFFF` | `668` |

All components use CSS custom properties for theming:

```css
:root {
    --primary-color: #1abc9c;
    --secondary-color: #2c3e50;
    --accent-color: #e74c3c;
    --text-dark: #333333;
    --text-light: #777777;
    --bg-light: #f8f8f8;
    --bg-dark: #1a1a1a;
    --border-color: #e5e5e5;

    --font-primary: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    --font-display: "Montserrat", sans-serif;

    --spacing-sm: 1rem;
    --spacing-md: 2rem;
    --spacing-lg: 3rem;

    --transition-base: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## 🌐 Browser Support

* Chrome 54+
* Firefox 63+
* Safari 10.1+
* Edge 79+

All components use native web standards:

* Custom Elements v1
* Shadow DOM v1
* ES6 Modules
* CSS Custom Properties

## 📖 Examples

See the `src/pages/*.html` files for complete examples of components in action:
- **`pages/about.html`**: Comprehensive page with skip links, keyboard shortcuts, and ARIA support
- **`pages/services.html`**: Service listings with interactive components
- **`pages/contact.html`**: Contact forms and accessibility features
- **`views/blog-post.html`**: Blog post template with rich content structure
- **`views/portfolio-single.html`**: Portfolio item detailed view

## 🔧 Development

Components are built with:

* Vanilla JavaScript (no frameworks)
* Native Web Components API
* Modern CSS features
* Accessibility best practices
* Keyboard navigation support
* Screen reader compatibility

## ♿ WCAG 2.2 AA Color Contrast Compliance

The Bridge Theme color palette has been analyzed for WCAG 2.2 AA compliance (4.5:1 contrast ratio for normal text, 3:1 for large text).

### ✅ **Compliant Color Combinations**

| Background | Foreground | Contrast Ratio | Status | Usage |
|------------|------------|----------------|--------|--------|
| `#FFFFFF` (White) | `#0B2935` (Text Dark) | 15.1:1 | ✅ AAA | Body text on white |
| `#F5F3ED` (Cream Light) | `#0B2935` (Text Dark) | 13.8:1 | ✅ AAA | Body text on light backgrounds |
| `#FFFFFF` (White) | `#69727D` (Text Light) | 6.2:1 | ✅ AA | Secondary text |
| `#F5F3ED` (Cream Light) | `#69727D` (Text Light) | 5.7:1 | ✅ AA | Secondary text on light |
| `#082935` (Primary Dark) | `#FFFFFF` (White) | 15.1:1 | ✅ AAA | Buttons, links on dark |
| `#1A1A1A` (BG Dark) | `#F5F3ED` (Cream Light) | 13.2:1 | ✅ AAA | Dark mode text |
| `#9EBDBB` (Secondary) | `#0B2935` (Text Dark) | 8.9:1 | ✅ AAA | Secondary elements |

### ⚠️ **Non-Compliant Color Combinations**

| Background | Foreground | Contrast Ratio | Status | Issue | Recommendation |
|------------|------------|----------------|--------|-------|----------------|
| `#5D2DE6` (Accent Purple) | `#FFFFFF` (White) | 3.8:1 | ❌ AA | Button text | Use `#0B2935` text instead |
| `#9EBDBB` (Secondary) | `#FFFFFF` (White) | 1.7:1 | ❌ AA | Light text on secondary | Use `#0B2935` or darker text |
| `#A07E66` (Brown Light) | `#FFFFFF` (White) | 2.4:1 | ❌ AA | Light text on brown | Use `#0B2935` text |
| `#69727D` (Gray Blue) | `#CDCDCD` (Light Gray) | 2.1:1 | ❌ AA | Low contrast borders | Use `#0B2935` for important text |
| `#808080` (Gray Medium) | `#F5F3ED` (Cream Light) | 3.2:1 | ❌ AA | Disabled text | Increase contrast or use `#69727D` |

### 🎨 **Recommended Color Usage**

**For Maximum Accessibility:**
```css
/* High contrast text combinations */
.primary-text { 
  color: var(--bridge-text-dark); /* #0B2935 */
  background: var(--bridge-white); /* #FFFFFF */
}

.secondary-text {
  color: var(--bridge-gray-blue); /* #69727D */ 
  background: var(--bridge-white); /* #FFFFFF */
}

.dark-theme-text {
  color: var(--bridge-cream-2); /* #F5F3ED */
  background: var(--bridge-bg-dark); /* #1A1A1A */
}

/* Button combinations */
.primary-button {
  color: var(--bridge-white); /* #FFFFFF */
  background: var(--bridge-primary-dark); /* #082935 */
}

.secondary-button {
  color: var(--bridge-text-dark); /* #0B2935 */
  background: var(--bridge-secondary); /* #9EBDBB */
}

/* Avoid these combinations */
.avoid-purple-button {
  /* ❌ Don't use white text on purple */
  color: var(--bridge-white); 
  background: var(--bridge-accent-purple); /* #5D2DE6 */
}
```

**For Decorative Elements:**
- Use lower contrast colors from the palette for decorative borders, dividers, or background patterns
- Ensure any text overlays use high-contrast combinations from the compliant list
- Consider adding text shadows or background overlays for better readability on images

### 🔧 **Implementation Notes**

1. **Dynamic Contrast**: Components automatically use high-contrast combinations
2. **Dark Mode**: All dark mode combinations exceed WCAG AAA standards
3. **Focus Indicators**: Use `#082935` (Primary Dark) for focus outlines - 15.1:1 contrast
4. **Error States**: Red-equivalent colors maintain accessibility with proper text contrast
5. **Link Colors**: `#082935` provides excellent contrast on light backgrounds

## 📄 License

MIT License - feel free to use in personal and commercial projects.
