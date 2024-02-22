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
  server:{
    hmr:{
      overlay:false // windows下不显示错误提示
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
      "@renderer": resolve(__dirname, "src/renderer/"),
      "@electron": resolve(__dirname, "src/electron/"),
      "@libs": resolve(__dirname, "src/libs/"),
    }
  }
})
