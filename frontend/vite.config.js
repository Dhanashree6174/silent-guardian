import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: './',  // <-- relative base path so Electron can load assets locally
  plugins: [react()],
  root: 'src',
  build: {
    outDir: '../public',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
