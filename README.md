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

- Trois pages : accueil (`/`), Qui sommes-nous (`/qui-sommes-nous`), Mentions légales et confidentialité (`/mentions-legales`).
  Les anciennes adresses (`/services`, `/methode`, `/contact`…) redirigent vers la section correspondante de l'accueil.
- Valeurs par défaut : `src/content/defaults.ts` (une clé = une section éditable dans la console).
  Refonte de novembre 2026 : nouvelles clés (`site`, `accueil_*`, `qsn_*`, `mentions_legales`). Les anciennes lignes
  publiées (`settings`, `home_hero`, `about`…) sont ignorées par le site ; `--prune` les supprime.
- Une valeur saisie dans la console n'est prise en compte que si son type correspond à la valeur par défaut.
- Le site lit `public.client_site_content` (site_id `gulf-bridge-sourcing`) et fusionne section par section.
- `*mot*` = italique (champagne sur fond sombre, bronze sur fond clair), `**mot**` = gras, retour à la ligne = saut de ligne.
- Nouvelle section ou nouveau champ : l'ajouter dans `defaults.ts`, puis créer la ligne en base :

```bash
node scripts/seed-content.ts > seed.sql   # --force : écrase le contenu publié ; --prune : supprime les anciennes sections
```

## Formulaire de contact

Envoi via la RPC `submit_client_site_lead` (validation + limitation de débit). Les demandes apparaissent dans la
console (onglet Demandes) et déclenchent un e-mail à `client_sites.notify_email`.

- « Demander une étude » : les champs sans colonne dédiée (fonction, pays, secteur, date, fournisseur, source) sont
  ajoutés au message. Les champs suivent la politique de confidentialité, section 2 : n'en ajouter aucun sans la mettre à jour.
- « Recevoir le PDF » (rapport) : enregistré comme une demande (`page = accueil-rapport`). L'envoi automatique du PDF
  n'est pas branché, il est fait par l'équipe.
- Pièces jointes : aucun stockage privé n'est branché ; le formulaire invite à envoyer les documents par e-mail ou WhatsApp.

## Animations

Courbe `cubic-bezier(.16,1,.3,1)`, toutes coupées si `prefers-reduced-motion: reduce`. Apparition au défilement :
attribut `data-reveal="délai ms"` (seuls les éléments sous la ligne de flottaison sont animés : tout reste visible sans JS).
Superposition des sections : réglages `site.stacking` et `site.stackingMobile` dans la console.

## Aperçu en direct

La console affiche le site dans un iframe avec `?preview=1` et lui transmet les brouillons par `postMessage`.
Origines autorisées : `VITE_CONSOLE_ORIGINS`.

## Déploiement

Cloudflare Workers (fichiers statiques) : `wrangler.jsonc` (fallback SPA, domaines `gulfbridgesourcing.com` et `www.`)
et `public/_headers` (CSP stricte, cache). Toute nouvelle origine appelée par le site (outil d'audience, API…) doit être
ajoutée à la CSP, sinon le navigateur la bloque.

Au premier déploiement avec les domaines, supprimer d'abord dans Cloudflare (DNS) les enregistrements A, AAAA ou CNAME
existants pour `gulfbridgesourcing.com` et `www`, sinon wrangler refuse de rattacher le domaine.

```bash
npx wrangler login   # une fois
npm run deploy       # build avec .env puis déploiement
```

Les variables `VITE_*` sont lues au moment du build : elles doivent être présentes dans `.env` (ou dans les variables de build Cloudflare si le déploiement est relié à GitHub).
