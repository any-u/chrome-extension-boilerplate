import * as fs from "fs"
import * as path from "path"
import colorLog from "./log"
import manifest from "../src/manifest"
import { PluginOption } from "vite"
import { fileURLToPath } from 'url';

const { resolve } = path

const root = fileURLToPath(import.meta.url);
const dir = path.dirname(root);

const outDir = resolve(dir, "..", "public")

export function makeManifest(): PluginOption {
  return {
    name: "make-manifest",
    buildEnd() {
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir)
      }

      const manifestPath = resolve(outDir, "manifest.json")

      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))

      colorLog(`Manifest file copy complete: ${manifestPath}`, "success")
    },
  }
}
