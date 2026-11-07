# Gulf Bridge Sourcing, site web

Site vitrine de Gulf Bridge Sourcing, bureau d'achat en Chine des exploitants
et de leurs sous-traitants, pour la Côte d'Ivoire, le Gabon et le Cameroun.
Le site s'adresse au visiteur comme sa centrale d'achat en Chine ; voir la règle
de vocabulaire plus bas.

Vite, React, TypeScript. Pages générées à l'avance en HTML. Hébergement
Cloudflare Workers. Contenu géré depuis la console Atlas Studio (module
**Sites clients**, `/admin/client-sites`).

Refonte conforme au cahier des charges du 7 novembre 2026, lot A.

## Démarrer

```bash
npm install
```

```bash
cp .env.example .env
```

```bash
npm run dev
```

Le site de développement écoute sur `http://localhost:5180`. En développement,
le contenu est relu en direct depuis la console.

## Construire et déployer

```bash
npm run build
```

La construction enchaîne trois étapes :

1. `build:client`, les fichiers du navigateur ;
2. `build:ssr`, le rendu serveur ;
3. `scripts/prerender.mjs`, qui relit le contenu de la console, écrit une page
   HTML complète par adresse, puis `sitemap.xml`, `404.html` et `_headers`.

```bash
npm run deploy
```

## Avant la première mise en ligne : réalimenter la console

**La console contient encore le contenu de l'ancien site.** Onze sections ont
gardé la même clé (`settings`, `seo`, `legal`, `contact`, `about`, `methode`,
`home_hero`, `report`, `cta`, `intro`, `home_founder`) et la fusion se fait
champ par champ : l'ancien texte publié écraserait le nouveau. Le site
repartirait en ligne avec Vercel comme hébergeur, la commission 70 / 30, le
délai de 48 heures ouvrées et « une seule société », c'est-à-dire exactement ce
que la refonte corrige.

La construction s'arrête d'elle-même si elle détecte une section obsolète, mais
il faut agir avant :

```bash
node scripts/seed-content.ts --force > seed.sql
```

Appliquer `seed.sql` sur le projet Atlas Studio, puis supprimer les sections
que la refonte a retirées :

```sql
delete from public.client_site_content
where site_id = 'gulf-bridge-sourcing'
  and key in ('approche', 'services', 'secteurs', 'home_constat',
              'home_audience', 'home_explore', 'home_positioning', 'home_startup');
```

Attention : `--force` écrase le contenu publié. C'est voulu ici, puisque ce
contenu est celui de l'ancien positionnement. Toute retouche faite dans la
console après cette opération est à refaire.

### Récapitulatif avant `npm run deploy`

1. `.env` renseigné avec `VITE_ATLAS_SUPABASE_URL` et
   `VITE_ATLAS_SUPABASE_ANON_KEY`. Sans la clé, le contenu de la console n'est
   pas relu **et** la politique de sécurité du contenu bloquera l'envoi du
   formulaire : la construction le signale.
2. Console réalimentée et sections obsolètes supprimées (ci-dessus).
3. `npx wrangler login`, ou `CLOUDFLARE_API_TOKEN` dans l'environnement.
4. `npm run deploy`.

### Point important : publier depuis la console ne suffit plus

Le cahier des charges impose des pages lisibles sans JavaScript (section 10).
Le contenu de la console est donc **figé dans le HTML au moment de la
construction**, et le site ne le relit pas dans le navigateur : le robot et le
visiteur voient exactement le même texte, sans scintillement.

Conséquence : **une modification publiée dans la console n'apparaît en ligne
qu'après une nouvelle construction.** Il faut donc brancher un Deploy Hook
Cloudflare sur la publication de la console. Tant que ce n'est pas fait, la mise
en ligne d'une modification de contenu se fait avec `npm run deploy`.

L'aperçu en direct de la console continue de fonctionner normalement : en mode
aperçu, le site relit le contenu et écoute les brouillons.

## Contenu

- Valeurs par défaut : `src/content/defaults.ts`. Une clé de premier niveau =
  une section éditable dans la console.
- `*mot*` dans un texte = italique doré.
- Nouvelle section ou nouveau champ : l'ajouter dans `defaults.ts`, puis créer
  la ligne en base :

```bash
npm run seed > seed.sql
```

`node scripts/seed-content.ts --force` écrase aussi le contenu déjà publié.

### Règles de rédaction (cahier des charges, section 8)

