import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,vue,jsx,tsx}',
    './app/**/*.{js,ts,vue,jsx,tsx}',
    './components/**/*.{js,ts,vue,jsx,tsx}'
  ],
  theme: {
    extend: {}
  },
  plugins: []
}

export default config
