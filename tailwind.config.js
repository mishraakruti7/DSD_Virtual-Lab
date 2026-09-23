/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Base bright white & warm white palette (Vivid Circuit Lab)
        cream: {
          base: '#FFFFFF',
          paper: '#FFFCF7',
          card: '#FFFFFF',
          soft: '#F9F8F3',
          muted: '#F0ECE1',
          border: '#EAE5D8',
          100: '#F9F8F3',
          200: '#F0ECE1',
          300: '#E4DFD0',
          400: '#D5CFBD',
        },
        // Signature Primary Brand Gradient & Solid Indigo (#4F46E5 -> #9333EA -> #EC4899)
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#4F46E5', // Vivid Indigo
          600: '#4338CA',
          700: '#3730A3',
          800: '#312E81',
          900: '#1E1B4B',
          start: '#4F46E5', // Indigo
          mid: '#9333EA',   // Purple
          end: '#EC4899',   // Magenta / Pink
          accent: '#A855F7',
        },
        // Module 1 (Sequential Circuits): Vivid Coral-Red
        mod1: {
          DEFAULT: '#FF4D5E',
          vivid: '#FF4D5E',
          light: '#FFE5E8',
          wash: '#FFF0F2',
          soft: '#FFF5F6',
          border: '#FF4D5E',
          hover: '#E63946',
          text: '#D91B33',
          dark: '#C9182B',
        },
        // Module 2 (Logic Families & PLDs): Bold Amber-Orange
        mod2: {
          DEFAULT: '#FF9F1C',
          vivid: '#FF9F1C',
          light: '#FFF0D9',
          wash: '#FFF8EB',
          soft: '#FFF9ED',
          border: '#FF9F1C',
          hover: '#F58A07',
          text: '#B45309',
          dark: '#B45309',
        },
        // Module 3 (FSM & ASM): Saturated Emerald-Teal
        mod3: {
          DEFAULT: '#10B981',
          vivid: '#10B981',
          light: '#DCFCE7',
          wash: '#EDFCF6',
          soft: '#F0FDF4',
          border: '#10B981',
          hover: '#059669',
          text: '#047857',
          dark: '#047857',
        },
        // Module 4 (Verilog HDL): Rich Violet-Purple
        mod4: {
          DEFAULT: '#8B5CF6',
          vivid: '#8B5CF6',
          light: '#EDE9FE',
          wash: '#F5F3FF',
          soft: '#F7F5FF',
          border: '#8B5CF6',
          hover: '#7C3AED',
          text: '#6D28D9',
          dark: '#6D28D9',
        },
        // Secondary Status Colors (bold, not pastel)
        status: {
          success: '#22C55E',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#0EA5E9',
        },
        // Dark Mode: Warm Charcoal (not dark navy)
        darklab: {
          base: '#0F0F17',
          card: '#181824',
          surface: '#222332',
          border: '#2E3044',
          subtle: '#3B3E56',
          text: '#F3F4F6',
          muted: '#9CA3AF',
        },
        // Solid & Readable Charcoal Typography
        ink: {
          DEFAULT: '#1E1E28',
          900: '#1E1E28',
          800: '#2B2B38',
          700: '#454558',
          600: '#5C5E6E',
          500: '#7E8092',
          400: '#A1A3B5',
        },
        // Backward compatibility mappings
        canvas: {
          paper: '#FFFFFF',
          cream: '#FFFCF7',
          warm: '#F9F8F3',
          card: '#FFFFFF',
          subtle: '#F0ECE1',
        },
        border: {
          warm: '#EAE5D8',
          subtle: '#F0ECE1',
          darker: '#D5CFBD',
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        heading: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        ui: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'display-2xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.04em', fontWeight: '800' }], // 72px
        'display-xl': ['3.5rem', { lineHeight: '1.08', letterSpacing: '-0.035em', fontWeight: '800' }], // 56px
        'heading-1': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.025em', fontWeight: '800' }], // 40px
        'heading-2': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],    // 32px
        'heading-3': ['1.5rem', { lineHeight: '1.25', letterSpacing: '-0.015em', fontWeight: '700' }], // 24px
        'body-lg': ['1.125rem', { lineHeight: '1.65', letterSpacing: '-0.01em', fontWeight: '400' }],
        'body': ['0.9375rem', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '400' }],
        'body-sm': ['0.8125rem', { lineHeight: '1.55', letterSpacing: '0', fontWeight: '400' }],
        'label': ['0.75rem', { lineHeight: '1.3', letterSpacing: '0.06em', fontWeight: '700' }],       // Tracked uppercase
        'code': ['0.8125rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '500' }],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(30, 30, 40, 0.06)',
        'soft-md': '0 8px 20px -4px rgba(30, 30, 40, 0.08)',
        'soft-lg': '0 16px 32px -6px rgba(30, 30, 40, 0.12)',
        'cream-sm': '0 4px 16px -2px rgba(30, 30, 40, 0.06)',
        // Color-drenched saturated shadows for buttons and cards
        'brand': '0 6px 22px -2px rgba(79, 70, 229, 0.38)',
        'brand-sm': '0 4px 14px 0 rgba(79, 70, 229, 0.28)',
        'brand-md': '0 8px 26px 0 rgba(79, 70, 229, 0.35)',
        'coral': '0 6px 20px -2px rgba(255, 77, 94, 0.35)',
        'coral-sm': '0 4px 14px 0 rgba(255, 77, 94, 0.25)',
        'amber': '0 6px 20px -2px rgba(255, 159, 28, 0.35)',
        'amber-sm': '0 4px 14px 0 rgba(255, 159, 28, 0.25)',
        'teal': '0 6px 20px -2px rgba(16, 185, 129, 0.35)',
        'teal-sm': '0 4px 14px 0 rgba(16, 185, 129, 0.25)',
        'violet': '0 6px 20px -2px rgba(139, 92, 246, 0.35)',
        'violet-sm': '0 4px 14px 0 rgba(139, 92, 246, 0.25)',
        'rose': '0 6px 20px -2px rgba(244, 63, 94, 0.35)',
        'sky': '0 6px 20px -2px rgba(14, 165, 233, 0.35)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
};
