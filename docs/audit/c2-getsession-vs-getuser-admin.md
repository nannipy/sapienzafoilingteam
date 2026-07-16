# C2 — Admin usa `getSession()` invece di `getUser()`

**Severità:** 🔴 Critical  
**File coinvolti:**
- `app/admin/layout.tsx` (riga 30)
- `app/admin/events/page.tsx` (riga 80)
- `app/admin/events/[id]/edit/page.tsx` (riga 48)
- `app/admin/media/page.tsx` (riga 90)

---

## Problema

Il check di autenticazione nell'admin usa `getSession()`:

```ts
const { data: { session }, error: sessionError } = await supabase.auth.getSession();
```

`getSession()` legge la sessione direttamente dallo storage locale (localStorage nel browser, o memoria in SSR) **senza verificare il token con i server Supabase**. Questo ha due implicazioni critiche:

### 1. Bypassabile con localStorage manipolato (client-side)

Un attacker con accesso al browser (XSS, accesso fisico) può scrivere un JWT arbitrario in localStorage. `getSession()` lo accetterà come valido perché non fa una chiamata di verifica.

### 2. Non sicuro lato server

Nei componenti Server-side o nei Route Handler, `getSession()` legge dai cookie della request, ma non verifica la firma del JWT con Supabase Auth Server. Un JWT scaduto o forgiato potrebbe passare il check.

La documentazione ufficiale Supabase dice esplicitamente:

> _"Never trust `getSession()` on the server. Always use `getUser()` which makes a network request to verify the token."_

---

## Fix

Sostituire tutti i `getSession()` con `getUser()` nei contesti admin. Poiché l'admin layout è già un Client Component, la verifica iniziale può restare client-side ma deve usare `getUser()`.

### `app/admin/layout.tsx`

```ts
// Prima
const { data: { session }, error: sessionError } = await supabase.auth.getSession();
if (session) {
  setUser(session.user);
} else {
  router.push('/login');
}

// Dopo
const { data: { user }, error } = await supabase.auth.getUser();
if (user) {
  setUser(user);
} else {
  router.push('/login');
}
```

### `app/admin/events/page.tsx` e altri

```ts
// Prima
const session = (await supabase.auth.getSession()).data.session;
if (!session) { router.push('/login'); return; }

// Dopo
const { data: { user } } = await supabase.auth.getUser();
if (!user) { router.push('/login'); return; }
```

---

## Fix definitivo consigliato: spostare la protezione nel middleware

Il fix sui singoli file è un patch. La soluzione corretta è proteggere `/admin/*` nel middleware (vedi [H2](./h2-middleware-non-protegge-admin.md)): se il middleware blocca le route non autenticate, i singoli page non devono più fare il check manualmente.

---

## Test di verifica

1. Aprire DevTools → Application → Local Storage.
2. Modificare manualmente il valore `sb-*-auth-token` con un JWT arbitrario.
3. Ricaricare `/admin` — con `getSession()` si accede, con `getUser()` si viene reindirizzati.
