import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import optimizer from "vite-plugin-optimizer"
import { electron, getReplacer } from './plugins'

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
      entryPoints: ["electron/main.ts"],
      outfile: "dist/main.js",
      externals:["electron"]
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@electron": resolve(__dirname, "electron"),
      "@libs": resolve(__dirname, "libs"),
    }
  }
})
