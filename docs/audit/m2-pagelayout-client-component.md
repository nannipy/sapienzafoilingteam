# M2 — `PageLayout` è un Client Component inutile

**Severità:** 🟢 Medium  
**File coinvolti:**
- `app/components/PageLayout.tsx`

---

## Problema

`PageLayout` ha la direttiva `'use client'` ma non usa nessuna feature client-side:

```tsx
'use client'; // ← non necessario

import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
  noBottomPadding?: boolean;
  noBackground?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, noBottomPadding, noBackground }) => {
  return (
    <main className="min-h-screen bg-brand-dark pt-32">
      <div className="relative z-10 mx-4">
        <div className={`max-w-7xl mx-auto rounded-3xl ...`}>
          {children}
        </div>
      </div>
      <div className="h-24" />
    </main>
  );
};
```

Non ci sono: `useState`, `useEffect`, `useRef`, event handler, `useContext`, accesso a browser API.

### Conseguenza

Marcando il componente come `'use client'`, Next.js lo esclude dall'ottimizzazione Server Component. Questo significa:
- Il codice viene incluso nel bundle JS inviato al browser.
- Tutti i componenti figli di `PageLayout` vengono anch'essi "trascinati" nel bundle client, a meno che non siano importati dinamicamente.
- In pagine dove `PageLayout` wrappa componenti Server (come quelli che fanno fetch di dati), si perde il beneficio del rendering server-side.

---

## Fix

Rimuovere `'use client'` dal file.

```tsx
// Rimuovere questa riga:
// 'use client';

import React from 'react';

// ... resto invariato
```

Next.js tratterà il componente come Server Component per default. Funzionerà esattamente come prima, ma con meno JS nel bundle.

---

## Nota: quando `'use client'` è necessario

Un componente necessita di `'use client'` solo se:
- Usa `useState`, `useReducer`, `useRef`
- Usa `useEffect`, `useLayoutEffect`
- Usa un Context che espone valori reattivi
- Usa event handler come `onClick`, `onChange`
- Accede a `window`, `document`, `localStorage`
- Usa `useRouter`, `usePathname`, `useSearchParams`

`PageHero.tsx` invece ha `'use client'` giustificato perché usa `framer-motion` che richiede il DOM per le animazioni.

---

## Verifica

Dopo la rimozione, verificare che le pagine che usano `PageLayout` (`/blog`, `/team`, `/career`, `/sponsor`, ecc.) si rendano correttamente e non mostrino errori in console.
