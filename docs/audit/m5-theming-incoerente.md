# M5 — Theming doppio e incoerente

**Severità:** 🟢 Medium  
**File coinvolti:**
- `app/globals.css`
- `tailwind.config.js`
- Tutti i componenti

---

## Problema

Il progetto usa due sistemi di theming sovrapposti che non si parlano:

### Sistema 1 — CSS Variables in `globals.css`

```css
:root {
  --background: #fffcfd;
  --foreground: #1a1718;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0808;
    --foreground: #f8f6f7;
  }
}

body {
  color: var(--foreground);
  background: var(--background);
}
```

### Sistema 2 — Token Tailwind in `tailwind.config.js`

```js
colors: {
  'brand': { DEFAULT: '#822433', dark: '#6b1d28', light: '#a34252' },
  'void': '#0a0808',
  'carbon': '#141212',
}
```

I componenti usano quasi esclusivamente le classi Tailwind (`bg-void`, `bg-brand-dark`, `text-white`) e ignorano le CSS variables. Il dark mode da `prefers-color-scheme` cambia `--background` e `--foreground` ma questi colori non vengono quasi mai usati nei componenti — il `body` ha `bg-void` e `text-white` hardcoded via Tailwind, non via CSS vars.

Risultato: il dark mode automatico del browser non ha effetto visivo significativo perché i componenti usano colori fissi Tailwind, non le variabili CSS che cambierebbero.

---

## Fix — Scegliere un sistema e essere coerenti

### Raccomandazione: usare solo Tailwind

Il progetto usa Tailwind ovunque. La soluzione più pulita è estendere i token Tailwind per coprire i colori semantici (`background`, `foreground`) e rimuovere le CSS vars duplicate.

#### `tailwind.config.js` aggiornato

```js
colors: {
  'brand': {
    DEFAULT: '#822433',
    dark: '#6b1d28',
    light: '#a34252',
  },
  'void': '#0a0808',
  'carbon': '#141212',
  'background': 'var(--background)', // ponte tra CSS vars e Tailwind
  'foreground': 'var(--foreground)',
},
```

#### `globals.css` — semplificato

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #fffcfd;
  --foreground: #1a1718;
}

/* Dark mode: se si vuole supportarlo nel futuro */
@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0808;
    --foreground: #f8f6f7;
  }
}
```

Questo approccio consente di usare `bg-background` e `text-foreground` nei componenti, e le variabili si aggiornano automaticamente col dark mode del sistema.

---

## Decisione da prendere: si vuole supportare il dark mode?

Il sito attuale ha uno stile prevalentemente scuro (`bg-void`, sfondi neri). Se il dark mode non è un requisito:

1. **Rimuovere il blocco `@media (prefers-color-scheme: dark)`** da `globals.css` — evita comportamenti inattesi su sistemi con dark mode attivo.
2. **Rimuovere `--background` e `--foreground`** — non servono se i colori sono fissi.
3. Tenere solo i token Tailwind custom.

Se invece si vuole supportarlo in futuro:
1. Mappare tutti i colori dell'app a token semantici (`surface`, `surface-raised`, `text-primary`, `text-muted`).
2. Definire i valori per light e dark in CSS vars.
3. Usare solo classi Tailwind che referenziano queste vars.

---

## Verifica

Dopo aver scelto un sistema, verificare:
1. Nessun colore hardcoded `#822433`, `#6b1d28` nei className (devono usare `brand`, `brand-dark`).
2. Nessuna CSS var definita ma non usata in nessun componente.
3. Comportamento visivo invariato rispetto a prima della modifica.
