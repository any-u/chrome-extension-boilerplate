import {
  IndexHtmlTransformContext,
  IndexHtmlTransformResult,
  Plugin,
} from "vite"

/**
 * Inject the CSS compiled with JS.
 *
 * @return {Plugin}
 */
export function cssInjectedByJsPlugin(
  { topExecutionPriority, styleId, ignores } = {
    topExecutionPriority: true,
    styleId: "",
    ignores: [],
  }
): Plugin {
  //Globally so we can add it to legacy and non-legacy bundle.
  let cssToInject: string = ""

  return {
    apply: "build",
    enforce: "post",
    name: "css-in-js-plugin",
    generateBundle(opts, bundle) {
      let styleCode = ""
      for (const key in bundle) {
        if (bundle[key] && !ignores.includes(key)) {
          const chunk = bundle[key]

          if (chunk.type === "asset" && chunk.fileName.includes(".css")) {
            styleCode += chunk.source
            delete bundle[key]
          }
        }
      }

      if (styleCode.length > 0) {
        cssToInject = styleCode
      }

      for (const key in bundle) {
        if (bundle[key] && !ignores.includes(key)) {
          const chunk = bundle[key]

          if (
            chunk.type === "chunk" &&
            chunk.fileName.match(/.[cm]?js$/) != null &&
            !chunk.fileName.includes("polyfill")
          ) {
            let topCode: string = ""
            let bottomCode: string = ""
            if (topExecutionPriority) {
              bottomCode = chunk.code
            } else {
              topCode = chunk.code
            }

            chunk.code = topCode
            chunk.code +=
              "(function(){ try {var elementStyle = document.createElement('style'); elementStyle.appendChild(document.createTextNode("
            chunk.code += JSON.stringify(cssToInject.trim())
            chunk.code += ")); "
            if (typeof styleId == "string" && styleId.length > 0) {
              chunk.code += ` elementStyle.id = "${styleId}"; `
            }
            chunk.code +=
              "document.head.appendChild(elementStyle);} catch(e) {console.error('vite-plugin-css-injected-by-js', e);} })();"
            chunk.code += bottomCode

            break
          }
        }
      }
    },
    transformIndexHtml: {
      enforce: "post",
      transform(
        html: string,
        ctx?: IndexHtmlTransformContext
      ): IndexHtmlTransformResult {
        if (!ctx || !ctx.bundle) return html

        for (const [, value] of Object.entries(ctx.bundle)) {
          if (value.fileName.endsWith(".css")) {
            // Remove CSS link from HTML generated.
            const reCSS = new RegExp(
              `<link rel="stylesheet"[^>]*?href="/${value.fileName}"[^>]*?>`
            )
            html = html.replace(reCSS, "")
          }
        }

        return html
      },
    },
  }
}
