import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        clientsClaim: true,
        skipWaiting: true
      },
      devOptions: {
        enabled: true
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],


      manifest: {
        name: 'Mx Materiais Elétricos',
        short_name: 'M X',
        description: 'Painel do Cliente - Mx Materiais Elétricos',

        theme_color: '#ffffff',
        icons: [
          {
            src: 'mx-logo-v2-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'mx-logo-v2-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'mx-logo-v2-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }


        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

