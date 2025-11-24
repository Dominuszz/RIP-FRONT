import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      manifest:{
        name: "BigOCalc", 
        short_name: "BigOCalc",
        start_url: "/RIP-FRONT/",
        display: "standalone",
        background_color: "#fdfdfd",
        theme_color: "#db4938",
        orientation: "portrait-primary",
        icons: [
          {
            "src": "small_logo512x512.png",
            "type": "image/png", "sizes": "192x192"
          },
          {
            "src": "small_logo512x512.png",
            "type": "image/png", "sizes": "512x512"
          }
        ],
      }
    })
  ],
  base: '/',
  server: {
    cors: true,
    watch: {
        usePolling: true,
    }, 
    strictPort: true,
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
      "/test": {
        target: "http://localhost:9000",
        changeOrigin: true,
        secure: false,
      }
    },
  },
});