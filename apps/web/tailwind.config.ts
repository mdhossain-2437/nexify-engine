import type { Config } from 'tailwindcss'

/** Build a Tailwind color value that resolves to a CSS variable plus
 *  Tailwind's `<alpha-value>` placeholder so opacity modifiers work. */
const withAlpha = (variable: string) => `rgb(var(${variable}) / <alpha-value>)`

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: withAlpha('--color-primary-rgb'),
        secondary: withAlpha('--color-secondary-rgb'),
      },
      fontFamily: {
        sans: ['var(--font-family)', 'Inter', 'system-ui', 'sans-serif'],
      },
      typography: () => ({
        DEFAULT: {
          css: {
            '--tw-prose-links': 'rgb(var(--color-primary-rgb))',
            a: { textDecoration: 'underline' },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
