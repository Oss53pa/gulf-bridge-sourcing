import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5180 },
  preview: { port: 5180 },
  build: {
    // Les polices restent des fichiers servis par le site : la CSP (font-src 'self') refuse les polices en data:.
    assetsInlineLimit: (filePath: string) => (/\.(woff2?|ttf|otf)$/i.test(filePath) ? false : undefined),
  },
});
