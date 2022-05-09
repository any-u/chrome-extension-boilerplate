import App, { shadowTargetId } from "./App"
import styleText from "./styles/index.scss"
import createShadowDom from "../shared/shadowDom"

async function main() {
  await createShadowDom({
    shadowTargetId,
    styleText,
    App: <App />,
  })
}

main().catch(console.error)
