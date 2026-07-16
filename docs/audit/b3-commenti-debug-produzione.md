# B3 — Commenti di processo lasciati in produzione

**Severità:** 🔵 Best Practice  
**File coinvolti:**
- `tailwind.config.js`
- `app/admin/layout.tsx`
- `app/admin/page.tsx`
- `app/admin/events/[id]/edit/page.tsx`

---

## Problema

Nel codice sono presenti commenti che descrivono decisioni di sviluppo in corso, TODO personali, e note interne che non hanno valore per chi legge il codice in futuro:

### `tailwind.config.js`
```js
kelson: ['var(--font-kelson)', 'sans-serif'], // Keep kelson just in case, or replace? User hates it? Let's alias 'syne' to 'kelson' class if we want quick swap, or better: make a new 'syne' class and replace usage.
```

### `app/admin/layout.tsx`
```ts
// REMOVE Context definition and useAdminContext export from here
// Import the Provider and hook from the new context file
// Potentially redirect or show error, but often just means no session
// For simplicity, we assume getSession() gives a valid one if present
// Check current route if needed before pushing
```

### `app/admin/page.tsx`
```ts
//import { useRouter } from 'next/navigation'; // Keep useRouter if needed for other things
// --- useEffects and Handlers ---
// Populates editorContent and editorContent_en when currentArticle changes
const BUCKET_NAME = 'images'; // questo va in una costante, non un commento
```

### `app/lib/supabase-admin.ts`
```ts
// In a real app, you might want to throw an error here
// if the service role key is not available.
// For this example, we return null.
```

---

## Perché è un problema

1. **"User hates it?"** — un commento personale/soggettivo in un file di configurazione condiviso. Dice qualcosa su una preferenza passeggera, non sul perché del codice.
2. **`// REMOVE Context definition`** — un TODO rimasto. Se il refactor è finito, va rimosso. Se non è finito, va tracciato in un issue tracker, non nel codice.
3. **`// In a real app, you might want to`** — suggerisce che questo *non* è un'app reale. Mina la fiducia nel codice.
4. **Import commentati** — `//import { useRouter }` è codice morto. Se non serve, va eliminato; se potrebbe tornare utile, il git history lo conserva.

---

## Regola generale

Un commento è utile solo se risponde a **perché**, non a **cosa**:
- ✅ `// getUser() invece di getSession() per verifica server-side (Supabase docs)`
- ✅ `// il setAll silenzioso è intenzionale: i Server Component non possono impostare cookie`
- ❌ `// REMOVE this later`
- ❌ `// Keep useRouter if needed`
- ❌ `// For simplicity, we assume...`

---

## Fix

Pulizia meccanica — nessuna logica da cambiare, solo rimozione:

1. `tailwind.config.js` — rimuovere il commento su kelson/syne/user
2. `admin/layout.tsx` — rimuovere tutti i commenti di processo, mantenere solo quello sul `setAll` cookie silenzioso (che spiega un comportamento non ovvio)
3. `admin/page.tsx` — rimuovere import commentati, estrarre `'images'` come costante nel modulo
4. `lib/supabase-admin.ts` — rimuovere i commenti "In a real app" e applicare il fix da [H3](./h3-supabase-admin-responsabilita.md)

---

## Verifica

```bash
grep -rn "TODO\|FIXME\|REMOVE\|Keep.*if needed\|In a real app\|For simplicity" app/ tailwind.config.js
```

Deve restituire zero risultati dopo la pulizia.
