import { afterEach, describe, expect, it, vi } from "vitest"

import {
  applyDemoSwitches,
  parseDemoSwitches,
  withDemoSwitches,
} from "@/lib/demo-switches"

const parse = (query: string) => parseDemoSwitches(new URLSearchParams(query))

afterEach(() => {
  vi.unstubAllEnvs()
})

describe("parseDemoSwitches", () => {
  it("reads the delay, the failure and the empty lists", () => {
    expect(parse("delay=3000&fail=500&empty=1")).toEqual({
      delayMs: 3000,
      failStatus: 500,
      empty: true,
    })
  })

  it("leaves every switch off without a query", () => {
    expect(parse("")).toEqual({ delayMs: 0, failStatus: null, empty: false })
  })

  it("caps the delay at 10 seconds and ignores a delay that isn't a positive whole number", () => {
    expect(parse("delay=60000").delayMs).toBe(10_000)
    expect(parse("delay=-5").delayMs).toBe(0)
    expect(parse("delay=abc").delayMs).toBe(0)
    expect(parse("delay=1.5").delayMs).toBe(0)
  })

  it("accepts only an error status from 400 to 599", () => {
    expect(parse("fail=404").failStatus).toBe(404)
    expect(parse("fail=200").failStatus).toBeNull()
    expect(parse("fail=700").failStatus).toBeNull()
    expect(parse("fail=yes").failStatus).toBeNull()
  })

  it("empties the lists only with empty=1", () => {
    expect(parse("empty=0").empty).toBe(false)
    expect(parse("empty=true").empty).toBe(false)
  })
})

describe("applyDemoSwitches", () => {
  const request = (query: string) =>
    new Request(`http://localhost/api/products/?${query}`)

  it("answers with the requested failure", async () => {
    const { failure } = await applyDemoSwitches(request("fail=503"))
    expect(failure?.status).toBe(503)
    expect(await failure?.json()).toHaveProperty("error")
  })

  it("waits for the delay before answering", async () => {
    vi.useFakeTimers()
    let done = false
    const applying = applyDemoSwitches(request("delay=2000")).then(() => {
      done = true
    })
    await vi.advanceTimersByTimeAsync(1999)
    expect(done).toBe(false)
    await vi.advanceTimersByTimeAsync(1)
    await applying
    expect(done).toBe(true)
    vi.useRealTimers()
  })

  it("is ignored in production, unless DEMO_SWITCHES=1 turns it on", async () => {
    vi.stubEnv("NODE_ENV", "production")
    expect(await applyDemoSwitches(request("fail=500&empty=1"))).toEqual({
      failure: null,
      empty: false,
    })

    vi.stubEnv("DEMO_SWITCHES", "1")
    const { failure, empty } = await applyDemoSwitches(
      request("fail=500&empty=1")
    )
    expect(failure?.status).toBe(500)
    expect(empty).toBe(true)
  })
})

describe("withDemoSwitches", () => {
  it("leaves the address alone when NEXT_PUBLIC_DEMO_SWITCHES isn't set", () => {
    vi.stubEnv("NEXT_PUBLIC_DEMO_SWITCHES", "")
    expect(withDemoSwitches("/api/products/")).toBe("/api/products/")
  })

  it("adds the switches to the address, after a query it already has", () => {
    vi.stubEnv("NEXT_PUBLIC_DEMO_SWITCHES", "delay=3000")
    expect(withDemoSwitches("/cart-catalog.json")).toBe(
      "/cart-catalog.json?delay=3000"
    )
    expect(withDemoSwitches("/api/products/?q=x")).toBe(
      "/api/products/?q=x&delay=3000"
    )
  })
})
