/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        geist: ['var(--font-geist)', 'sans-serif'],
        kelson: ['var(--font-kelson)', 'sans-serif'],
        syne: ['var(--font-kelson)', 'sans-serif'],
      },
      colors: {
        'brand': {
          DEFAULT: '#822433', // Sapienza Burgundy
          dark: '#6b1d28',
          light: '#a34252',
        },
        'void': '#0a0808', // Tinted Deep Black
        'carbon': '#141212', // Tinted Secondary Dark
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 0.12s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.800'),
            'h1, h2, h3, h4': {
              color: theme('colors.brand.dark'),
              fontWeight: '600',
            },
            p: { lineHeight: '1.75' },
            a: {
              color: theme('colors.brand.DEFAULT'),
              fontWeight: '500',
              textDecoration: 'none',
              transition: 'color 0.3s ease-in-out',
              '&:hover': {
                color: theme('colors.brand.light'),
                textDecoration: 'underline',
              },
            },
            strong: { color: theme('colors.brand.dark') },
            blockquote: {
              borderLeftColor: theme('colors.brand.light'),
              color: theme('colors.gray.600'),
              fontStyle: 'italic',
              paddingLeft: theme('spacing.4'),
              'p:first-of-type::before': { content: '""' },
              'p:last-of-type::after': { content: '""' },
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            code: {
              color: theme('colors.brand.DEFAULT'),
              backgroundColor: theme('colors.gray.100'),
              padding: '0.2em 0.4em',
              borderRadius: theme('borderRadius.md'),
              fontWeight: '400',
            },
            pre: {
              backgroundColor: '#1f2937',
              color: theme('colors.gray.100'),
              padding: theme('spacing.4'),
              borderRadius: theme('borderRadius.lg'),
              overflowX: 'auto',
            },
            'pre code': {
              backgroundColor: 'transparent',
              color: 'inherit',
              padding: '0',
              fontWeight: 'inherit',
              borderRadius: '0',
            },
            ul: { listStyleType: 'disc', paddingLeft: '1.625em' },
            ol: { listStyleType: 'decimal', paddingLeft: '1.625em' },
            img: {
              borderRadius: theme('borderRadius.lg'),
              boxShadow: theme('boxShadow.sm'),
              marginTop: theme('spacing.6'),
              marginBottom: theme('spacing.6'),
            },
            'figure figcaption': {
              color: theme('colors.gray.500'),
              textAlign: 'center',
              fontSize: theme('fontSize.sm'),
              marginTop: theme('spacing.2'),
            },
          },
        },
        lg: {
          css: {
            p: { lineHeight: '1.8' },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography') // Ensure plugin is included
  ],
};