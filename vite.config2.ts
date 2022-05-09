import { defineConfig } from "vite"
import { resolve } from "path"
import preact from "@preact/preset-vite"
import { cssInjectedByJsPlugin } from "./plugins"

const root = resolve(__dirname, "src")
const pagesDir = resolve(root, "pages")
const assetsDir = resolve(root, "assets")
const publicDir = resolve(__dirname, "public")

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@src": root,
      "@assets": assetsDir,
      "@pages": pagesDir,
    },
  },
  plugins: [preact(), cssInjectedByJsPlugin()],
  publicDir,
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: {
        demo2Content: resolve(pagesDir, "content", "demo2", "main.tsx"),
      },
      output: {
        format: 'iife',
        entryFileNames: (chunk) => `src/pages/${chunk.name}/index.js`,
      },
    },
  },
})
