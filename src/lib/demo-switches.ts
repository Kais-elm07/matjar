/**
 * Demo switches: a way to see the store's loading, error and empty states without breaking anything.
 * The products API and the two data files the browser loads (/cart-catalog.json and
 * /similar-products.json) read them from the request's query:
 *
 *   ?delay=3000   the answer waits 3 seconds (10 at most)
 *   ?fail=500     the answer is that error (a status from 400 to 599)
 *   ?empty=1      the product lists come back empty
 *
 * The server obeys them only outside production (pnpm dev), or when it runs with DEMO_SWITCHES=1 (the
 * browser tests), so the live store ignores them and nobody can slow it down. To see the whole store in
 * one state, put the switches in NEXT_PUBLIC_DEMO_SWITCHES (for example "delay=3000"): the browser then
 * adds them to every request it sends to those addresses. Restart pnpm dev after changing it.
 */

type DemoSwitches = {
  delayMs: number
  failStatus: number | null
  empty: boolean
}

const MAX_DELAY_MS = 10_000

/** Reads the switches from a query. A missing or invalid value leaves its switch off. */
export function parseDemoSwitches(params: URLSearchParams): DemoSwitches {
  const delay = Number(params.get("delay"))
  const fail = Number(params.get("fail"))
  return {
    delayMs:
      Number.isInteger(delay) && delay > 0 ? Math.min(delay, MAX_DELAY_MS) : 0,
    failStatus:
      Number.isInteger(fail) && fail >= 400 && fail <= 599 ? fail : null,
    empty: params.get("empty") === "1",
  }
}

/** Whether the server obeys the switches: never in production, unless DEMO_SWITCHES=1 says so. */
function switchesOn() {
  return (
    process.env.NODE_ENV !== "production" || process.env.DEMO_SWITCHES === "1"
  )
}

/**
 * Applies a request's switches before the server answers it: waits for the delay, then returns the
 * failure to send instead of the answer, if any, and whether the lists should be empty.
 */
export async function applyDemoSwitches(
  request: Request
): Promise<{ failure: Response | null; empty: boolean }> {
  if (!switchesOn()) return { failure: null, empty: false }

  const { delayMs, failStatus, empty } = parseDemoSwitches(
    new URL(request.url).searchParams
  )
  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }
  const failure =
    failStatus === null
      ? null
      : Response.json(
          // "A demo switch made this request fail"
          { error: "أفشل مفتاح العرض التجريبي هذا الطلب" },
          { status: failStatus, headers: { "Cache-Control": "no-store" } }
        )
  return { failure, empty }
}

/** The address with the switches of NEXT_PUBLIC_DEMO_SWITCHES added, for the requests the browser sends. */
export function withDemoSwitches(url: string) {
  const switches = process.env.NEXT_PUBLIC_DEMO_SWITCHES
  if (!switches) return url
  return `${url}${url.includes("?") ? "&" : "?"}${switches}`
}
