import { createServer } from "node:http"

import { FAKE_STORAGE_KEY, FAKE_STORAGE_PORT } from "./fake-storage-address"

/**
 * A stand-in for Supabase Storage in the browser tests, started by playwright.config.ts next to the
 * store, so uploading a photo in the admin panel is tested without the real project. It answers the
 * three requests src/lib/admin/uploads.ts makes, with the same addresses: saving a copy (which needs
 * the key, and refuses a name already taken), reading a public copy, and reading the bucket. The copies
 * stay in memory until the tests end.
 */

const objects = new Map<string, Buffer>()
const BUCKET = "product-images"

const server = createServer((request, response) => {
  const { pathname } = new URL(request.url ?? "/", "http://localhost")
  const saved = /^\/storage\/v1\/object\/public\/(.+)$/.exec(pathname)
  const saving = /^\/storage\/v1\/object\/(?!public\/)(.+)$/.exec(pathname)

  if (request.method === "POST" && saving) {
    const name = saving[1]
    if (request.headers.apikey !== FAKE_STORAGE_KEY) {
      response.writeHead(403).end()
      return
    }
    if (objects.has(name)) {
      response.writeHead(409).end()
      return
    }
    const chunks: Buffer[] = []
    request.on("data", (chunk: Buffer) => chunks.push(chunk))
    request.on("end", () => {
      objects.set(name, Buffer.concat(chunks))
      response.writeHead(200, { "content-type": "application/json" })
      response.end(JSON.stringify({ Key: name }))
    })
    return
  }

  const copy = request.method === "GET" && saved ? objects.get(saved[1]) : null
  if (copy) {
    response.writeHead(200, {
      "content-type": "image/webp",
      "access-control-allow-origin": "*",
    })
    response.end(copy)
    return
  }

  if (pathname === `/storage/v1/bucket/${BUCKET}`) {
    response.writeHead(200, { "content-type": "application/json" })
    response.end(JSON.stringify({ id: BUCKET, public: true }))
    return
  }

  response.writeHead(404).end()
})

server.listen(FAKE_STORAGE_PORT)
