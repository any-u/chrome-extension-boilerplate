import { ComponentChild, render } from "preact"

interface CreateShadowDomOptions {
  shadowTargetId: string
  styleText: string
  App: ComponentChild
  before?: () => Promise<void>
  after?: () => Promise<void>
}

export default async function createShadowDom({
  shadowTargetId,
  styleText,
  App,
  before,
  after,
}: CreateShadowDomOptions) {
  if (!!document.head.attachShadow) {
    before && await before()

    const shadowTarget = document.createElement("div")
    shadowTarget.id = shadowTargetId
    document.body.appendChild(shadowTarget)

    const shadow = shadowTarget.attachShadow({ mode: "open" })

    const style = document.createElement("style")
    style.appendChild(document.createTextNode(styleText))

    const shadowRoot = document.createElement("div")
    shadowRoot.id = "shadow-root"

    shadow.appendChild(style)
    shadow.appendChild(shadowRoot)

    render(App, shadowRoot)

    after && await after()
  } else {
    console.log("当前浏览器不支持Shadow DOM，推啊工具包-多设备切换插件不会启用")
  }
}
