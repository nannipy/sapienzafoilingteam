# H1 — Font `syne` non caricato

**Severità:** 🟠 High  
**File coinvolti:**
- `app/fonts.ts` — mancante la definizione
- `tailwind.config.js` — definisce `font-syne` → `var(--font-syne)`
- 15+ componenti — usano `font-syne` in className

---

## Problema

`tailwind.config.js` mappa la classe `font-syne` alla variabile CSS `--font-syne`:

```js
fontFamily: {
  syne: ['var(--font-syne)', 'sans-serif'],
}
```

Ma `app/fonts.ts` non carica mai questo font — definisce solo `geist`, `geistMono` e `kelson`. La variabile CSS `--font-syne` non viene mai iniettata nell'HTML, quindi tutti i componenti che usano `font-syne` ricevono il fallback `sans-serif` silenziosamente.

Componenti con rendering visivo potenzialmente sbagliato:
- `PageHero.tsx` — heading principale di ogni pagina interna
- `Footer.tsx` — nome del team in display enorme
- `EventsSection.tsx` — titoli sezione
- `BlogClientPage.tsx` — card titoli blog
- `ArticleClientPage.tsx` — titolo articolo
- `TeamHero.tsx`, `DepartmentCard.tsx`, `DepartmentDetail.tsx`
- `name-on-wings/page.tsx`

---

## Analisi: quale font usare

Il `tailwind.config.js` ha anche un commento rivelatore:

```js
kelson: ['var(--font-kelson)', 'sans-serif'], // Keep kelson just in case, or replace?
// ...alias 'syne' to 'kelson' class if we want quick swap
```

Ci sono due strade:

### Opzione A — Caricare Syne da Google Fonts (Raccomandato)

Syne è un font open-source disponibile su Google Fonts. Con `next/font/google` non richiede hosting dei file.

In `app/fonts.ts`:

```ts
import { Syne } from 'next/font/google';

export const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});
```

In `app/layout.tsx`, aggiungere la variabile al `<body>`:

```tsx
import { geist, geistMono, kelson, syne } from './fonts';

<body className={`${geist.variable} ${geistMono.variable} ${kelson.variable} ${syne.variable} antialiased`}>
```

### Opzione B — Aliasare `kelson` come `syne`

Se si vuole mantenere Kelson come font display senza aggiungere dipendenze, basta aggiungere l'alias nel config:

```js
// tailwind.config.js
fontFamily: {
  syne: ['var(--font-kelson)', 'sans-serif'], // alias kelson → syne
  kelson: ['var(--font-kelson)', 'sans-serif'],
}
```

Questo risolve il bug senza aggiungere nessun font. Il trade-off è che `font-syne` e `font-kelson` si comportano identicamente.

---

## Raccomandazione

**Opzione A** se Syne è il font di design intention. **Opzione B** se si vuole un fix immediato senza caricare risorse extra e Kelson è visivamente accettabile come sostituto.

---

## Test di verifica

Dopo il fix, aprire DevTools → Elements e verificare che `--font-syne` sia visibile nelle CSS Variables del `:root`. La sezione `PageHero` deve mostrare il font corretto.
