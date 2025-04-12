// App Color Palette
export const COLORS = {
    // Primary Colors
    PRIMARY: '#614EC1',       // Iris - main brand color
    SECONDARY: '#107778',     // Myrtle Green - secondary actions/accent
    ACCENT: '#74F269',        // Screamin Green - highlights, success states
    
    // UI Colors
    BACKGROUND: '#D3D4D9',    // Platinum - background color
    CARD_BG: '#FFFFFF',       // White - for cards and content areas
    DARK: '#484877',          // Ultra Violet - text, headers
    
    // Functional Colors
    SUCCESS: '#74F269',       // Screamin Green - success messages
    ERROR: '#E74C3C',         // Red - error states (non-palette)
    WARNING: '#F39C12',       // Orange - warning states (non-palette)
    INFO: '#614EC1',          // Iris - informational states
    
    // Text Colors
    TEXT_PRIMARY: '#484877',  // Ultra Violet - primary text
    TEXT_SECONDARY: '#6C757D', // Gray - secondary text (non-palette)
    TEXT_LIGHT: '#FFFFFF',    // White - text on dark backgrounds
    
    // Border Colors
    BORDER: '#CED4DA',        // Light Gray - borders (non-palette)
    
    // Gradient
    GRADIENT_PRIMARY: ['#614EC1', '#484877'], // Iris to Ultra Violet
    GRADIENT_ACCENT: ['#74F269', '#107778'],  // Screamin Green to Myrtle Green
  };
  
  // Opacity variants for colors
  export const withOpacity = (color, opacity) => {
    // Convert hex to rgba
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return color;
  };