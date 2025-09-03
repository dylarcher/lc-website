# Legacy Concierge Web Components - Test Suite

Comprehensive testing infrastructure for the Legacy Concierge web component library, ensuring quality, accessibility, and performance of healthcare-focused UI components.

## 🧪 Testing Overview

### Test Architecture

Our testing strategy employs multiple levels of testing to ensure robust, accessible, and maintainable web components:

1. **Unit Tests** - Individual component testing
2. **Integration Tests** - Component interaction testing  
3. **End-to-End Tests** - Complete user workflow testing
4. **Accessibility Tests** - WCAG compliance and screen reader support
5. **Performance Tests** - Load time and render performance

### Test Coverage Goals

- **Functions**: 80%+ coverage
- **Lines**: 80%+ coverage  
- **Branches**: 80%+ coverage
- **Statements**: 80%+ coverage

## 📁 Directory Structure

```
test/
├── babel.config.js           # Babel configuration for ES6+ support
├── jest.config.js           # Jest test runner configuration
├── package.json             # Test dependencies and scripts
├── README.md               # This documentation
├── e2e/                    # End-to-end tests
│   └── page-functionality.test.js
├── mocks/                  # Mock files for static assets
│   └── file-mock.js
├── suites/                 # Integration test suites
│   └── component-integration.test.js
├── units/                  # Unit tests by component type
│   ├── components/         # Interactive components
│   │   └── bridge-accordion.test.js
│   ├── elements/          # Basic UI elements
│   │   └── bridge-button.test.js
│   └── sections/          # Layout sections
│       └── bridge-header.test.js
└── utils/                 # Testing utilities
    ├── test-setup.js      # Global test setup and custom matchers
    └── web-components-polyfill.js  # Web Components API polyfill
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ (for Jest testing framework)
- Modern browser with Web Components support (for manual testing)

### Installation

```bash
cd test/
npm install
```

### Running Tests

```bash
# Run all tests
npm test

# Run with watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run specific test types
npm run test:units        # Unit tests only
npm run test:integration  # Integration tests only
npm run test:e2e         # End-to-end tests only

# Run tests for specific component types
npm run test:components   # Interactive components
npm run test:elements     # Basic elements
npm run test:sections     # Layout sections

# CI/CD pipeline tests
npm run test:ci
```

## 🧪 Test Categories

### Unit Tests

Test individual web components in isolation:

**Bridge Button (`bridge-button.test.js`)**
- Component registration and shadow DOM creation
- Attribute observation and property mapping  
- Event handling and custom event dispatch
- Variant support (primary, secondary, outline)
- Size support (small, medium, large)
- Disabled state handling
- Accessibility features (ARIA, focus management)
- CSS custom properties integration

**Bridge Accordion (`bridge-accordion.test.js`)**
- Accordion and accordion item component registration
- Control functionality (expand all, collapse all)
- State detection (all expanded, all collapsed)
- Event propagation and custom events
- Accessibility compliance (ARIA roles, keyboard navigation)
- Multiple accordion behavior modes

**Bridge Header (`bridge-header.test.js`)**
- Header, menu, menu item, and dropdown component registration
- Mobile menu toggle functionality
- Scroll state management and sticky behavior
- Legacy Concierge branding integration
- Navigation event handling
- Responsive design adaptation

### Integration Tests

Test component interactions and combined functionality:

**Component Integration (`component-integration.test.js`)**
- Button and modal interaction workflows
- Header and navigation menu coordination
- Form components working together
- Event propagation between components
- Shared CSS custom properties
- Asset helper integration
- Responsive design coordination

### End-to-End Tests

Test complete user workflows and page functionality:

**Page Functionality (`page-functionality.test.js`)**
- Complete homepage loading and interaction
- Component gallery showcase functionality  
- Contact form submission workflow
- Portfolio filtering and display
- Mobile responsive behavior
- Keyboard navigation and accessibility
- ARIA labels and screen reader support

## 🎯 Component Testing Patterns

### Custom Element Testing

```javascript
// Create test component with attributes
const component = createTestComponent('bridge-button', {
  variant: 'primary',
  size: 'large'
});

// Wait for component to be fully ready
await waitForComponentReady(component);

// Test shadow DOM content
const shadowButton = component.shadowRoot.querySelector('button');
expect(shadowButton.className).toContain('primary large');
```

### Event Testing

```javascript
// Test custom event dispatch
const clickHandler = jest.fn();
component.addEventListener('bridge-button-click', clickHandler);

const shadowButton = component.shadowRoot.querySelector('button');
shadowButton.click();

expect(clickHandler).toHaveBeenCalledTimes(1);
expect(clickHandler.mock.calls[0][0].detail.originalEvent).toBeTruthy();
```

### Attribute Testing

```javascript
// Test observed attributes
const observedAttrs = component.constructor.observedAttributes;
expect(observedAttrs).toContain('variant');

