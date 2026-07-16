# M4 — Type mismatch in `OpenPosition.requirements`

**Severità:** 🟢 Medium  
**File coinvolti:**
- `app/lib/types.ts`
- `app/lib/supabase-admin.ts` — `createOpenPosition`, `updateOpenPosition`

---

## Problema

Il tipo TypeScript dichiara `requirements` come array di stringhe:

```ts
export interface OpenPosition {
  requirements: string[];
  // ...
}
```

Ma il codice lo serializza a stringa JSON prima di salvarlo nel database:

```ts
// createOpenPosition
const { requirements, ...rest } = position;
await supabaseAdmin.from('open_positions').insert([{
  ...rest,
  requirements: JSON.stringify(requirements) // string, non string[]
}]);

// updateOpenPosition
if ('requirements' in updatePayload && Array.isArray(updatePayload.requirements)) {
  updatePayload.requirements = JSON.stringify(updatePayload.requirements) as unknown as string[];
  //                                                                        ^^^^^^^^^^^^^^^^^
  //                                                           Cast che nasconde un bug di tipo
}
```

Il cast `as unknown as string[]` è un segnale di allarme: dice al compilatore di ignorare un'incoerenza che esiste nel codice. In runtime, `requirements` è una stringa JSON, non un array, ma TypeScript non se ne accorge.

Questo causa:
- Perdita del type safety: qualsiasi codice che legge `position.requirements` si aspetta un `string[]` ma riceve una stringa.
- Runtime errors potenziali quando si fa `.map()` o `.length` su una stringa invece di un array.
- Difficoltà di debug: il dato sembra corretto nel tipo, ma è sbagliato in runtime.

---

## Causa

La colonna `requirements` nel database Supabase è probabilmente di tipo `text` (stringa semplice) invece di `jsonb` o `text[]` (array). Il codice lavora attorno a questa limitazione serializzando manualmente.

---

## Fix

Ci sono due approcci a seconda della struttura del database.

### Opzione A — Cambiare la colonna in Supabase a `jsonb` (Raccomandato)

In Supabase → Table Editor → `open_positions` → colonna `requirements`:
1. Cambiare il tipo da `text` a `jsonb`.
2. Aggiornare i dati esistenti: `UPDATE open_positions SET requirements = requirements::jsonb;`

Poi rimuovere tutta la serializzazione manuale:

```ts
// createOpenPosition — senza JSON.stringify
await supabaseAdmin.from('open_positions').insert([position]).select().single();

// updateOpenPosition — senza il blocco di conversione
await supabaseAdmin.from('open_positions').update(position).eq('id', id).select().single();
```

Supabase gestisce automaticamente la (de)serializzazione JSONB.

### Opzione B — Allineare il tipo a ciò che il database contiene

Se non si vuole modificare lo schema, correggere il tipo TypeScript per riflettere la realtà:

```ts
export interface OpenPosition {
  requirements: string; // JSON serializzato, non un array
  // ...
}

// Aggiungere un tipo derivato per l'uso in UI
export interface OpenPositionParsed extends Omit<OpenPosition, 'requirements'> {
  requirements: string[];
}

// Helper di parsing
export function parseOpenPosition(pos: OpenPosition): OpenPositionParsed {
  return {
    ...pos,
    requirements: JSON.parse(pos.requirements),
  };
}
```

Questa opzione è un workaround — preferire Opzione A se possibile.

---

## Verifica

Dopo il fix con Opzione A:
1. Creare una posizione con 3 requisiti.
2. Leggere la posizione dal database e verificare che `requirements` sia un array in TypeScript senza cast.
3. Verificare che la UI mostri correttamente i requisiti come lista.
