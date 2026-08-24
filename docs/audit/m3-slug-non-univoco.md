# M3 — Slug articoli non univoco

**Severità:** 🟢 Medium  
**File coinvolti:**
- `app/actions/articles.ts` — funzione `createArticle`

---

## Problema

Lo slug viene generato meccanicamente dal titolo:

```ts
slug: articleData.title
  .toLowerCase()
  .replace(/ /g, '-')
  .replace(/[^\w-]+/g, ''),
```

Questo approccio ha due problemi:

### 1. Collisione su titoli uguali

Se si creano due articoli con titolo "Regata 2025", entrambi avranno slug `regata-2025`. Supabase probabilmente ha un vincolo UNIQUE sullo slug, quindi il secondo insert fallirà con un errore di database poco chiaro.

### 2. Caratteri non-ASCII ignorati

Titoli in italiano con accenti come "L'arrivo a Garda" producono `larrivo-a-garda` (l'apostrofo viene rimosso), ma due articoli diversi potrebbero facilmente generare lo stesso slug.

---

## Fix

### Opzione A — Aggiungere timestamp allo slug (Semplice)

```ts
const baseSlug = articleData.title
  .toLowerCase()
  .replace(/[àáâãäå]/g, 'a')
  .replace(/[èéêë]/g, 'e')
  .replace(/[ìíîï]/g, 'i')
  .replace(/[òóôõö]/g, 'o')
  .replace(/[ùúûü]/g, 'u')
  .replace(/[^a-z0-9\s-]/g, '')
  .trim()
  .replace(/\s+/g, '-');

const slug = `${baseSlug}-${Date.now()}`;
```

Pro: nessuna query aggiuntiva. Contro: slug meno leggibili (`regata-2025-1719000000000`).

### Opzione B — Verificare unicità con retry (Raccomandato)

```ts
async function generateUniqueSlug(title: string): Promise<string> {
  const base = title
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  // Verifica se lo slug esiste già
  const { data } = await supabaseAdmin
    .from('posts')
    .select('slug')
    .like('slug', `${base}%`);

  if (!data || data.length === 0) return base;

  // Trovare il numero più alto già usato
  const max = data.reduce((acc, row) => {
    const match = row.slug.match(new RegExp(`^${base}-(\\d+)$`));
    return match ? Math.max(acc, parseInt(match[1])) : acc;
  }, 0);

  return `${base}-${max + 1}`;
}
```

Produce slug come `regata-2025`, `regata-2025-2`, `regata-2025-3`.

### Integrazione in `createArticle`

```ts
export async function createArticle(articleData: Partial<Article>) {
  const user = await requireAuth();
  if (!supabaseAdmin) throw new Error('Server configuration error');

  if (!articleData.title || !articleData.content || !articleData.title_en || !articleData.content_en) {
    throw new Error('Campi obbligatori mancanti');
  }

  const slug = await generateUniqueSlug(articleData.title);

  const { data, error } = await supabaseAdmin
    .from('posts')
    .insert([{ ...payload, slug, author_id: user.id }])
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath('/blog');
  revalidatePath('/admin');
  return data;
}
```

---

## Verifica

1. Creare due articoli con lo stesso titolo.
2. Verificare che abbiano slug distinti nel database.
3. Verificare che entrambi siano accessibili via URL senza conflitti.
