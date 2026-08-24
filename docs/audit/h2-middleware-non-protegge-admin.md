# H2 — Middleware non protegge `/admin`

**Severità:** 🟠 High  
**File coinvolti:**
- `proxy.ts`
- `app/utils/supabase/middleware.ts`

---

## Problema

Il middleware (`proxy.ts`) chiama solo `updateSession()`, che serve a refreshare il token Supabase nei cookie, ma **non redireziona** gli utenti non autenticati fuori dalle route admin:

```ts
// proxy.ts
export default async function proxy(request: NextRequest) {
  return await updateSession(request); // Solo refresh, nessun check
}
```

La protezione delle route `/admin/*` dipende interamente dal check client-side in `admin/layout.tsx` (che usa anche `getSession()`, vedi [C2](./c2-getsession-vs-getuser-admin.md)). Questo significa:

1. Un utente non autenticato che naviga direttamente a `/admin/events` riceve la pagina renderizzata prima del redirect (flash of content).
2. I Server Components dentro `/admin/*` vengono eseguiti prima che il check client faccia il redirect.
3. Se il check client viene rimosso per errore, non c'è nessun fallback server-side.

---

## Fix

Aggiungere la verifica di sessione nel middleware per le route `/admin/*`.

### `proxy.ts` aggiornato

```ts
import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export default async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request: { headers: request.headers } });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Verifica server-side (getUser fa una chiamata di rete verificata)
  const { data: { user } } = await supabase.auth.getUser();

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = request.nextUrl.pathname === '/login';

  if (isAdminRoute && !user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && user) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

### Semplificare `app/admin/layout.tsx`

Con il middleware che garantisce che nessun utente non autenticato raggiunga `/admin/*`, il check in `admin/layout.tsx` diventa ridondante. Si può semplificare togliendo il redirect e mantenendo solo il fetch dell'utente per il rendering:

```ts
useEffect(() => {
  supabase.auth.getUser().then(({ data: { user } }) => {
    setUser(user);
    setLoading(false);
  });
}, []);
```

---

## Perché non usare `getSession()` nel middleware

`getSession()` nel middleware legge solo i cookie senza verificare con il server — una sessione scaduta o manipolata passerebbe il check. `getUser()` fa una chiamata al server Supabase e restituisce `null` per sessioni invalide.

---

## Test di verifica

1. Aprire una finestra in incognito (nessun cookie).
2. Navigare direttamente a `/admin/events`.
3. Verificare che il redirect avvenga a `/login?redirectTo=/admin/events` senza flash di contenuto.
