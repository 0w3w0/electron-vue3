import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';
import optimizer from "vite-plugin-optimizer";
import { electronPlugin, getReplacer } from './plugins/electron-plugin'
import { esbuildDecorators } from '@anatine/esbuild-decorators';

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
      plugins: [
        esbuildDecorators({
          tsconfig: './tsconfig.json',
        }),
      ]
    }),
    
  ],
  resolve: {
    alias: {
      "@common": resolve(__dirname, "./src/common"),
      "@renderer": resolve(__dirname, "./src/renderer"),
      "@electron": resolve(__dirname, "./src/electron"),
    }
  }
})
