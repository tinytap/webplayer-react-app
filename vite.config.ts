import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
import { VitePluginFonts } from 'vite-plugin-fonts'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        VitePluginFonts({
            custom: {
                families: [
                    {
                        name: 'MikadoLight',
                        src: './src/assets/fonts/Mikado/MikadoLight.*',
                    },
                    {
                        name: 'MikadoRegular',
                        src: './src/assets/fonts/Mikado/MikadoRegular.*',
                    },
                    {
                        name: 'MikadoMedium',
                        src: './src/assets/fonts/Mikado/MikadoMedium.*',
                    },
                    {
                        name: 'MikadoBold',
                        src: './src/assets/fonts/Mikado/MikadoBold.*',
                    },
                ],
                display: 'swap',
                preload: true,
                prefetch: false,
                injectTo: 'head-prepend',
            },
        }),
        react(),
        svgr(),
    ],
})

