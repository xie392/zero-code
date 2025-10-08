import { ConfigEnv, UserConfigExport, defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

import pages from 'vite-plugin-pages'
import { viteMockServe } from 'vite-plugin-mock'
import sonda from 'sonda/vite'
import tailwindcss from '@tailwindcss/vite'
import inspect from 'vite-plugin-inspect'
import { codeInspectorPlugin } from 'code-inspector-plugin'

// https://vite.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfigExport => {
    const http = loadEnv(mode, process.cwd())
    
    return defineConfig({
        plugins: [
            codeInspectorPlugin({
                bundler: 'vite'
            }),
            react(),
            pages({
                importMode() {
                    // if (filepath.includes('index')) {
                    //     return 'sync'
                    // }
                    return 'async'
                }
            }),
            viteMockServe({
                enable: command === 'serve',
                ignore: (fileName: string) => {
                    if (fileName.includes('_')) {
                        return true
                    }
                    return false
                }
            }),
            sonda(),
            tailwindcss(),
            inspect(),
            codeInspectorPlugin({
                bundler: 'vite'
            })
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src')
            }
        },
        build: {
            sourcemap: true
        },
        server: {
            proxy: {
                '/api': {
                    target: http.VITE_BASE_URL,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, '')
                }
            }
        }
    })
}
