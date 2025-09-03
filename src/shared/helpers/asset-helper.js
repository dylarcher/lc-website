/**
 * Asset Helper Utilities
 * Provides easy access to project assets with proper path resolution
 */

class AssetHelper {
    constructor() {
        this.basePath = '../shared/assets';
        this.imagePath = `${this.basePath}/images`;
        this.iconsPath = `${this.basePath}/icons`;
        this.graphicsPath = `${this.basePath}/graphics`;
        this.mediaPath = `${this.basePath}/media`;
        this.fontsPath = `${this.basePath}/fonts`;
    }

    /**
     * Get image asset path
     * @param {string} filename - Image filename
     * @returns {string} Full image path
     */
    image(filename) {
        return `${this.imagePath}/${filename}`;
    }

    /**
     * Get graphics asset path
     * @param {string} filename - Graphics filename
     * @returns {string} Full graphics path
     */
    graphic(filename) {
        return `${this.graphicsPath}/${filename}`;
    }

    /**
     * Get icon asset path
     * @param {string} collection - Icon collection name (linea-icons, elegant-icons)
     * @param {string} filename - Icon filename (optional)
     * @returns {string} Full icon path
     */
    icon(collection, filename = '') {
        return filename ? `${this.iconsPath}/${collection}/${filename}` : `${this.iconsPath}/${collection}`;
    }

    /**
     * Get Legacy Concierge brand assets
     */
    brand = {
        logo: () => this.image('legacy-concierge-logo.png'),
        signatureLogo: () => this.image('legacy-concierge-signature-logo.png'),
        companyLogo: () => this.image('company-logo.png'),
        favicon: () => this.graphic('favicon.ico')
    }

    /**
     * Get UI component assets
     */
    ui = {
        // Navigation and menus
        menuArrow: () => this.image('content_menu_arrow.png'),
        closeMenu: (theme = '') => this.image(`close_side_menu${theme ? '_' + theme : ''}.png`),
        searchIcon: (gray = false) => this.image(`search_icon${gray ? '_gray' : ''}.png`),
        
        // Buttons and controls
        plus: (white = false, size = '') => this.image(`plus${white ? '_white' : ''}${size ? size : ''}.png`),
        minus: (size = '') => this.image(`minus${size ? size : ''}.png`),
        back: () => this.image('back.png'),
        
        // Sliders and carousels
        sliderArrowLeft: (theme = '', size = '') => this.image(`slider-arrow-left${theme ? '-' + theme : ''}${size ? size : ''}.png`),
        sliderArrowRight: (theme = '', size = '') => this.image(`slider-arrow-right${theme ? '-' + theme : ''}${size ? size : ''}.png`),
        
        // Portfolio and galleries
        portfolioButton: (hover = false, size = '') => this.image(`portfolio_list_button${hover ? '_hover' : ''}${size ? size : ''}.png`),
        
        // Social and sharing
        socialShare: (theme = '', size = '') => this.image(`social_share${theme ? '_' + theme : ''}${size ? size : ''}.png`),
        
        // Loading and feedback
        loader: () => this.graphic('ajax-loader.gif'),
        star: () => this.image('star.png')
    }

    /**
     * Get device mockup assets
     */
    devices = {
        desktop: () => this.graphic('in-device-slider-desktop.png'),
        tabletPortrait: () => this.graphic('in-device-slider-tablet-portrait.png'),
        tabletLandscape: () => this.graphic('in-device-slider-tablet-landscape.png'),
        phonePortrait: () => this.graphic('in-device-slider-phone-portrait.png'),
        phoneLandscape: () => this.graphic('in-device-slider-phone-landscape.png'),
        browserTop: (dark = false) => this.graphic(`bridge-browser-top${dark ? '-dark' : ''}.png`),
        phoneHollow: (dark = false) => this.graphic(`bridge-phone-hollow${dark ? '-dark' : ''}.png`)
    }

    /**
     * Get social media assets
     */
    social = {
        instagram: () => this.image('insta.png'),
        linkedin: () => this.image('linkedin.png'),
        web: () => this.image('web.png'),
        phone: () => this.image('phone.png'),
        location: () => this.image('location.png')
    }

    /**
     * Get icon CSS for different collections
     */
    iconCSS = {
        linea: () => `${this.iconsPath}/linea-icons/style.css`,
        elegant: () => `${this.iconsPath}/elegant-icons/style.css`
    }

    /**
     * Create responsive image srcset
     * @param {string} baseName - Base filename without extension
     * @param {string} extension - File extension
     * @returns {string} Srcset attribute value
     */
    createSrcSet(baseName, extension = 'png') {
        const base = this.image(`${baseName}.${extension}`);
        const retina15 = this.image(`${baseName}@1_5x.${extension}`);
        const retina2 = this.image(`${baseName}@2x.${extension}`);
        
        return `${base} 1x, ${retina15} 1.5x, ${retina2} 2x`;
    }

    /**
     * Check if asset exists (for development)
     * @param {string} path - Asset path to check
     * @returns {Promise<boolean>} Whether asset exists
     */
    async exists(path) {
        try {
            const response = await fetch(path, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    }
}

// Export singleton instance
export const Assets = new AssetHelper();
export default Assets;