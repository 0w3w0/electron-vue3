import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';
import optimizer from "vite-plugin-optimizer";
import { electronPlugin, getReplacer } from './plugins/electron-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  build:{
    outDir: "dist/renderer",
  },
  plugins: [
    vue(),
    optimizer(getReplacer({
      externalsModules: ["fs"],
      electronModules: ["ipcRenderer"],
    })),
    electronPlugin({
      entryPoints: ["src/electron/startup.ts"],
      externals:["electron"],
      plugins: []
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src/"),
    }
  }
})
