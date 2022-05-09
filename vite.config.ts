import { defineConfig } from "vite"
import { resolve } from "path"
import preact from "@preact/preset-vite"
import { makeManifest, cssInjectedByJsPlugin } from "./plugins"

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
  plugins: [
    preact(),
    // 避免生成style文件，会将style注入js文件
    cssInjectedByJsPlugin({
      topExecutionPriority: true,
      styleId: "",
      // 忽略background注入
      ignores: ["src/pages/background/index.js"],
    }),
    // 拷贝manifest.json 文件
    makeManifest(),
  ],
  publicDir,
  build: {
    rollupOptions: {
      input: {
        background: resolve(pagesDir, "background", "index.ts"),
        demoContent: resolve(pagesDir, "content", "demo", "main.tsx"),
      },
      output: {
        entryFileNames: (chunk) => `src/pages/${chunk.name}/index.js`,
      },
    },
  },
})
