/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ATLAS_SUPABASE_URL?: string;
  readonly VITE_ATLAS_SUPABASE_ANON_KEY?: string;
  readonly VITE_CONSOLE_ORIGINS?: string;
}
