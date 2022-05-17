import config from "./config"
import { build } from "vite"

async function main() {
  return await Promise.all(Object.keys(config).map((key) => build(config[key])))
}

main().catch(console.error)