Pas de tiret long, pas de point médian ni d'autre symbole décoratif, aucun nom
d'usine ni de client, aucun chiffre d'activité non vérifiable, chaque chiffre de
marché sourcé et daté, aucune mention d'outil de création.

**Vocabulaire.** « Centrale d'achat » s'emploie dans le discours commercial
seulement, et toujours formulé comme un service rendu, jamais comme un statut.
Dans les mentions légales, les conditions et tout texte à valeur contractuelle :
« bureau d'achat » ou « mandataire », car en achat accompagné le client achète
en son nom propre. Le statut juridique exact reste à faire valider par un
conseil dans les trois pays.

### Contrôles automatiques à la construction

`scripts/prerender.mjs` relit chaque page produite et **arrête la construction**
si elle contient :

- un tiret long, un tiret demi-cadratin, un point médian ou une puce décorative ;
- la mention d'un outil de création ou de fabrication automatique ;
- sur `/sites-industriels`, une marque visée par des sanctions ou des
  restrictions (Hikvision, Dahua, Huawei, TP-Link, Growatt, Yutong) ;
- sur `/mentions-legales` ou `/confidentialite`, « centrale d'achat » sans la
  qualification « bureau d'achat » ou « mandataire ».

Le contenu venant de la console, c'est le seul endroit où ces règles peuvent
être vérifiées. Le message indique la page et le passage fautif.

### Marques

Les marques sont citées en texte seulement, jamais en logo. Toute page qui en
cite affiche l'avertissement `BRAND_NOTICE`. Aucune marque visée par des
sanctions ou des restrictions américaines ou européennes ne figure sur la page
Sites industriels. Liste à revoir tous les six mois.

## Formulaire « Demander une étude »

Trois étapes, champs structurés, pièces jointes. Envoi par la RPC
`submit_client_site_lead`.

**Limite connue** : cette RPC accepte huit champs texte et aucun fichier. Les
champs structurés sont donc écrits dans un bloc lisible du message, et le champ
« pièces jointes » reste inactif tant que `VITE_LEAD_UPLOAD_URL` n'est pas
renseigné. Le formulaire le dit au visiteur. La migration et la fonction d'envoi
qui lèvent cette limite sont dans `supabase/`, **non appliquées** : voir
`supabase/README.md`.

Protections en place : champ piège invisible, refus d'un envoi en moins de
quatre secondes, limitation de débit côté base, contrôle des formats de fichier
côté navigateur. Le contrôle qui protège réellement les fichiers (type vérifié
sur les octets, nom régénéré, débit) est dans la fonction d'envoi.

## Référencement

- Un titre, une description et une image de partage propres à chaque page
  (`src/seo.ts`), écrits dans le HTML par le pré-rendu.
- `sitemap.xml` et `robots.txt` générés.
- Données structurées : `Organization`, `LocalBusiness` pour chaque bureau dont
  l'adresse est renseignée, `FAQPage` sur la page Contact.
- Anciennes adresses redirigées en 301 par `public/_redirects`.

## Mesure d'audience

Sans cookie et sans donnée personnelle, donc sans bandeau de consentement.
Renseigner `VITE_CF_ANALYTICS_TOKEN` pour la mesure de l'hébergeur. Les
événements de la section 14 passent par `VITE_ANALYTICS_ENDPOINT` ; vide, rien
n'est envoyé.

## Icônes

La police d'icônes est réduite aux seules icônes du site, listées dans le
paramètre `icon_names` de `index.html` : 13 Ko au lieu de 1,3 Mo. **Une icône
ajoutée depuis la console doit être ajoutée à cette liste**, sinon elle ne
s'affiche pas. La construction le signale.

## Images

Format WebP, dimensions ajustées à l'affichage. Le logo est servi en WebP ; le
PNG ne sert plus qu'à l'icône d'onglet.

## Ce qui reste à faire

| Sujet | État |
|---|---|
| Neuf solutions, douze familles de produits, marques | Structure en place, contenu à reprendre de la plaquette commerciale |
| Pièces jointes du formulaire | Migration et fonction écrites, non appliquées (`supabase/`) |
| Demandes vers le module M1 | Lot C, après mise en service de l'application de gestion |
| Domaine, SPF, DKIM, DMARC | Hors dépôt |
| Deploy Hook sur publication de la console | À brancher |
| Version anglaise, guides, pages pays | Lot B |
| Page fournisseur en mandarin | Lot C |
