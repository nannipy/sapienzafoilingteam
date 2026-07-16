# M1 — `isAuthenticated()` è codice morto

**Severità:** 🟢 Medium  
**File coinvolti:**
- `app/lib/supabase-server.ts`

---

## Problema

La funzione `isAuthenticated()` ha un corpo vuoto in entrambi i rami:

```ts
export async function isAuthenticated() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    // vuoto
  } else {
    // vuoto
  }

  return !!user;
}
```

La funzione:
1. Non è importata da nessun file del progetto (confermato con grep).
2. Fa la stessa cosa di `verifySession()` ma restituisce `boolean` invece dell'oggetto `user`.
3. È stata probabilmente sostituita da `verifySession()` e `requireAuth()` senza essere rimossa.

Il codice morto aumenta la superficie cognitiva da mantenere e può confondere chi legge il file credendo che venga usato da qualche parte.

---

## Fix

Eliminare la funzione `isAuthenticated()` da `app/lib/supabase-server.ts`.

```ts
// Rimuovere interamente questo blocco:
export async function isAuthenticated() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
  } else {
  }

  return !!user;
}
```

Il file risultante contiene solo le funzioni effettivamente usate:
- `createSupabaseServerClient()` — usato ovunque
- `verifySession()` — usato in componenti che vogliono l'utente o null
- `requireAuth()` — usato nei server actions per bloccare gli accessi non autenticati

---

## Verifica

```bash
grep -rn "isAuthenticated" app/
```

Deve restituire zero risultati dopo la rimozione.
