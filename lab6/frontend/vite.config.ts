import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import mkcert from 'vite-plugin-mkcert'
import { api_proxy_addr, img_proxy_addr } from "./src/modules/target_config.ts";  // Только константы!

// https://vitejs.dev/config/
export default defineConfig(( ) => {
    return {
        plugins: [
            react(),
            mkcert(),
            VitePWA({
                registerType: 'autoUpdate',
                devOptions: {
                    enabled: true,
                },
                manifest: {
                    name: "BigOCalc",
                    short_name: "BigOCalc",
                    display: "standalone",
                    background_color: "#7978F7",
                    theme_color: "#7978F7",
                    orientation: "portrait-primary",
                    icons: [
                        {
                            src: "img/icon-192.png",
                            type: "image/png",
                            sizes: "192x192"
                        },
                        {
                            src: "img/icon-512.png",
                            type: "image/png",
                            sizes: "512x512"
                        }
                    ],
                },
                workbox: {
                    globPatterns: ['**/*.{js,css,html,ico,png,svg}']
                }
            })
        ],
        server: {
            port: 3000,
            host: '0.0.0.0',
            proxy: {
                '/api': {
                    target: api_proxy_addr,
                    changeOrigin: true,
                },
                '/lab1': {
                    target: img_proxy_addr,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/lab1/, '/lab1'),
                },
            },
        },
    }
})