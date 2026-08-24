# H3 — `supabase-admin.ts` mescola client e data layer

**Severità:** 🟠 High  
**File coinvolti:**
- `app/lib/supabase-admin.ts`

---

## Problema

Il file svolge due responsabilità distinte:

1. **Crea il client Supabase admin** (con service role key)
2. **Implementa tutte le operazioni CRUD** per `open_positions` ed `events`

Questo viola il Single Responsibility Principle e crea due problemi concreti:

### Fallimento silenzioso

Se `SUPABASE_SERVICE_ROLE_KEY` non è presente, il client è `null` e ogni funzione ritorna silenziosamente `[]` o `null`:

```ts
const createAdminClient = () => {
  if (supabaseServiceRoleKey) {
    return createClient(...);
  }
  return null; // Silenzioso — nessun errore, nessun log
};

export async function getEvents() {
  if (!supabaseAdmin) return []; // L'app "funziona" ma non mostra nulla
}
```

In produzione questo si manifesta come pagine vuote senza nessun errore nei log.

### Importazioni circolari potenziali

I server actions in `app/actions/` importano sia funzioni specifiche che il client direttamente da `supabase-admin.ts`:

```ts
import { supabaseAdmin, updateEvents, deleteEvent, getEvents } from '@/app/lib/supabase-admin';
```

Mescolare client e operazioni nello stesso modulo rende difficile testare le singole funzioni in isolamento.

---

## Fix — Separare in due layer

### `app/lib/supabase-admin.ts` — solo client

```ts
import 'server-only';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error(
    'Supabase admin client: NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY sono richieste.'
  );
}

export const supabaseAdmin = createClient(url, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
```

Il `throw` a module-load time garantisce che l'app non parta in produzione senza le variabili necessarie. Nessun `null` in giro.

### `app/lib/db/events.ts` — data layer

```ts
import 'server-only';
import { supabaseAdmin } from '@/app/lib/supabase-admin';
import { Event } from '@/app/lib/types';

export async function getEvents(): Promise<Event[]> {
  const { data, error } = await supabaseAdmin
    .from('events')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function getEventById(id: string): Promise<Event> {
  const { data, error } = await supabaseAdmin
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function createEvent(payload: Omit<Event, 'id' | 'created_at'>): Promise<Event> {
  const { data, error } = await supabaseAdmin
    .from('events')
    .insert([payload])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateEvent(id: string, payload: Partial<Event>): Promise<Event> {
  const { data, error } = await supabaseAdmin
    .from('events')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteEvent(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('events')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}
```

### `app/lib/db/positions.ts` — stessa struttura

Analoga separazione per `open_positions`, rimuovendo il JSON.stringify hack (vedi [M4](./m4-openposition-requirements-type.md)).

---

## Struttura target

```
app/lib/
├── supabase-admin.ts     # solo client (throw se env mancante)
├── supabase-server.ts    # server client + auth helpers
├── supabase.ts           # browser client
├── db/
│   ├── events.ts         # CRUD events
│   ├── positions.ts      # CRUD open_positions
│   └── articles.ts       # CRUD posts (da spostare da actions/)
└── types.ts
```

---

## Aggiornare gli import nei server actions

Dopo la separazione, aggiornare `app/actions/events.ts` e `app/actions/positions.ts`:

```ts
// Prima
import { supabaseAdmin, updateEvents, deleteEvent, getEvents } from '@/app/lib/supabase-admin';

// Dopo
import { getEvents, updateEvent, deleteEvent } from '@/app/lib/db/events';
```
