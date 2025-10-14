// Kavak Crédito Brand Colors
export const KAVAK_COLORS = {
  // Primary Brand Colors
  primary: {
    blue: '#2E5BFF',      // Kavak Blue (main brand color)
    teal: '#00D4AA',      // Kavak Teal/Cyan (secondary)
    green: '#00D4AA',     // "CRÉDITO" green
  },
  
  // Neutral Colors
  neutral: {
    dark: '#1A1D29',      // Dark background
    gray: '#6B7280',      // Gray text
    lightGray: '#F3F4F6', // Light backgrounds
    white: '#FFFFFF',
  },
  
  // Status Colors
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  
  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #2E5BFF 0%, #00D4AA 100%)',
    card: 'linear-gradient(135deg, rgba(46, 91, 255, 0.1) 0%, rgba(0, 212, 170, 0.1) 100%)',
  }
} as const;

export type KavakColorKey = keyof typeof KAVAK_COLORS;

