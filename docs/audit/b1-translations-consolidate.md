# B1 — Consolidare i 17 file di traduzione

**Severità:** 🔵 Best Practice  
**File coinvolti:**
- `app/translations/*.ts` (17 file)

---

## Problema

Ogni pagina o sezione ha il proprio file di traduzione separato:

```
translations/
├── auth.ts
├── blog.ts
├── boat.ts
├── career.ts
├── contact.ts
├── cookie.ts
├── event.ts
├── footer.ts
├── home.ts
├── navbar.ts
├── pastEvents.ts
├── presentation.ts
├── privacy.ts
├── signature.ts
├── sponsor.ts
├── sumothRulebook.ts
├── team.ts
├── upcomingEvents.ts
```

Questo approccio causa:
1. **Difficoltà di ricerca**: per trovare la chiave "Entra nel team" bisogna sapere in quale file cercare.
2. **Naming inconsistente**: ogni file esporta un nome diverso (`homeTranslations`, `navbarTranslations`, `blogTranslations`...).
3. **Aggiunta di una lingua** richiede modificare 17 file separati.
4. **Nessuna garanzia di copertura**: non c'è modo automatico di verificare che tutte le chiavi siano presenti in entrambe le lingue.

---

## Fix — Opzione A: file unico con namespace (Senza dipendenze)

Consolidare in `app/translations/index.ts`:

```ts
// app/translations/index.ts

import { homeTranslations } from './home';
import { navbarTranslations } from './navbar';
import { blogTranslations } from './blog';
// ... tutti gli altri

export const translations = {
  home: homeTranslations,
  navbar: navbarTranslations,
  blog: blogTranslations,
  // ...
} as const;

export type TranslationKey = keyof typeof translations;
export type Language = 'en' | 'it';

// Hook helper unico
export function useTranslations<K extends TranslationKey>(namespace: K) {
  const { language } = useLanguage();
  return translations[namespace][language];
}
```

Uso nei componenti:

```tsx
// Prima
import { homeTranslations } from '../translations/home';
const t = homeTranslations[language];

// Dopo
import { useTranslations } from '../translations';
const t = useTranslations('home');
```

Questa opzione mantiene i file separati per namespace (più leggibili) ma espone un'interfaccia unificata.

---

## Fix — Opzione B: `next-intl` (Con dipendenza, più robusto)

Per progetti più grandi o con più lingue, `next-intl` offre:
- File JSON per lingua invece di TypeScript
- Type safety generata automaticamente
- Integrazione con `Intl` per date, numeri, plurali
- Supporto per RSC (Server Components)

```bash
npm install next-intl
```

Struttura:
```
messages/
├── it.json
└── en.json
```

Ogni file JSON è l'unica fonte di verità per quella lingua. I type sono generati da uno strumento.

---

## Raccomandazione

**Opzione A** per il progetto attuale — mantiene i file esistenti, aggiunge solo un barrel export e un hook unificato. Zero dipendenze, zero migrazione.

**Opzione B** se si prevede di aggiungere lingue o se il progetto cresce significativamente.

---

## Verifica

Dopo il refactor:
1. Verificare che tutte le pagine si traducano correttamente.
2. Cercare con grep import diretti ai file singoli che sono stati bypassati:
```bash
grep -rn "from.*translations/" app/components/ app/page.tsx
```
