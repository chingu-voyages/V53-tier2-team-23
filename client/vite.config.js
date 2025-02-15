import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      generateScopedName: '[local]', // prevent prefixes in css classNames
    },
  },
  base: '/V53-tier2-team-23/',
});
