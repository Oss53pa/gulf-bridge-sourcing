/**
 * Génère le SQL qui crée les sections de contenu du site dans la console
 * Atlas Studio (public.client_site_content) à partir de src/content/defaults.ts.
 *
 *   node scripts/seed-content.ts > seed.sql            # crée les sections manquantes
 *   node scripts/seed-content.ts --force > seed.sql    # écrase aussi le contenu publié
 *
 * Sans --force, le contenu déjà édité dans la console est conservé : seuls le
 * libellé, l'ordre et la page d'aperçu sont mis à jour.
 */
import { SECTION_META, SITE_ID, defaults } from '../src/content/defaults.ts';

const PREVIEW_PATH: Record<string, string> = {
  equipement: '/equiper-votre-site', industriel: '/sites-industriels', autres: '/autres-secteurs',
  solutions: '/solutions', methode: '/methode', about: '/qui-sommes-nous',
  etude: '/demander-une-etude', contact: '/contact', legal: '/mentions-legales',
};

/** Sections supprimées par la refonte du 7 novembre 2026, à retirer de la console. */
const SECTIONS_SUPPRIMEES = [
  'approche', 'services', 'secteurs',
  'home_constat', 'home_audience', 'home_explore', 'home_positioning', 'home_startup',
];

const force = process.argv.includes('--force');
const q = (s: string) => `'${s.replace(/'/g, "''")}'`;

const values = Object.entries(defaults).map(([key, data]) => {
  const meta = SECTION_META[key as keyof typeof SECTION_META];
  return `  (${q(SITE_ID)}, ${q(key)}, ${q(meta.label)}, ${meta.order}, ${q(PREVIEW_PATH[key] ?? '/')}, ${q(JSON.stringify(data))}::jsonb)`;
});

console.log(`begin;

-- Sections supprimées par la refonte. Sans cette suppression, leur ancien
-- contenu resterait dans la console et la construction refuserait de démarrer.
delete from public.client_site_content
 where site_id = ${q(SITE_ID)}
   and key in (${SECTIONS_SUPPRIMEES.map(q).join(', ')});

insert into public.client_site_content (site_id, key, label, sort_order, preview_path, data)
values
${values.join(',\n')}
on conflict (site_id, key) do update set
  label = excluded.label,
  sort_order = excluded.sort_order,
  preview_path = excluded.preview_path${force ? ',\n  data = excluded.data,\n  updated_at = now()' : ''};

commit;`);
