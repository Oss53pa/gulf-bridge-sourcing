import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5180 },
  preview: { port: 5180 },
  build: {
    // Le poids de la première visite doit rester sous 1 Mo hors photos.
    chunkSizeWarningLimit: 400,
  },
});
