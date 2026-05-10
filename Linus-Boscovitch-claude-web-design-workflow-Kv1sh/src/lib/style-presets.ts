import type { DesignStyle, StylePresetTokens } from './design-tokens'

export type { DesignStyle, StylePresetTokens }

export const DESIGN_STYLE_NAMES: Record<DesignStyle, string> = {
  minimalism:     'Minimalism',
  brutalism:      'Brutalism',
  neobrutalism:   'Neobrutalism',
  constructivism: 'Constructivism',
  swiss:          'Swiss Style',
  editorial:      'Editorial Style',
  'hand-drawn':   'Hand-Drawn Style',
  retro:          'Retro',
  flat:           'Flat Design',
  bento:          'Bento Style',
}

export const DESIGN_STYLE_DESCRIPTIONS: Record<DesignStyle, string> = {
  minimalism:     'Emphasizes simplicity and functionality, using fewer elements to create a clean look.',
  brutalism:      'Features raw, unpolished designs that often include stark contrasts and unconventional layouts.',
  neobrutalism:   'A modern take on brutalism, incorporating bold colors and playful elements while maintaining a raw aesthetic.',
  constructivism: 'Focuses on geometric shapes and a structured layout, often with a strong emphasis on typography.',
  swiss:          'Known for its grid-based layout, clean lines, and a focus on typography and clarity.',
  editorial:      'Mimics traditional print layouts, using strong visuals and text to create a narrative flow.',
  'hand-drawn':   'Incorporates hand-drawn elements to add a personal touch and warmth to the design.',
  retro:          'Draws inspiration from past design trends, often using nostalgic colors and typography.',
  flat:           'Utilizes two-dimensional elements without gradients or textures, focusing on simplicity.',
  bento:          'Organizes content in a grid layout, similar to a bento box, allowing for a visually appealing arrangement.',
}

