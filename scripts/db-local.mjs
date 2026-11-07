#!/usr/bin/env node
/**
 * A local PostgreSQL database for development.
 *
 * Runs a separate instance for the store with the PostgreSQL installed on this machine. It needs no
 * password, listens on this machine only (localhost), and doesn't touch the installed PostgreSQL service.
 *
 * Commands:
 *   pnpm db:start    set the database up (first time only), then start it
 *   pnpm db:stop     stop it
 *   pnpm db:status   show whether it is running
 *
 * Optional environment variables:
 *   LOCAL_PG_PORT    the port (5433 by default)
 *   LOCAL_PG_DIR     the data folder (by default %LOCALAPPDATA%\matjar on Windows)
 *
 * The messages are in Arabic, for the store owner.
 */
import { spawnSync } from "node:child_process"
import { existsSync, mkdirSync, readdirSync } from "node:fs"
import os from "node:os"
import path from "node:path"

const PORT = process.env.LOCAL_PG_PORT ?? "5433"
const BASE_DIR =
  process.env.LOCAL_PG_DIR ??
  path.join(
    process.env.LOCALAPPDATA ?? path.join(os.homedir(), ".local", "share"),
    "matjar"
  )
const DATA_DIR = path.join(BASE_DIR, "pgdata")
const LOG_FILE = path.join(BASE_DIR, "postgres.log")
const DATABASE_URL = `postgresql://postgres@localhost:${PORT}/matjar`

/** Finds a PostgreSQL tool on the PATH, then in the default install folder on Windows. */
function findPgBin(name) {
  const exe = process.platform === "win32" ? `${name}.exe` : name
  if (spawnSync(exe, ["--version"], { stdio: "ignore" }).status === 0) {
    return exe
  }

  if (process.platform === "win32") {
    const root = path.join(
      process.env.ProgramFiles ?? "C:\\Program Files",
      "PostgreSQL"
    )
    if (existsSync(root)) {
      const versions = readdirSync(root)
        .filter((v) => existsSync(path.join(root, v, "bin", exe)))
        .sort((a, b) => Number(b) - Number(a))
      if (versions.length > 0) return path.join(root, versions[0], "bin", exe)
    }
  }

  console.error(
    `لم يتم العثور على ${name}. ثبّت PostgreSQL من https://www.postgresql.org/download/ ثم أعد المحاولة.`
  )
  process.exit(1)
}

function run(bin, args, { detachOutput = false } = {}) {
  // When starting the server, its output is detached: the PostgreSQL process would inherit the terminal's
  // handles and keep them open, which hangs tools that wait for the output to end (such as CI or VS Code).
  // The server's messages go to the log file instead.
  const stdio = detachOutput ? "ignore" : "inherit"
  return spawnSync(bin, args, { stdio }).status ?? 1
}

function isRunning(pgCtl) {
  return (
    spawnSync(pgCtl, ["status", "-D", DATA_DIR], { stdio: "ignore" }).status ===
    0
  )
}

function printConnectionInfo() {
  console.log(
    `\nرابط الاتصال (ضعه في ملف .env):\n  DATABASE_URL="${DATABASE_URL}"`
  )
}

function init() {
  if (existsSync(path.join(DATA_DIR, "PG_VERSION"))) return

  console.log(`تهيئة قاعدة بيانات جديدة في: ${DATA_DIR}`)
  mkdirSync(BASE_DIR, { recursive: true })
  const status = run(findPgBin("initdb"), [
    "-D",
    DATA_DIR,
    "-U",
    "postgres",
    "--auth=trust",
    "--encoding=UTF8",
    "--locale=C",
  ])
  if (status !== 0) {
    console.error("فشلت تهيئة قاعدة البيانات.")
    process.exit(status)
  }
}

function start() {
  init()
  const pgCtl = findPgBin("pg_ctl")

  if (isRunning(pgCtl)) {
    console.log(`قاعدة البيانات تعمل بالفعل على المنفذ ${PORT}.`)
    printConnectionInfo()
    return
  }

  console.log("جارٍ تشغيل قاعدة البيانات...")
  const status = run(
    pgCtl,
    ["start", "-D", DATA_DIR, "-l", LOG_FILE, "-o", `-p ${PORT}`, "-w"],
    { detachOutput: true }
  )
  if (status !== 0) {
    console.error(`تعذّر التشغيل. راجع السجل: ${LOG_FILE}`)
    process.exit(status)
  }

  console.log(`\nقاعدة البيانات تعمل الآن على المنفذ ${PORT}.`)
  printConnectionInfo()
}

function stop() {
  const pgCtl = findPgBin("pg_ctl")
  if (!isRunning(pgCtl)) {
    console.log("قاعدة البيانات متوقفة بالفعل.")
    return
  }
  process.exit(run(pgCtl, ["stop", "-D", DATA_DIR, "-m", "fast", "-w"]))
}

function status() {
  if (!existsSync(path.join(DATA_DIR, "PG_VERSION"))) {
    console.log("لم تتم تهيئة قاعدة البيانات بعد. شغّل: pnpm db:start")
    return
  }
  const running = isRunning(findPgBin("pg_ctl"))
  console.log(
    running
      ? `قاعدة البيانات تعمل على المنفذ ${PORT}.`
      : "قاعدة البيانات متوقفة. شغّلها بالأمر: pnpm db:start"
  )
  console.log(`مجلد البيانات: ${DATA_DIR}`)
  if (running) printConnectionInfo()
}

const commands = { start, stop, status }
const command = process.argv[2]

if (!(command in commands)) {
  console.error("الاستخدام: node scripts/db-local.mjs <start|stop|status>")
  process.exit(1)
}

commands[command]()
