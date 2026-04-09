export const SITE_CONFIG = {
  name: "Pratik Patil",
  title: "Pratik Patil | Software Engineer | Frontend Specialist",
  description: "Software Engineer with 7+ years of experience specializing in frontend development. Sole frontend architect at BDIPlus, building real-time, data-heavy interfaces for enterprise clients including Morgan Stanley.",
  url: "https://pratikpatil.dev",
  author: {
    name: "Pratik Patil",
    email: "pratikpatilui@gmail.com",
    github: "https://github.com/pratikpatil-ui",
    linkedin: "https://linkedin.com/in/pratik-patil-dev",
    location: "Jersey City, NJ",
  },
}

/**
 * Warm sage/gold color palette
 * Usage: 70% backgrounds, 15% brand, 10% accents
 */
export const COLORS = {
  // Backgrounds (70% usage)
  background: {
    main: '#F5F3EF',        // Warm cream
    card: '#FFFFFF',        // Pure white
    sageWash: '#E0EFE9',    // Light sage for breaks
    hover: '#F9F8F6',       // Barely visible lift
  },

  // Text colors
  text: {
    primary: '#1F2933',     // Deep charcoal (headings & body)
    muted: '#6B7280',       // Cool gray (dates/tags)
    onDark: '#F9FAFB',      // Text on dark backgrounds
  },

  // Brand colors (15% usage)
  brand: {
    sage: '#4C8572',        // Primary sage/teal
    sageLight: '#E0EFE9',   // Light sage chips/backgrounds
    sageDark: '#3A6B5B',    // Hover states
  },

  // Accent colors (10% usage)
  accent: {
    gold: '#F2B647',        // Gold CTA
    goldHover: '#D89F34',   // Gold interaction
    copper: '#D4A373',      // Copper details
    rust: '#C97A5F',        // Rust variant
  },

  // Functional
  functional: {
    border: '#374151',      // Subtle dividers
    focusRing: '#5FCCBA',   // Keyboard navigation
    error: '#EF4444',       // Error state
    success: '#5FCCBA',     // Success (= brand teal)
  },

  // Dark mode
  dark: {
    background: '#0F172A',  // Deep navy
    surface: '#1E293B',     // Elevated surfaces
    border: '#334155',      // Borders
  },

  // Gradients
  gradient: {
    hero: 'linear-gradient(135deg, #4C8572 0%, #5FCCBA 100%)',      // Sage to bright teal
    card: 'linear-gradient(135deg, #F2B647 0%, #D89F34 100%)',      // Gold gradient
    text: 'linear-gradient(90deg, #4C8572 0%, #F2B647 100%)',       // Sage to gold
    sage: 'linear-gradient(135deg, #E0EFE9 0%, #4C8572 100%)',      // Light to dark sage
    warm: 'linear-gradient(135deg, #F2B647 0%, #C97A5F 100%)',      // Gold to rust
  },
}
