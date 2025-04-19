// src/services/vuestic-ui/themes.ts
import type { VuesticColorsConfig } from 'vuestic-ui'

const colors: VuesticColorsConfig = {
  presets: {
    light: {
      primary: '#9747ff',
      secondary: '#fd7dfb',
      background: '#f5f5fa',
      backgroundPrimary: '#F5F5FA',
      backgroundSecondary: '#FFFFFF',
      backgroundCardPrimary: '#F5F5FA',
      backgroundCardSecondary: '#F5F5FA',
      success: '#228200',
      info: '#158DE3',
      danger: '#E42222',
      warning: '#FFD43A',
    },
    dark: {
      primary: '#9747ff',
      secondary: '#fd7dfb',
      background: '#0f172a',
      backgroundCardPrimary: '#111827',
      backgroundCardSecondary: '#0f172a',
    },
  },
  // Optionnel : variables accessibles partout
  variables: {
    'background-element': '#F5F5FA',
    'button-bg': '#9747ff',
    'button-text': '#fff',
  },
}

export default colors
