# C3 — Signup route pubblica e non protetta

**Severità:** 🔴 Critical  
**File coinvolti:**
- `app/api/auth/signup/route.ts`

---

## Problema

L'endpoint `POST /api/auth/signup` è accessibile pubblicamente senza nessuna forma di autenticazione o autorizzazione:

```ts
export async function POST(request: Request) {
  const { email, password } = await request.json();
  const { data, error } = await supabase.auth.signUp({ email, password });
  // ...
}
```

Chiunque sappia che l'endpoint esiste (o lo scopra con un tool come Burp Suite / ffuf) può:
1. Creare account illimitati nel sistema Supabase.
2. Se la email confirmation è disabilitata su Supabase, ottenere accesso immediato all'admin.
3. Saturare il database Supabase con utenti fake (DoS sul piano gratuito).

Questa route esiste probabilmente per il primo setup dell'account admin, ma non dovrebbe essere attiva in produzione.

---

## Opzioni di fix

### Opzione A — Eliminare la route (Raccomandata)

Se l'account admin è già stato creato, questa route non serve. Eliminarla è la soluzione più sicura.

```bash
rm app/api/auth/signup/route.ts
```

La creazione di nuovi admin può avvenire direttamente dalla dashboard Supabase → Authentication → Users.

---

### Opzione B — Proteggere con chiave segreta

Se in futuro serve creare account programmaticamente, proteggere con un header segreto:

```ts
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/app/lib/supabase-server';

const ADMIN_SECRET = process.env.ADMIN_SECRET;

export async function POST(request: Request) {
  const authHeader = request.headers.get('x-admin-secret');
  if (!ADMIN_SECRET || authHeader !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { email, password } = await request.json();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ user: data.user });
}
```

Aggiungere a `.env.local`:
```
ADMIN_SECRET=un-valore-lungo-e-casuale-generato-con-openssl-rand-base64-32
```

---

### Opzione C — Richiedere auth esistente (solo admin può creare admin)

```ts
import { requireAuth } from '@/app/lib/supabase-server';

export async function POST(request: Request) {
  await requireAuth(); // Lancia Error('Unauthorized') se non autenticato
  // ...resto del codice
}
```

---

## Raccomandazione

**Usare Opzione A** — eliminare il file. Non c'è motivo di esporre una route di signup in un'applicazione dove gli admin sono pochi e noti. Usare la dashboard Supabase per la gestione degli utenti.

---

## Verifica

Dopo il fix, verificare che `POST /api/auth/signup` risponda con 404 (route non trovata).
