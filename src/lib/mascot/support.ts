let webgl2: boolean | undefined

/**
 * Whether the browser can draw Najm (three.js needs WebGL 2). Checked once, before his code is downloaded,
 * and the test canvas is released at once so it doesn't hold a graphics context.
 */
export function supportsWebGL2() {
  if (webgl2 !== undefined) return webgl2
  try {
    const context = document.createElement("canvas").getContext("webgl2")
    webgl2 = context !== null
    context?.getExtension("WEBGL_lose_context")?.loseContext()
  } catch {
    webgl2 = false
  }
  return webgl2
}
