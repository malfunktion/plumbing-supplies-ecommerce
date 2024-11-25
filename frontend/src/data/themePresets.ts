import { ThemeDocument } from '../../../backend/src/models/theme';

export const themePresets: Partial<ThemeDocument>[] = [
  {
    name: 'Modern Light',
    description: 'Clean and minimal light theme with modern accents',
    colors: {
      primary: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e'
      },
      background: {
        default: '#ffffff',
        paper: '#f8fafc',
        input: '#ffffff'
      },
      text: {
        primary: '#0f172a',
        secondary: '#475569',
        onPrimary: '#ffffff'
      },
      border: {
        default: '#e2e8f0',
        focus: '#0ea5e9'
      },
      accent: {
        default: '#8b5cf6',
        light: '#a78bfa',
        dark: '#6d28d9'
      },
      success: {
        default: '#10b981',
        light: '#34d399',
        dark: '#059669'
      },
      warning: {
        default: '#f59e0b',
        light: '#fbbf24',
        dark: '#d97706'
      },
      error: {
        default: '#ef4444',
        light: '#f87171',
        dark: '#dc2626'
      },
      surface: {
        default: '#ffffff',
        raised: '#f8fafc'
      }
    },
    layout: {
      containerPadding: '1.5rem',
      headerHeight: '4rem',
      sidebarWidth: '16rem',
      borderRadius: {
        small: '0.25rem',
        default: '0.375rem',
        large: '0.5rem',
        full: '9999px'
      },
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem'
      },
      breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px'
      },
      maxWidth: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px'
      },
      gridColumns: 12,
      gridGap: '1rem'
    },
    typography: {
      fontFamily: {
        sans: 'Inter, system-ui, -apple-system, sans-serif',
        serif: 'Merriweather, Georgia, serif',
        mono: 'JetBrains Mono, monospace',
        display: 'Montserrat, sans-serif'
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem'
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      },
      lineHeight: {
        none: 1,
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75
      },
      letterSpacing: {
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em'
      }
    },
    effects: {
      shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        default: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
      },
      transitions: {
        duration: {
          fast: '150ms',
          default: '200ms',
          slow: '300ms'
        },
        easing: {
          default: 'cubic-bezier(0.4, 0, 0.2, 1)',
          linear: 'linear',
          in: 'cubic-bezier(0.4, 0, 1, 1)',
          out: 'cubic-bezier(0, 0, 0.2, 1)'
        }
      },
      opacity: {
        0: 0,
        25: 0.25,
        50: 0.5,
        75: 0.75,
        100: 1
      },
      blur: {
        none: '0',
        sm: '4px',
        default: '8px',
        lg: '12px'
      }
    },
    components: {
      button: {
        padding: {
          small: '0.5rem 1rem',
          default: '0.75rem 1.5rem',
          large: '1rem 2rem'
        },
        borderRadius: {
          small: '0.25rem',
          default: '0.375rem',
          large: '0.5rem',
          full: '9999px'
        },
        fontSize: {
          small: '0.875rem',
          default: '1rem',
          large: '1.125rem'
        },
        fontWeight: 500
      },
      input: {
        padding: {
          small: '0.5rem',
          default: '0.75rem',
          large: '1rem'
        },
        borderRadius: {
          small: '0.25rem',
          default: '0.375rem',
          large: '0.5rem'
        },
        fontSize: {
          small: '0.875rem',
          default: '1rem',
          large: '1.125rem'
        },
        borderWidth: '1px'
      },
      card: {
        padding: {
          small: '1rem',
          default: '1.5rem',
          large: '2rem'
        },
        borderRadius: {
          small: '0.25rem',
          default: '0.375rem',
          large: '0.5rem'
        },
        shadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
      },
      modal: {
        padding: {
          small: '1rem',
          default: '1.5rem',
          large: '2rem'
        },
        borderRadius: '0.5rem',
        shadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        backdrop: 'rgba(0, 0, 0, 0.5)'
      }
    }
  },
  {
    name: 'Dark Professional',
    description: 'Professional dark theme with high contrast and readability',
    colors: {
      primary: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e'
      },
      background: {
        default: '#1a1a1a',
        paper: '#2d2d2d',
        input: '#262626'
      },
      text: {
        primary: '#ffffff',
        secondary: '#a3a3a3',
        onPrimary: '#ffffff'
      },
      border: {
        default: '#404040',
        focus: '#0ea5e9'
      },
      accent: {
        default: '#8b5cf6',
        light: '#a78bfa',
        dark: '#6d28d9'
      },
      success: {
        default: '#10b981',
        light: '#34d399',
        dark: '#059669'
      },
      warning: {
        default: '#f59e0b',
        light: '#fbbf24',
        dark: '#d97706'
      },
      error: {
        default: '#ef4444',
        light: '#f87171',
        dark: '#dc2626'
      },
      surface: {
        default: '#2d2d2d',
        raised: '#404040'
      }
    },
    effects: {
      shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
        default: '0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)'
      }
    }
  },
  {
    name: 'Nature Fresh',
    description: 'Fresh and natural theme inspired by nature',
    colors: {
      primary: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d'
      },
      background: {
        default: '#ffffff',
        paper: '#f8faf8',
        input: '#ffffff'
      },
      text: {
        primary: '#1e293b',
        secondary: '#475569',
        onPrimary: '#ffffff'
      },
      accent: {
        default: '#eab308',
        light: '#facc15',
        dark: '#ca8a04'
      }
    },
    typography: {
      fontFamily: {
        sans: 'Quicksand, sans-serif',
        serif: 'Lora, serif',
        mono: 'Fira Code, monospace',
        display: 'Playfair Display, serif'
      }
    }
  }
];
