# C1 — Browser client usato nelle API Route

**Severità:** 🔴 Critical  
**File coinvolti:**
- `app/api/auth/login/route.ts`
- `app/api/auth/logout/route.ts`
- `app/api/auth/signup/route.ts`
- `app/lib/supabase.ts`

---

## Problema

Tutti e tre i Route Handler importano `supabase` da `app/lib/supabase.ts`:

```ts
import { supabase } from '@/app/lib/supabase';
```

Questo client è creato con `createBrowserClient` di `@supabase/ssr`:

```ts
// app/lib/supabase.ts
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

`createBrowserClient` è progettato per girare nel browser: legge e scrive i cookie di sessione tramite `document.cookie`. Quando viene usato in un Route Handler (Node.js), non ha accesso ai cookie della request HTTP in arrivo, quindi:

1. Non può leggere la sessione dell'utente corrente.
2. Non può impostare i cookie `Set-Cookie` nella response.
3. È un singleton condiviso tra tutte le request — in un ambiente serverless/edge questo crea race condition sulla sessione.

Il login può sembrare che funzioni perché Supabase restituisce comunque il token nel body JSON, ma la sessione non viene mai correttamente impostata nei cookie del browser in modo sicuro.

---

## Fix

Sostituire il browser client con il server client in tutti i Route Handler.

### 1. `app/api/auth/login/route.ts`

```ts
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/app/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ user: data.user });
  } catch {
    return NextResponse.json({ error: 'Errore imprevisto' }, { status: 500 });
  }
}
```

### 2. `app/api/auth/logout/route.ts`

```ts
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/app/lib/supabase-server';

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Errore imprevisto' }, { status: 500 });
  }
}
```

> **Nota:** il fix per `signup` è trattato separatamente in [C3](./c3-signup-route-pubblica.md).

---

## Perché non esporre `session` nel body della response

Con il server client, la sessione viene gestita tramite cookie `HttpOnly` impostati automaticamente da `@supabase/ssr`. Non serve restituire `session` nel body JSON — anzi, esporla aumenta la superficie di attacco (XSS può leggere il token).

---

## Test di verifica

Dopo il fix, verificare che:
1. Il login imposti i cookie `sb-*` nella response (visibili in DevTools → Network → Set-Cookie).
2. La sessione persista tra i refresh di pagina.
3. Il logout svuoti i cookie.
