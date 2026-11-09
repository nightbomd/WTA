
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Baseline',
        short_name: 'Baseline',
        description: 'Your personal fitness tracker',
        display: 'standalone',
        start_url: '/',
        theme_color: '#111111',
        background_color: '#111111',
        icons: [
          {
            src: '/app.logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/app.logo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],

  base: '/',

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
});
