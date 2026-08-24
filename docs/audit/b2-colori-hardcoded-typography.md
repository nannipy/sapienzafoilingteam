# B2 — Colori hardcoded nel plugin Typography

**Severità:** 🔵 Best Practice  
**File coinvolti:**
- `tailwind.config.js` — sezione `typography`

---

## Problema

La configurazione del plugin `@tailwindcss/typography` usa valori hex hardcoded invece di referenziare i token del design system già definiti:

```js
// tailwind.config.js
typography: (theme) => ({
  DEFAULT: {
    css: {
      'h1, h2, h3, h4': {
        color: '#6b1d28', // ← hardcoded, dovrebbe essere theme('colors.brand.dark')
      },
      a: {
        color: '#822433', // ← hardcoded, dovrebbe essere theme('colors.brand.DEFAULT')
        '&:hover': {
          color: '#a34252', // ← hardcoded, dovrebbe essere theme('colors.brand.light')
        },
      },
      strong: {
        color: '#6b1d28', // ← ripetuto
      },
      blockquote: {
        borderLeftColor: '#a34252', // ← hardcoded
      },
      code: {
        color: '#822433', // ← ripetuto per la 4a volta
      },
    }
  }
})
```

Questo crea un problema di manutenibilità: se il colore brand cambia, bisogna aggiornare 6 posti invece di 1. È anche controintuitivo perché il callback `theme` è già disponibile per questo scopo.

---

## Fix

Sostituire tutti gli hex con chiamate a `theme()`:

```js
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

      strong: {
        color: theme('colors.brand.dark'),
      },

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
        backgroundColor: '#1f2937', // questo può restare: è un colore funzionale, non brand
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
```

---

## Beneficio

Da questo momento, cambiare `brand.DEFAULT` in `tailwind.config.js` aggiorna automaticamente anche gli stili della prosa nei blog post. Un solo punto di verità per il colore brand.

---

## Verifica

Cambiare temporaneamente `brand.DEFAULT` in un colore di test (es. `#0000ff`) e verificare che i link nei blog post cambino colore di conseguenza.
