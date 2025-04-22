import { defineVuesticConfig } from 'vuestic-ui'
import iconsConfig from './icons-config/icons-config'
import colors from './themes'

export default defineVuesticConfig({
  colors,
  icons: iconsConfig,
  breakpoint: {
    enabled: true,
    bodyClass: true,
    thresholds: {
      xs: 0,
      sm: 320,
      md: 640,
      lg: 1024,
      xl: 1440,
    },
  },
  components: {
    VaModal: {
      color: 'background-element',
      class: 'shadow-neumorphism !rounded-lg',
    },
    VaButton: {
      background: 'background-element',
      class: 'shadow-neumorphism rounded-lg',
      rounded: 'medium',
    },
    vaButtonToggle: {
      background: 'background-element',
    },
    VaCard: {
      class: 'shadow-neumorphism',
    },
    VaIcon: {
      sizesConfig: {
        defaultSize: 19,
        sizes: { small: 14, medium: 19, large: 26 },
      },
    },
    VaDataTable: {
      pagination: {
        itemsPerPageOptions: [5, 10, 25, 50, 100],
      },
      class: 'shadow-neumorphism rounded-lg',
    },
    VaForm: {
      class: 'shadow-neumorphism rounded-lg p-4',
    },
    VaSidebar: {
      class: 'shadow-neumorphism rounded-lg m-4',
    }
  },
})
