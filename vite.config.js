import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Build final = UM único dist/index.html com JS, modelos (.glb) e sons embutidos,
// para abrir com dois cliques, sem internet e sem servidor (file://).
export default defineConfig({
  base: './',
  plugins: [viteSingleFile()],
  build: {
    target: 'es2022', // top-level await em main.js
    assetsInlineLimit: 100 * 1024 * 1024,
    chunkSizeWarningLimit: 20000,
    reportCompressedSize: false,
  },
  server: { open: false },
});
