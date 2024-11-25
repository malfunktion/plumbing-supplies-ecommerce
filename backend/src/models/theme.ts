import mongoose, { Document, Schema } from 'mongoose';

export interface ThemeColors {
  primary: Record<string, string>;
  background: Record<string, string>;
  text: Record<string, string>;
  border: Record<string, string>;
  accent: Record<string, string>;
  success: Record<string, string>;
  warning: Record<string, string>;
  error: Record<string, string>;
  info: Record<string, string>;
  surface: Record<string, string>;
}

export interface ThemeLayout {
  containerPadding: string;
  headerHeight: string;
  sidebarWidth: string;
  borderRadius: Record<string, string>;
  spacing: Record<string, string>;
  breakpoints: Record<string, string>;
  maxWidth: Record<string, string>;
  gridColumns: number;
  gridGap: string;
}

export interface ThemeTypography {
  fontFamily: {
    sans: string;
    mono: string;
    serif: string;
    display: string;
  };
  fontSize: Record<string, string>;
  fontWeight: Record<string, number>;
  lineHeight: Record<string, number | string>;
  letterSpacing: Record<string, string>;
  textTransform: Record<string, string>;
}

export interface ThemeEffects {
  shadows: Record<string, string>;
  transitions: {
    duration: Record<string, string>;
    easing: Record<string, string>;
  };
  opacity: Record<string, number>;
  blur: Record<string, string>;
}

export interface ThemeComponents {
  button: {
    padding: Record<string, string>;
    borderRadius: Record<string, string>;
    fontSize: Record<string, string>;
    fontWeight: number;
  };
  input: {
    padding: Record<string, string>;
    borderRadius: Record<string, string>;
    fontSize: Record<string, string>;
    borderWidth: string;
  };
  card: {
    padding: Record<string, string>;
    borderRadius: Record<string, string>;
    shadow: string;
  };
  modal: {
    padding: Record<string, string>;
    borderRadius: string;
    shadow: string;
    backdrop: string;
  };
}

export interface ThemePresets {
  name: string;
  description: string;
  preview: string;
}

export interface ThemeDocument extends Document {
  _id: string;
  userId: string;
  name: string;
  isDefault: boolean;
  colors: ThemeColors;
  layout: ThemeLayout;
  typography: ThemeTypography;
  effects: ThemeEffects;
  components: ThemeComponents;
  presets: ThemePresets[];
  createdAt: Date;
  updatedAt: Date;
}

const themeSchema = new Schema<ThemeDocument>({
  _id: { type: String },
  userId: { type: String, required: true },
  name: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  colors: {
    primary: {
      type: Object,
      default: {
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
      }
    },
    background: {
      type: Object,
      default: {
        primary: '#ffffff',
        secondary: '#f8fafc',
        tertiary: '#f1f5f9'
      }
    },
    text: {
      type: Object,
      default: {
        primary: '#0f172a',
        secondary: '#475569',
        tertiary: '#94a3b8'
      }
    },
    border: {
      type: Object,
      default: {
        light: '#e2e8f0',
        medium: '#cbd5e1',
        dark: '#94a3b8'
      }
    },
    accent: {
      type: Object,
      default: {}
    },
    success: {
      type: Object,
      default: {}
    },
    warning: {
      type: Object,
      default: {}
    },
    error: {
      type: Object,
      default: {}
    },
    info: {
      type: Object,
      default: {}
    },
    surface: {
      type: Object,
      default: {}
    }
  },
  layout: {
    containerPadding: { type: String, default: '1.5rem' },
    headerHeight: { type: String, default: '4rem' },
    sidebarWidth: { type: String, default: '16rem' },
    borderRadius: {
      type: Object,
      default: {
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        full: '9999px'
      }
    },
    spacing: {
      type: Object,
      default: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem'
      }
    },
    breakpoints: {
      type: Object,
      default: {}
    },
    maxWidth: {
      type: Object,
      default: {}
    },
    gridColumns: { type: Number, default: 12 },
    gridGap: { type: String, default: '1rem' }
  },
  typography: {
    fontFamily: {
      sans: { 
        type: String, 
        default: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' 
      },
      mono: { 
        type: String, 
        default: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' 
      },
      serif: { type: String, default: '' },
      display: { type: String, default: '' }
    },
    fontSize: {
      type: Object,
      default: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem'
      }
    },
    fontWeight: {
      type: Object,
      default: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      }
    },
    lineHeight: {
      type: Object,
      default: {}
    },
    letterSpacing: {
      type: Object,
      default: {}
    },
    textTransform: {
      type: Object,
      default: {}
    }
  },
  effects: {
    shadows: {
      type: Object,
      default: {}
    },
    transitions: {
      duration: {
        type: Object,
        default: {}
      },
      easing: {
        type: Object,
        default: {}
      }
    },
    opacity: {
      type: Object,
      default: {}
    },
    blur: {
      type: Object,
      default: {}
    }
  },
  components: {
    button: {
      padding: {
        type: Object,
        default: {}
      },
      borderRadius: {
        type: Object,
        default: {}
      },
      fontSize: {
        type: Object,
        default: {}
      },
      fontWeight: { type: Number, default: 400 }
    },
    input: {
      padding: {
        type: Object,
        default: {}
      },
      borderRadius: {
        type: Object,
        default: {}
      },
      fontSize: {
        type: Object,
        default: {}
      },
      borderWidth: { type: String, default: '1px' }
    },
    card: {
      padding: {
        type: Object,
        default: {}
      },
      borderRadius: {
        type: Object,
        default: {}
      },
      shadow: { type: String, default: '' }
    },
    modal: {
      padding: {
        type: Object,
        default: {}
      },
      borderRadius: { type: String, default: '' },
      shadow: { type: String, default: '' },
      backdrop: { type: String, default: '' }
    }
  },
  presets: [{ type: Schema.Types.Mixed }]
}, {
  timestamps: true
});

export const Theme = mongoose.model<ThemeDocument>('Theme', themeSchema);
