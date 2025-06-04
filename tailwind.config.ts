
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
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          dark: '#3D4A85', 
          'light-accent': '#5B6BC4', 
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
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
        'slate-200': '#E2E8F0',
        'welcome-gradient-from': '#667eea',
        'welcome-gradient-to': '#764ba2',
        'blue-50': '#f0f4ff', // For page background gradient
        'indigo-100': '#e0e7ff', // For page background gradient
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        'xl': '0.75rem', // 12px, for action cards
        '2xl': '1.5rem', // 24px, for welcome card & input wrapper
      },
      boxShadow: {
        'chat-ai': '0 2px 12px rgba(0,0,0,0.08)',
        'up-md': '0 -2px 6px -1px rgba(0, 0, 0, 0.06), 0 -4px 4px -2px rgba(0, 0, 0, 0.03)',
        'welcome-card': '0 20px 60px rgba(0, 0, 0, 0.08)',
        'action-card': '0 4px 20px rgba(0, 0, 0, 0.06)',
        'action-card-hover': '0 8px 30px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)', // For input wrapper
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
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
