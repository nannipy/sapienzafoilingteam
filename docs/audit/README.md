# Audit — Piano di Fix

Analisi effettuata il 2026-06-18. I fix sono ordinati per priorità.

## Indice

### 🔴 Critical
| # | File | Titolo |
|---|------|--------|
| C1 | [c1-browser-client-in-api-routes.md](./c1-browser-client-in-api-routes.md) | Browser client usato nelle API Route |
| C2 | [c2-getsession-vs-getuser-admin.md](./c2-getsession-vs-getuser-admin.md) | Admin usa `getSession()` invece di `getUser()` |
| C3 | [c3-signup-route-pubblica.md](./c3-signup-route-pubblica.md) | Signup route pubblica e non protetta |

### 🟠 High
| # | File | Titolo |
|---|------|--------|
| H1 | [h1-font-syne-mancante.md](./h1-font-syne-mancante.md) | Font `syne` non caricato |
| H2 | [h2-middleware-non-protegge-admin.md](./h2-middleware-non-protegge-admin.md) | Middleware non protegge `/admin` |
| H3 | [h3-supabase-admin-responsabilita.md](./h3-supabase-admin-responsabilita.md) | `supabase-admin.ts` mescola client e data layer |

### 🟢 Medium
| # | File | Titolo |
|---|------|--------|
| M1 | [m1-isauthenticated-dead-code.md](./m1-isauthenticated-dead-code.md) | `isAuthenticated()` è codice morto |
| M2 | [m2-pagelayout-client-component.md](./m2-pagelayout-client-component.md) | `PageLayout` è un Client Component inutile |
| M3 | [m3-slug-non-univoco.md](./m3-slug-non-univoco.md) | Slug articoli non univoco |
| M4 | [m4-openposition-requirements-type.md](./m4-openposition-requirements-type.md) | Type mismatch in `OpenPosition.requirements` |
| M5 | [m5-theming-incoerente.md](./m5-theming-incoerente.md) | Theming doppio e incoerente |

### 🔵 Best Practice
| # | File | Titolo |
|---|------|--------|
| B1 | [b1-translations-consolidate.md](./b1-translations-consolidate.md) | Consolidare i 17 file di traduzione |
| B2 | [b2-colori-hardcoded-typography.md](./b2-colori-hardcoded-typography.md) | Colori hardcoded nel plugin Typography |
| B3 | [b3-commenti-debug-produzione.md](./b3-commenti-debug-produzione.md) | Commenti di processo lasciati in produzione |