export const STYLE_PRESETS: Record<DesignStyle, StylePresetTokens> = {
  minimalism: {
    colors: {
      primary: '#171717', secondary: '#737373', accent: '#171717',
      background: '#fafafa', surface: '#ffffff', surfaceMuted: '#f5f5f5',
      border: '#e5e5e5', text: '#171717', textMuted: '#737373',
    },
    typography: { fontSans: 'Inter, system-ui', fontDisplay: 'Inter, system-ui', fontMono: 'JetBrains Mono, monospace' },
    radii: { sm: '0.125rem', base: '0.375rem', lg: '0.5rem', xl: '0.75rem' },
    shadows: { sm: '0 1px 2px 0 rgb(0 0 0 / 0.04)', base: '0 1px 3px 0 rgb(0 0 0 / 0.06)', lg: '0 4px 12px -2px rgb(0 0 0 / 0.08)' },
  },
  brutalism: {
    colors: {
      primary: '#000000', secondary: '#000000', accent: '#ff0000',
      background: '#ffffff', surface: '#f0f0f0', surfaceMuted: '#e0e0e0',
      border: '#000000', text: '#000000', textMuted: '#333333',
    },
    typography: { fontSans: 'Arial Black, Arial', fontDisplay: 'Impact, Arial Black', fontMono: 'Courier New, monospace' },
    radii: { sm: '0', base: '0', lg: '0', xl: '0' },
    shadows: { sm: '2px 2px 0 0 #000000', base: '4px 4px 0 0 #000000', lg: '6px 6px 0 0 #000000' },
  },
  neobrutalism: {
    colors: {
      primary: '#ff6b35', secondary: '#004e89', accent: '#ffd166',
      background: '#fffbf0', surface: '#ffffff', surfaceMuted: '#fff3cc',
      border: '#1a1a2e', text: '#1a1a2e', textMuted: '#4a4a6a',
    },
    typography: { fontSans: 'Space Grotesk, Inter', fontDisplay: 'Space Grotesk, Inter', fontMono: 'JetBrains Mono, monospace' },
    radii: { sm: '0', base: '0', lg: '0', xl: '0' },
    shadows: { sm: '3px 3px 0 0 #1a1a2e', base: '4px 4px 0 0 #1a1a2e', lg: '6px 6px 0 0 #1a1a2e' },
  },
  constructivism: {
    colors: {
      primary: '#cc0000', secondary: '#1a1a1a', accent: '#f5c518',
      background: '#f5f0e8', surface: '#ffffff', surfaceMuted: '#ede8dc',
      border: '#1a1a1a', text: '#1a1a1a', textMuted: '#4a4a4a',
    },
    typography: { fontSans: 'Oswald, Arial Narrow', fontDisplay: 'Oswald, Impact', fontMono: 'Courier New, monospace' },
    radii: { sm: '0', base: '0', lg: '0', xl: '0' },
    shadows: { sm: '1px 1px 0 0 #1a1a1a', base: '2px 2px 0 0 #1a1a1a', lg: '4px 4px 0 0 #cc0000' },
  },
  swiss: {
    colors: {
      primary: '#e60000', secondary: '#333333', accent: '#e60000',
      background: '#ffffff', surface: '#f9f9f9', surfaceMuted: '#f0f0f0',
      border: '#cccccc', text: '#000000', textMuted: '#666666',
    },
    typography: { fontSans: 'Helvetica Neue, Helvetica, Arial', fontDisplay: 'Helvetica Neue, Helvetica', fontMono: 'Courier New, monospace' },
    radii: { sm: '0', base: '0', lg: '0', xl: '0' },
    shadows: { sm: 'none', base: 'none', lg: '0 1px 0 0 #cccccc' },
  },
  editorial: {
    colors: {
      primary: '#0a0a0a', secondary: '#5c5c5c', accent: '#c8102e',
      background: '#fefefe', surface: '#f7f4ef', surfaceMuted: '#ede9e1',
      border: '#1a1a1a', text: '#0a0a0a', textMuted: '#5c5c5c',
    },
    typography: { fontSans: 'Libre Franklin, Franklin Gothic Medium', fontDisplay: 'Playfair Display, Georgia, serif', fontMono: 'Courier New, monospace' },
    radii: { sm: '0', base: '0', lg: '0', xl: '0' },
    shadows: { sm: 'none', base: 'none', lg: 'none' },
  },
  'hand-drawn': {
    colors: {
      primary: '#2d4a3e', secondary: '#7c6f5b', accent: '#e8845a',
      background: '#fdf8f0', surface: '#f5ede0', surfaceMuted: '#ecddc8',
      border: '#b8a898', text: '#2d2416', textMuted: '#7c6f5b',
    },
    typography: { fontSans: 'Caveat, Comic Sans MS, cursive', fontDisplay: 'Caveat, cursive', fontMono: 'Courier New, monospace' },
    radii: { sm: '0.5rem', base: '1rem', lg: '1.5rem', xl: '2rem' },
    shadows: { sm: '1px 2px 0 0 #b8a898', base: '2px 4px 0 0 #b8a898', lg: '3px 6px 0 0 #b8a898' },
  },
  retro: {
    colors: {
      primary: '#c0392b', secondary: '#8b7355', accent: '#f39c12',
      background: '#fdf6e3', surface: '#f5e6c8', surfaceMuted: '#e8d5a3',
      border: '#c9a87c', text: '#3d2b1a', textMuted: '#8b7355',
    },
    typography: { fontSans: 'Rockwell, Courier New, serif', fontDisplay: 'Rockwell, Georgia, serif', fontMono: 'Courier New, monospace' },
    radii: { sm: '0.25rem', base: '0.375rem', lg: '0.5rem', xl: '0.75rem' },
    shadows: { sm: '0 2px 0 0 #c9a87c', base: '0 3px 0 0 #c9a87c', lg: '0 5px 0 0 #8b7355' },
  },
  flat: {
    colors: {
      primary: '#3498db', secondary: '#95a5a6', accent: '#e74c3c',
      background: '#ecf0f1', surface: '#ffffff', surfaceMuted: '#dfe6e9',
      border: '#b2bec3', text: '#2d3436', textMuted: '#636e72',
    },
    typography: { fontSans: 'Nunito, Segoe UI', fontDisplay: 'Nunito, Segoe UI', fontMono: 'Source Code Pro, monospace' },
    radii: { sm: '0', base: '0', lg: '0', xl: '0' },
    shadows: { sm: 'none', base: 'none', lg: 'none' },
  },
  bento: {
    colors: {
      primary: '#6c63ff', secondary: '#48cae4', accent: '#f77f00',
      background: '#f0f0f0', surface: '#ffffff', surfaceMuted: '#e8e8ec',
      border: '#d4d4d8', text: '#18181b', textMuted: '#71717a',
    },
    typography: { fontSans: 'DM Sans, Inter', fontDisplay: 'DM Sans, Inter', fontMono: 'JetBrains Mono, monospace' },
    radii: { sm: '0.75rem', base: '1rem', lg: '1.5rem', xl: '2rem' },
    shadows: { sm: '0 2px 8px 0 rgb(0 0 0 / 0.06)', base: '0 4px 16px -2px rgb(0 0 0 / 0.1)', lg: '0 8px 32px -4px rgb(0 0 0 / 0.14)' },
  },
}
