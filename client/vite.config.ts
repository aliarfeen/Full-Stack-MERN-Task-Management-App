import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const apiUrl = process.env.VITE_API_URL ?? 'http://localhost:5000';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: apiUrl,
        changeOrigin: true,
      },
    },
  },
});
