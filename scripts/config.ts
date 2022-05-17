import {  InlineConfig } from "vite"
import { resolve, dirname } from "path"
import preact from "@preact/preset-vite"
import { makeManifest, cssInjectedByJsPlugin } from "../plugins/index"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const root = resolve(__dirname, "../src")
const pagesDir = resolve(root, "pages")
const assetsDir = resolve(root, "assets")
const publicDir = resolve(__dirname, "../public")

interface Config {
  [key: string]: InlineConfig
}

// TODO: pick common config
const config: Config = {
  demo: {
    resolve: {
      alias: {
        "@src": root,
        "@assets": assetsDir,
        "@pages": pagesDir,
      },
    },
    publicDir,
    plugins: [
      preact(),
      cssInjectedByJsPlugin({
        topExecutionPriority: true,
        styleId: "",
        ignores: ["src/pages/background/index.js"],
      }),
      makeManifest(),
    ],
    build: {
      rollupOptions: {
        input: {
          background: resolve(pagesDir, "background", "index.ts"),
          demoContent: resolve(pagesDir, "content", "demo", "main.tsx"),
        },
        output: {
          // @ts-ignore
          entryFileNames: (chunk) => `src/pages/${chunk.name}/index.js`,
        },
      },
    },
  },

  demo2: {
    resolve: {
      alias: {
        "@src": root,
        "@assets": assetsDir,
        "@pages": pagesDir,
      },
    },
    publicDir,
    plugins: [preact(), cssInjectedByJsPlugin()],
    build: {
      emptyOutDir: false,
      rollupOptions: {
        input: resolve(pagesDir, "content", "demo2", "main.tsx"),
        output: {
          format: "iife",
          inlineDynamicImports: true,
          entryFileNames: () => `src/pages/demo2Content/index.js`,
        },
      },
    },
  },

}


export default config