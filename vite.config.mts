import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import optimizer from "vite-plugin-optimizer"
import { electron, getReplacer } from './plugins'
import { esbuildDecorators } from '@anatine/esbuild-decorators'

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  build:{
    outDir: "dist/renderer",
  },
  css:{
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/renderer/styles/custom_theme.scss";`
      }
    }
  },
  plugins: [
    vue(),
    optimizer(getReplacer({
      externalsModules: ["fs"],
      electronModules: ["ipcRenderer"],
    })),
    electron({
      entryPoints: ["src/electron/main.ts"],
      outfile: "dist/main.js",
      externals:["electron"],
      plugins: [
        esbuildDecorators({
          tsconfig: './tsconfig.json',
          cwd: process.cwd(),
        })
      ]
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src/"),
    }
  }
})
