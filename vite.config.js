import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Commit SHA surfaces in the UI status pill ("deployed build"). On Vercel the
// system env var is present at build time; locally we fall back to `dev`.
const sha = (process.env.VERCEL_GIT_COMMIT_SHA || process.env.COMMIT_SHA || 'dev').slice(0, 7);

export default defineConfig({
  plugins: [react()],
  define: {
    __COMMIT_SHA__: JSON.stringify(sha),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
});
