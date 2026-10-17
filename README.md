# Gulf Bridge Sourcing — site web

Site vitrine de Gulf Bridge Sourcing (agent d'achat à Guangzhou pour la Côte d'Ivoire, le Gabon et le Cameroun).
Vite + React + TypeScript, géré depuis la console Atlas Studio (module **Sites clients**, `/admin/client-sites`).

## Démarrer

```bash
npm install
cp .env.example .env   # renseigner VITE_ATLAS_SUPABASE_ANON_KEY (clé publique)
npm run dev            # http://localhost:5180
```

## Contenu

- Valeurs par défaut : `src/content/defaults.ts` (une clé = une section éditable dans la console).
- Le site lit `public.client_site_content` (site_id `gulf-bridge-sourcing`) et fusionne section par section.
- `*mot*` dans un texte = italique doré.
- Nouvelle section ou nouveau champ : l'ajouter dans `defaults.ts`, puis créer la ligne en base :

```bash
node scripts/seed-content.ts > seed.sql   # --force pour écraser le contenu publié
```

## Formulaire de contact

Envoi via la RPC `submit_client_site_lead` (validation + limitation de débit). Les demandes apparaissent dans la
console (onglet Demandes) et déclenchent un e-mail à `client_sites.notify_email`.

## Aperçu en direct

La console affiche le site dans un iframe avec `?preview=1` et lui transmet les brouillons par `postMessage`.
Origines autorisées : `VITE_CONSOLE_ORIGINS`.

## Déploiement

Vercel (`vercel.json` : réécriture SPA, cache des assets, `frame-ancestors` pour la console).
