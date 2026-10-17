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
  approche: '/notre-approche', services: '/services', methode: '/methode', secteurs: '/secteurs',
  about: '/qui-sommes-nous', contact: '/contact', legal: '/mentions-legales',
};

const force = process.argv.includes('--force');
const q = (s: string) => `'${s.replace(/'/g, "''")}'`;

const values = Object.entries(defaults).map(([key, data]) => {
  const meta = SECTION_META[key as keyof typeof SECTION_META];
  return `  (${q(SITE_ID)}, ${q(key)}, ${q(meta.label)}, ${meta.order}, ${q(PREVIEW_PATH[key] ?? '/')}, ${q(JSON.stringify(data))}::jsonb)`;
});

console.log(`insert into public.client_site_content (site_id, key, label, sort_order, preview_path, data)
values
${values.join(',\n')}
on conflict (site_id, key) do update set
  label = excluded.label,
  sort_order = excluded.sort_order,
  preview_path = excluded.preview_path${force ? ',\n  data = excluded.data,\n  updated_at = now()' : ''};`);
