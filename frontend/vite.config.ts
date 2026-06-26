import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  preview: {
    allowedHosts: ['developer-tools-portal.com', 'www.developer-tools-portal.com', 'test.developer-tools-portal.com', 'localhost', '127.0.0.1'],
    proxy: {
      '/api': 'http://backend:3000',
    },
  },
});
