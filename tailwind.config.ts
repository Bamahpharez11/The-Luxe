import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-cormorant)', 'serif'],
        body: ['var(--font-jost)', 'sans-serif'],
      },
      colors: {
        gold: {
          50:  '#fdf8ef',
          100: '#f9edcf',
          200: '#f2d89a',
          300: '#e8bf5e',
          400: '#dea635',
          500: '#c9891d',
          600: '#a96b14',
          700: '#874f12',
          800: '#6e4016',
          900: '#5c3515',
        },
        cream: {
          50:  '#fdfbf7',
          100: '#faf5eb',
          200: '#f4e9d1',
          300: '#ead6ae',
          400: '#dabe85',
          500: '#cba45e',
        },
        dark: {
          900: '#1a1209',
          800: '#231808',
          700: '#2e2010',
        }
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #c9891d 0%, #e8bf5e 50%, #c9891d 100%)',
        'dark-gradient': 'linear-gradient(180deg, #1a1209 0%, #2e2010 100%)',
      },
    },
  },
  plugins: [],
}
export default config
