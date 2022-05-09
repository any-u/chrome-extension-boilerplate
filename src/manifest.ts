import packageJson from "../package.json"
import { ManifestType } from "@src/manifest-type"

const manifest: ManifestType = {
  manifest_version: 3,
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  background: { service_worker: "src/pages/background/index.js" },
  icons: {
    "128": "icon-128.png",
  },
  content_scripts: [
    {
      matches: ["*://*/*"],
      js: ["src/pages/demoContent/index.js"],
    },
    {
      matches: ["*://*/*"],
      js: ["src/pages/demo2Content/index.js"],
    },
  ],
}

export default manifest
