// Theme color palette for the application
export const COLORS = {
  // Primary colors
  primary: '#6A8D92',      // Soft French Blue
  secondary: '#E6C9A8',    // Warm Beige
  accent: '#D5A38E',       // Dusty Coral
  success: '#5D4037',      // Walnut Brown

  // UI colors
  background: {
    primary: '#F4E6D0',    // Cream
    secondary: '#6A8D92',  // Soft French Blue
    elevated: '#A8B8A6'    // Light Sage
  },

  // Text colors
  text: {
    primary: '#5D4037',    // Walnut Brown
    secondary: '#D5A38E',  // Dusty Coral
    muted: '#9E9E9E'       // Warm Gray
  },

  // Visualization colors (for fractal/sequencer)
  viz: {
    'A': '#6A8D92', // Soft French Blue
    'B': '#E6C9A8', // Warm Beige
    'C': '#D5A38E', // Dusty Coral
    'D': '#F4E6D0', // Cream
    'E': '#5D4037', // Walnut Brown
    'F': '#A8B8A6', // Light Sage
    'G': '#F5F5F0'  // Soft Ivory
  },

  // Gradients
  gradients: {
    sage: 'linear-gradient(135deg, #6A8D92 0%, #5D4037 100%)',
    slate: 'linear-gradient(135deg, #E6C9A8 0%, #D5A38E 100%)'
  }
};

// Color keys for random selection
export const COLOR_KEYS = Object.keys(COLORS.viz);

// Helper function for alpha colors
export const withAlpha = (color, alpha) => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
