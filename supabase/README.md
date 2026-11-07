# Backend des demandes : ce qui manque, et ce qui est proposé ici

Ces fichiers ne sont **pas appliqués**. Le projet Supabase visé est le backend
partagé de la console Atlas Studio : il sert plusieurs sites clients. Une
migration s'y applique après revue, pas depuis une construction du site.

## Le constat

La console reçoit aujourd'hui les demandes par la fonction
`public.submit_client_site_lead`, qui accepte huit champs texte :

    p_site_id, p_name, p_email, p_company, p_phone, p_service, p_message, p_page

La table `public.client_site_leads` a les colonnes correspondantes, et rien de plus.
Il n'existe aucun espace de stockage pour les pièces jointes d'une demande.

Le cahier des charges du site (sections 7 et 15) demande qu'une demande arrive
dans la console avec sa spécialité, son pays, ses fichiers et sa page d'origine.
**Ce critère de recette ne peut pas être tenu sans la migration ci-dessous.**

En attendant, le site fonctionne : les champs structurés sont écrits dans un
bloc lisible du message (voir `src/lib/atlas.ts`), et le champ « pièces jointes »
du formulaire reste inactif tant que `VITE_LEAD_UPLOAD_URL` n'est pas renseigné.
Le formulaire le dit au visiteur au lieu de faire semblant.

## Ce que la migration fait

`migrations/0001_client_site_lead_structured.sql`

1. Ajoute à `client_site_leads` les colonnes `ref`, `specialty`, `country`,
   `products`, `need_date`, `supplier_name`, `contact_role`, `source`,
   `landing_page` et `attachments` (jsonb).
2. Crée une **nouvelle surcharge** de `submit_client_site_lead` avec ces
   paramètres en valeurs par défaut. L'ancienne signature reste en place : les
   autres sites clients ne sont pas touchés.
3. Valide chaque champ par longueur maximale et format avant écriture, côté
   base. La validation du navigateur ne compte pas comme protection.
4. Crée le bucket privé `client-site-lead-files`, borné à 10 Mo par fichier et
   limité aux types PDF, JPG, PNG, DOCX et XLSX.
5. N'accorde **aucun droit** sur ce bucket au rôle `anon`. Les fichiers ne sont
   lisibles que par l'équipe, par URL signée et de durée limitée.
6. Purge les fichiers des demandes restées sans suite après douze mois
   (section 13 du cahier des charges).

## Ce que la fonction d'envoi fait

`functions/client-site-upload/index.ts`

Le navigateur ne doit jamais écrire directement dans le stockage : il n'a que la
clé publique anon, et un droit d'écriture ouvert au rôle `anon` serait un point
d'entrée d'écriture publique. La fonction, elle, détient la clé de service et
reste la seule à écrire.

Elle vérifie, dans cet ordre :

- l'origine de la requête (le domaine du site, et lui seul) ;
- le nombre de fichiers (5 au plus) et la taille (10 Mo au plus) ;
- le **type réel du fichier sur ses premiers octets**, pas sur son extension
  ni sur le type déclaré par le navigateur ;
- le débit, par adresse IP et par heure, seuils en configuration.

Puis elle **régénère le nom** de chaque fichier et l'écrit dans le bucket privé.
Elle renvoie les emplacements, jamais d'URL publique.

## Mise en service

1. Faire relire la migration, puis l'appliquer sur le projet Atlas Studio.
2. Déployer la fonction, avec `ALLOWED_ORIGIN` réglé sur
   `https://gulfbridgesourcing.com`.
3. Renseigner `VITE_LEAD_UPLOAD_URL` et reconstruire le site. Le champ
   « pièces jointes » s'active alors de lui-même.
