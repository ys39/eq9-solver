// vite.config.js
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: "src",
  build: {
    base: "./",
    outDir: resolve(__dirname, "dist"),
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        eq9: resolve(__dirname, 'src/eq9.html')
      }
    }
  }
});
