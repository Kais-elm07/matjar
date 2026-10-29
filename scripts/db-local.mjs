#!/usr/bin/env node
/**
 * قاعدة بيانات PostgreSQL محلية للتطوير.
 *
 * يشغّل نسخة مستقلة خاصة بالمتجر باستخدام PostgreSQL المثبت على جهازك.
 * لا تحتاج كلمة مرور، وتعمل على هذا الجهاز فقط (localhost)، ولا تمس خدمة PostgreSQL الأصلية.
 *
 * الأوامر:
 *   pnpm db:start    تهيئة القاعدة (أول مرة فقط) ثم تشغيلها
 *   pnpm db:stop     إيقافها
 *   pnpm db:status   عرض حالتها
 *
 * إعدادات اختيارية عبر متغيرات البيئة:
 *   LOCAL_PG_PORT    المنفذ (الافتراضي 5433)
 *   LOCAL_PG_DIR     مجلد البيانات (الافتراضي: %LOCALAPPDATA%\matjar على Windows)
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

/** يبحث عن أداة PostgreSQL في PATH، ثم في مجلد التثبيت الافتراضي على Windows. */
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
  // عند تشغيل الخادم نفصل المخرجات: عملية PostgreSQL ترث مقابض الطرفية
  // فتبقيها مفتوحة، وهذا يعلّق الأدوات التي تنتظر انتهاء المخرجات (مثل CI أو VS Code).
  // رسائل الخادم تذهب إلى ملف السجل بدلاً من ذلك.
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
    `\nرابط الاتصال (موجود في ملف .env):\n  DATABASE_URL="${DATABASE_URL}"`
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
