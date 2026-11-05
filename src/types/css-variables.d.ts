import "react"

declare module "react" {
  /** Lets inline styles set CSS custom properties, such as `--normal-bg`. */
  interface CSSProperties {
    [property: `--${string}`]: string | number | undefined
  }
}
