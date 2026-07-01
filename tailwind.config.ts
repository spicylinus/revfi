import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette
        void:    '#0D0F12',
        cobalt:  '#1547E8',
        ember:   '#FF4D1C',
        white:   '#FFFFFF',
        frost:   '#EBF2FF',
        slate:   '#4A5568',
        // Semantic aliases
        primary:   '#1547E8',
        secondary: '#0D0F12',
        accent:    '#FF4D1C',
        warning:   '#FF4D1C',
        danger:    '#E05252',
        background:'#FFFFFF',
        surface:   '#FFFFFF',
        'surface-muted': '#EBF2FF',
        'text-primary':  '#0D0F12',
        'text-secondary':'#4A5568',
      },
      fontFamily: {
        sans:    ['DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono:    ['Space Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm:  '4px',
        DEFAULT: '8px',
        lg:  '12px',
        xl:  '16px',
        '2xl': '24px',
        '3xl': '40px',
      },
      boxShadow: {
        sm:   '0 1px 3px rgba(13,15,18,0.08)',
        base: '0 4px 16px rgba(13,15,18,0.10)',
        lg:   '0 16px 48px rgba(13,15,18,0.14)',
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter:  '-0.03em',
        tight:    '-0.02em',
        normal:   '0em',
        wide:     '0.05em',
        wider:    '0.1em',
        widest:   '0.2em',
      },
    },
  },
  plugins: [],
}

export default config
