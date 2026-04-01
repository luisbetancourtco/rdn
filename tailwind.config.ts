import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif'],
      },
      colors: {
        md: {
          primary: '#1565C0',
          'on-primary': '#FFFFFF',
          'primary-container': '#D1E4FF',
          'on-primary-container': '#001D36',
          secondary: '#545F71',
          'on-secondary': '#FFFFFF',
          'secondary-container': '#D7E3F8',
          'on-secondary-container': '#101C2B',
          tertiary: '#6E5676',
          'on-tertiary': '#FFFFFF',
          'tertiary-container': '#F7D8FF',
          surface: '#F8F9FF',
          'surface-dim': '#D8DAE0',
          'surface-container-lowest': '#FFFFFF',
          'surface-container-low': '#F2F3FA',
          'surface-container': '#ECEDF3',
          'surface-container-high': '#E6E8EE',
          'surface-container-highest': '#E1E2E8',
          'on-surface': '#191C20',
          'on-surface-variant': '#43474E',
          outline: '#73777F',
          'outline-variant': '#C3C6CF',
          error: '#BA1A1A',
          'error-container': '#FFDAD6',
          'on-error': '#FFFFFF',
          'on-error-container': '#410002',
          success: '#006D3B',
          'success-container': '#9AF6B5',
          'on-success-container': '#00210F',
          'inverse-surface': '#2E3036',
          'inverse-on-surface': '#EFF0F7',
        },
      },
      borderRadius: {
        'md-sm': '8px',
        'md-md': '12px',
        'md-lg': '16px',
        'md-xl': '28px',
      },
      boxShadow: {
        'md-1': '0 1px 2px 0 rgba(0,0,0,0.3), 0 1px 3px 1px rgba(0,0,0,0.15)',
        'md-2': '0 1px 2px 0 rgba(0,0,0,0.3), 0 2px 6px 2px rgba(0,0,0,0.15)',
        'md-3': '0 4px 8px 3px rgba(0,0,0,0.15), 0 1px 3px 0 rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [],
}

export default config
