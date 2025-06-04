
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontSize: {
        '15px': '15px',
        '22px': '1.375rem', // 22px
      },
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        headline: ['Inter', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))', // #4B5DA9
          foreground: 'hsl(var(--primary-foreground))',
          dark: '#3D4A85',
          'light-accent': '#5B6BC4',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))', // #00B0CC
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))', // #64748B
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))', // #00B0CC (same as secondary)
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))', // #9DC3E6
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        'slate-100': '#f1f5f9',
        'slate-200': '#E2E8F0',
        'welcome-gradient-from': '#667eea',
        'welcome-gradient-to': '#764ba2',
        'page-gradient-from': '#667eea',
        'page-gradient-to': '#764ba2',
        'send-button-gradient-from': 'hsl(var(--secondary))', // #00B0CC
        'send-button-gradient-to': '#0891B2', // Darker teal for gradient
        'glass-card-bg': 'rgba(255,255,255,0.95)',
        'glass-card-border': 'rgba(255,255,255,0.2)',
        'glass-input-bg': 'rgba(255,255,255,0.9)',
        'red-500': '#ef4444',
        'violet-500': '#8b5cf6',
        'teal-600': '#0891b2', // For send button gradient
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        'xl': '0.75rem',
        '2xl': '1.5rem',
        '3xl': '2rem', // 32px
      },
      boxShadow: {
        'chat-ai': '0 2px 12px rgba(0,0,0,0.08)',
        'up-md': '0 -4px 15px rgba(0, 0, 0, 0.05)', // Enhanced for input wrapper
        'welcome-card': '0 20px 60px rgba(0, 0, 0, 0.08)', // Kept from previous, might need adjustment
        'action-card': '0 4px 20px rgba(0, 0, 0, 0.06)', // Kept from previous
        'action-card-hover': '0 8px 30px rgba(0, 0, 0, 0.1)', // Kept from previous
        'xl': '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
        // Premium Shadows
        'glass-card': '0 32px 80px rgba(0,0,0,0.1)',
        'action-card-premium': '0 8px 32px rgba(0,0,0,0.08)',
        'action-card-premium-hover': '0 16px 48px rgba(0,0,0,0.15)',
        'input-premium': '0 4px 20px rgba(0,0,0,0.05)',
        'send-button-premium': '0 4px 16px rgba(0, 176, 204, 0.3)',
        'text-hero': '0 2px 4px rgba(0,0,0,0.1)', // For text-shadow (requires plugin or custom utility)
      },
      letterSpacing: {
        '-0.03em': '-0.03em',
      },
      lineHeight: {
        'extra-tight': '1.1',
      },
      transitionTimingFunction: {
        'premium-ease': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'dot-pulse-before': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%, 100%': { transform: 'scale(0.5)', opacity: '0.5' },
        },
        'dot-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(0.5)', opacity: '0.5' },
        },
        'dot-pulse-after': {
          '0%': { transform: 'scale(0.5)', opacity: '0.5' },
          '50%, 100%': { transform: 'scale(1)', opacity: '1' },
        },
        'subtle-glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 2px 0px rgba(52, 211, 153, 0.6)' },
          '50%': { boxShadow: '0 0 8px 3px rgba(52, 211, 153, 0.3)' },
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'dot-pulse-before': 'dot-pulse-before 1.2s infinite ease-in-out',
        'dot-pulse': 'dot-pulse 1.2s infinite ease-in-out',
        'dot-pulse-after': 'dot-pulse-after 1.2s infinite ease-in-out',
        'subtle-glow-pulse': 'subtle-glow-pulse 1.5s infinite ease-in-out alternate',
      },
      backdropBlur: {
        xl: '20px',
      }
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