// Test attribute changes
component.setAttribute('variant', 'secondary');
expect(component.variant).toBe('secondary');
```

## ♿ Accessibility Testing

### ARIA Support

```javascript
// Test ARIA attributes
const summary = component.shadowRoot.querySelector('summary');
expect(summary.getAttribute('role')).toBe('button');
expect(summary.getAttribute('aria-expanded')).toBe('false');
expect(summary.hasAttribute('aria-controls')).toBe(true);
```

### Keyboard Navigation

```javascript
// Test tabindex and keyboard focus
const menuItem = component.shadowRoot.querySelector('a');
expect(menuItem.getAttribute('tabindex')).toBe('0');

// Test focus-visible styling
const styles = component.shadowRoot.querySelector('style').textContent;
expect(styles).toContain('focus-visible');
```

### Screen Reader Support

```javascript
// Test screen reader only content
const srElements = component.shadowRoot.querySelectorAll('.sr-only');
expect(srElements.length).toBeGreaterThan(0);

// Test ARIA labels and descriptions
const button = component.shadowRoot.querySelector('button');
expect(button.hasAttribute('aria-label')).toBe(true);
```

## 🎨 Brand Integration Testing

### Legacy Concierge Branding

```javascript
// Test brand color variables
const styles = component.shadowRoot.querySelector('style').textContent;
expect(styles).toContain('--lc-primary');
expect(styles).toContain('--lc-primary-light');

// Test brand assets
const logoImg = component.shadowRoot.querySelector('.bridge-logo img');
expect(logoImg.src).toContain('legacy-concierge-logo');

// Test brand typography
expect(styles).toContain('--lc-font-primary');
```

## 📊 Coverage and Quality

### Coverage Reporting

Coverage reports are generated in `test/coverage/` directory:

- **HTML Report**: `test/coverage/lcov-report/index.html`
- **LCOV Data**: `test/coverage/lcov.info`
- **Text Summary**: Console output during test runs

### Quality Thresholds

Tests must maintain minimum coverage thresholds:
- **80%** function coverage
- **80%** line coverage
- **80%** branch coverage  
- **80%** statement coverage

### Performance Monitoring

- Component render time tracking
- Shadow DOM creation performance
- Event handling efficiency
- Memory usage patterns

## 🛠️ Development Workflow

### Test-Driven Development

1. **Write failing tests** for new component features
2. **Implement minimum** code to make tests pass
3. **Refactor** while maintaining test coverage
4. **Validate accessibility** with screen reader testing
5. **Test responsive** behavior across viewports

### Continuous Integration

Tests run automatically on:
- Pull request submissions
- Main branch commits
- Release candidate builds
- Nightly scheduled runs

### Debugging Tests

```bash
# Run single test file
npm test bridge-button.test.js

# Run tests matching pattern
npm test --testNamePattern="Button variants"

# Run with verbose output
npm test --verbose

# Debug with Node inspector
node --inspect-brk node_modules/.bin/jest --runInBand
```

## 🔧 Utilities and Helpers

### Custom Matchers

- `toBeCustomElement()` - Validates custom element structure
- `toHaveShadowRoot()` - Checks shadow DOM presence
- `toHaveAttribute()` - Validates element attributes

### Test Utilities

- `createTestComponent()` - Creates component instances with attributes
- `waitForComponentReady()` - Waits for component initialization
- `cleanup()` - Resets DOM between tests

### Mock Implementations

- File assets (images, fonts, audio, video)
- ResizeObserver and IntersectionObserver APIs
- Console methods for clean test output

## 🚨 Troubleshooting

### Common Issues

**Components not rendering**
- Ensure `await waitForComponentReady(component)` is called
- Check that custom elements are properly registered

**Shadow DOM access fails**  
- Verify component has `attachShadow({ mode: 'open' })`
- Use `component.shadowRoot.querySelector()` for shadow DOM queries

**Event handlers not triggered**
- Ensure event listeners are set up after component is ready
- Check event bubbling and propagation settings

**CSS custom properties not working**
- Verify CSS custom properties are defined in component styles
- Check property name spelling and consistency

### Performance Issues

**Slow test execution**
- Reduce use of `setTimeout` in tests
- Mock heavy operations like asset loading
- Use `jest.useFakeTimers()` for time-based functionality

## 📈 Future Enhancements

### Planned Improvements

- **Visual Regression Testing** with screenshot comparison
- **Bundle Size Analysis** for component optimization
- **Cross-Browser Testing** with Playwright integration
- **Performance Benchmarking** with automated metrics
- **Accessibility Auditing** with axe-core integration

### Contributing

When adding new components:

1. Create unit tests in appropriate `units/` subdirectory
2. Add integration tests if component interacts with others  
3. Include accessibility tests for all interactive elements
4. Test responsive behavior and mobile functionality
5. Validate Legacy Concierge brand integration
6. Maintain minimum 80% test coverage

---

**🏥 Healthcare-First Testing**

Our testing approach prioritizes the reliability and accessibility requirements of healthcare applications, ensuring that Legacy Concierge web components meet the highest standards for user safety and regulatory compliance.