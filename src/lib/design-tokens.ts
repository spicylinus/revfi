export type DesignStyle =
  | 'minimalism'
  | 'brutalism'
  | 'neobrutalism'
  | 'constructivism'
  | 'swiss'
  | 'editorial'
  | 'hand-drawn'
  | 'retro'
  | 'flat'
  | 'bento'

export interface StylePresetTokens {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    surfaceMuted: string
    border: string
    text: string
    textMuted: string
  }
  typography: {
    fontSans: string
    fontDisplay: string
    fontMono: string
  }
  radii: {
    sm: string
    base: string
    lg: string
    xl: string
  }
  shadows: {
    sm: string
    base: string
    lg: string
  }
}

export interface DesignTokens {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    surfaceMuted: string
    border: string
    text: string
    textMuted: string
  }
  typography: {
    fontSans: string
    fontDisplay: string
    fontMono: string
    scaleBase: number    // px
    scaleRatio: number   // e.g. 1.25 = major third
  }
  spacing: {
    unit: number         // base unit in px (typically 4)
    scale: number[]      // multiples: [0,1,2,4,8,12,16,24,32,48,64]
  }
  radii: {
    sm: string
    base: string
    lg: string
    xl: string
    full: string
  }
  shadows: {
    sm: string
    base: string
    lg: string
  }
}
