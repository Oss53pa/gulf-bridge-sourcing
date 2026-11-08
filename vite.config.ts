import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const REQUIRED = ['VITE_ATLAS_SUPABASE_URL', 'VITE_ATLAS_SUPABASE_ANON_KEY'];

export default defineConfig(({ command, mode }) => {
  if (command === 'build') {
    // Sans ces variables, le site se construit mais le formulaire est désactivé et le contenu de la
    // console n'est pas lu : on préfère arrêter le build. Le BOM qu'ajoute Windows PowerShell 5
    // (Set-Content -Encoding utf8) au début du .env rend la première variable illisible.
    const env = loadEnv(mode, '.', 'VITE_');
    const missing = REQUIRED.filter(k => !env[k]?.trim());
    if (missing.length) {
      throw new Error(
        `Variables manquantes : ${missing.join(', ')}.\n`
        + 'Renseignez-les dans .env (voir .env.example), enregistré sans BOM (UTF-8 sans BOM ou ASCII).',
      );
    }
  }
  return {
    plugins: [react()],
    server: { port: 5180 },
    preview: { port: 5180 },
    build: {
      // Les polices restent des fichiers servis par le site : la CSP (font-src 'self') refuse les polices en data:.
      assetsInlineLimit: (filePath: string) => (/\.(woff2?|ttf|otf)$/i.test(filePath) ? false : undefined),
    },
  };
});
