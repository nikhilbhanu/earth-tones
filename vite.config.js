import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.js', '.jsx', '.json']
  },
  server: {
    port: 5173,
    host: true,
    open: true
  },
  build: {
    sourcemap: true,
    outDir: 'dist'
  },
  optimizeDeps: {
    include: ['tone']
  }
});
