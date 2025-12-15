/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom V2.0 Colors
      fontFamily: {
        geist: ['var(--font-geist)', 'sans-serif'],
        kelson: ['var(--font-kelson)', 'sans-serif'], // Keep kelson just in case, or replace? User hates it? Let's alias 'syne' to 'kelson' class if we want quick swap, or better: make a new 'syne' class and replace usage.
        syne: ['var(--font-syne)', 'sans-serif'],
      },
      colors: {
        'brand': {
          DEFAULT: '#822433', // Sapienza Burgundy
          dark: '#6b1d28',
          light: '#a34252',
        },
        'void': '#050505', // Deep Black
        'carbon': '#171717', // Secondary Dark
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      typography: (theme) => ({ // Use the theme function for consistency
        DEFAULT: {
          css: {
            // Base text color
            color: theme('colors.gray.800'), // Changed from default black for softer look

            // Headings - Using a slightly darker shade for better hierarchy
            'h1, h2, h3, h4': {
              color: '#6b1d28', // Darker shade of your primary color
              fontWeight: '600', // Ensure consistent weight
            },

            // Paragraphs - Added line-height for readability
            p: {
              lineHeight: '1.75',
            },

            // Links - Combining your color with enhanced styles
            a: {
              color: '#822433', // Your primary color
              fontWeight: '500',
              textDecoration: 'none', // Remove underline by default
              transition: 'color 0.3s ease-in-out',
              '&:hover': {
                color: '#a34252', // Lighter/brighter accent for hover
                textDecoration: 'underline', // Add underline on hover
              },
            },

            // Strong - Using the darker heading color for emphasis
            strong: {
              color: '#6b1d28', // Consistent with headings
            },

            // Blockquotes - Added styling
            blockquote: {
              borderLeftColor: '#a34252', // Accent color for border
              color: theme('colors.gray.600'),
              fontStyle: 'italic',
              paddingLeft: theme('spacing.4'),
              // Keep your rules to remove default paragraph quotes inside blockquotes
              'p:first-of-type::before': { content: '""' },
              'p:last-of-type::after': { content: '""' },
            },

            // Code - Inline
            'code::before': { content: '""' }, // Keep removing default quotes
            'code::after': { content: '""' }, // Keep removing default quotes
            code: {
              color: '#822433', // Your primary color for text
              backgroundColor: theme('colors.gray.100'), // Light background
              padding: '0.2em 0.4em', // Use em for relative padding
              borderRadius: theme('borderRadius.md'),
              fontWeight: '400', // Normal weight for inline code
            },

            // Code Blocks
            pre: {
              backgroundColor: '#1f2937', // Your chosen dark background
              color: theme('colors.gray.100'), // Light text color
              padding: theme('spacing.4'),
              borderRadius: theme('borderRadius.lg'), // Slightly larger radius
              overflowX: 'auto',
            },
            'pre code': {
              // Reset styles for code within pre blocks
              backgroundColor: 'transparent',
              color: 'inherit',
              padding: '0',
              fontWeight: 'inherit', // Inherit weight from pre
              borderRadius: '0', // No radius inside pre
            },

            // Lists - Keep your definitions
            ul: { listStyleType: 'disc', paddingLeft: '1.625em' }, // Added standard padding
            ol: { listStyleType: 'decimal', paddingLeft: '1.625em' }, // Added standard padding

            // Images within prose - Added default styling
            img: {
              borderRadius: theme('borderRadius.lg'),
              boxShadow: theme('boxShadow.sm'),
              marginTop: theme('spacing.6'),
              marginBottom: theme('spacing.6'),
            },

            // Figure Captions - Added styling
            'figure figcaption': {
              color: theme('colors.gray.500'),
              textAlign: 'center',
              fontSize: theme('fontSize.sm'),
              marginTop: theme('spacing.2'),
            },
          },
        },
        // Specific styles for prose-lg if needed (example)
        lg: {
          css: {
            p: {
              lineHeight: '1.8', // Slightly more line height for larger text
            },
            // Add other lg-specific overrides here if you use prose-lg
            // Example:
            // h1: { fontSize: theme('fontSize.4xl') },
            // h2: { fontSize: theme('fontSize.3xl') },
          }
        }
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography') // Ensure plugin is included
  ],
};