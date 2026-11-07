# Deployment guide

The store runs on a Next.js server with a PostgreSQL database for the orders. `pnpm build` prepares the site in `.next/`, and `pnpm start` runs the server. The chosen host is Netlify, which runs the server through its own Next.js integration; a plain Node.js server works the same, with no code change.
This guide covers the steps you do from your own accounts (database, hosting, domain and search engines), and what is already prepared in the project.

## What is ready in the project

| File                       | Purpose                                                                                                                                             |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `netlify.toml`             | The build command (`pnpm db:generate && pnpm db:deploy && pnpm build`), the Node version, and Netlify's Next.js plugin.                             |
| `next.config.ts`           | Security headers (CSP, HSTS and others) and caching rules, sent by the server on every host.                                                        |
| `prisma/migrations/`       | The database tables. `pnpm db:deploy` applies the ones that haven't run yet, before every build.                                                    |
| `src/app/api/health/`      | `GET /api/health/` answers `{ "status": "ok", "database": "up" }`, or 503 when the server can't reach the database.                                 |
| `.github/workflows/ci.yml` | On every push to the `main` branch and every pull request: the checks, the unit tests, the build and the browser tests, with a PostgreSQL database. |
| `.env.example`             | The variables below, with what each one is for.                                                                                                     |

### The variables

| Variable                             | Needed by                | Secret in Netlify | Value                                                                                                                           |
| ------------------------------------ | ------------------------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`               | The build                | No                | The real site URL without a trailing `/`. Share links and the sitemap are built from it, so rebuild after changing it.          |
| `DATABASE_URL`                       | The build and the server | Yes               | The PostgreSQL connection string. The build applies the migrations with it, and the server saves and reads orders with it.      |
| `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` | The build (recommended)  | No                | A random key, made once with `openssl rand -base64 32` and kept. It keeps the checkout's Server Actions working across deploys. |

> **Never** put a secret in a variable that starts with `NEXT_PUBLIC_`: those values are written into the pages and reach every visitor.

Netlify scans the built site for the values of the variables marked as secret, and stops the deploy when it finds one. Mark only `DATABASE_URL`: the site URL is written into every page, and Next writes the encryption key into the server's own files (never into the pages), so marking either of them stops every deploy. Don't add variables the project doesn't read, such as a `DIRECT_URL` copied from a Prisma guide.

## 1. Create the database

Any PostgreSQL host that gives a connection string works, such as Supabase (used for this store, steps below) or Neon.

1. Create a PostgreSQL database (version 16 or later) in the region closest to your visitors.
2. Copy its connection string. If the provider offers a "pooled" connection, use that one: the server runs as short-lived functions, and each one opens its own connection.
3. Before choosing, open the provider's website in your browser and make sure it works from your network; during the work, connections to some services were intermittent.

The tables are created by the first deploy (`pnpm db:deploy` in the build command), so nothing has to be done in the database by hand.

### With Supabase

1. Create a project and keep its database password.
2. Press **Connect**, open the **Direct** tab and copy the **Session pooler** string. It looks like `postgresql://postgres.<project-ref>:[YOUR-PASSWORD]@aws-0-<region>.pooler.supabase.com:5432/postgres`.
   - Not **Direct connection** (`db.<project-ref>.supabase.co`): it answers only over IPv6, which Netlify's builds can't reach.
   - Not the transaction pooler (port 6543): Prisma's migrations need a session.
3. Replace `[YOUR-PASSWORD]` with the database password, without the brackets. If the password has symbols such as `@`, `#` or `/`, reset it to letters and digits in **Project Settings** → **Database**.
4. Add this ending to the string: `?sslmode=require&uselibpqcompat=true&connect_timeout=30`
   - `connect_timeout=30`: Prisma gives up after 5 seconds by default, which is too short for the first encrypted connection from Netlify's builders to the pooler.
   - `sslmode=require&uselibpqcompat=true`: the connection is encrypted, without checking the certificate, as `require` means in PostgreSQL's own tools. Without `uselibpqcompat`, the `pg` driver reads `require` as "check the certificate" and refuses Supabase's chain.
5. The result is the value of `DATABASE_URL`.

A free Supabase project pauses after a week with no activity. `/api/health/` then answers 503 and orders fail, until you restore the project from Supabase's dashboard.

## 2. Deploy on Netlify (automatic deployment from GitHub)

1. Create a [Netlify](https://app.netlify.com/signup) account, then **Add new project** → **Import an existing project** → **GitHub** → choose `Kais-elm07/matjar`.
2. The build settings are read from `netlify.toml` automatically. Don't set a publish directory: the Next.js plugin takes care of it.
3. In **Project configuration** → **Environment variables**, add the three variables above. Make `DATABASE_URL` available to both **Builds** and **Functions** (on the free plan every variable has all scopes, which covers both). A secret variable has a separate value for each deploy context: fill it for **Production** and **Deploy Previews**, because an empty one stops the build.
4. **Deploy site**. The first build takes a few minutes, and then the project's address appears at the top of its page in Netlify, as `https://<project-name>.netlify.app`. Netlify picks the name; you can change it in **Project configuration**, but every Netlify user shares the same names, so a taken one is refused. If the address sends you to a Netlify login (status 401 for every page, the health check included), the project is **Private**, and only its owner can open it: open it to visitors in **Project configuration** → **General** → **Visitor access** → **Project visibility** → **Edit visibility** → **Public**.
5. Set `NEXT_PUBLIC_SITE_URL` to exactly that address, in lowercase, and deploy again (**Deploys** → **Trigger deploy**). Open the address first to make sure it shows the store: a name typed from memory may belong to someone else's site, and then every share link and the sitemap point there.
6. Open `https://<project-name>.netlify.app/api/health/`: it must answer `{"status":"ok","database":"up"}`. If it answers 503, the server can't reach the database: check `DATABASE_URL` and that the database accepts connections from outside.
7. **Domain management** → **Add a domain**, and follow the DNS instructions. The HTTPS certificate is enabled automatically.
8. After connecting the domain, change `NEXT_PUBLIC_SITE_URL` to `https://your-domain` and deploy again (**Trigger deploy**).

From then on, every push to the `main` branch deploys automatically, after applying any new migration.

> If placing an order on a deploy preview fails with an "origin" error in the function logs, add the preview's host to `experimental.serverActions.allowedOrigins` in `next.config.ts` (for example `*.netlify.app`). The live domain doesn't need it.

### When the deploy fails

These are the errors met on the first deploy of this store, in the order they appeared:

| The message in the deploy log                                                              | Cause                                                                                                                                      | Fix                                                                                                                   |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `Error: Connection url is empty`                                                           | `DATABASE_URL` has no value for this deploy context.                                                                                       | Fill its value for Production and Deploy Previews.                                                                    |
| `P1001: Can't reach database server at db.<project-ref>.supabase.co`                       | Supabase's direct connection, which answers only over IPv6.                                                                                | Use the Session pooler string (section 1).                                                                            |
| `P1001: Can't reach database server at aws-0-<region>.pooler.supabase.com`                 | Prisma's 5-second connection timeout.                                                                                                      | Add the ending from section 1, which has `connect_timeout=30`.                                                        |
| `Secret env var "<NAME>"'s value detected`, then `Secrets scanning found secrets in build` | A variable marked as secret holds a value that appears in the built site, such as the site URL.                                            | Delete the variable if the project doesn't read it, or unmark it if its value is public. Don't turn the scanning off. |
| `Module not found: Can't resolve '@/generated/prisma/client'` (from the second deploy on)  | Netlify keeps `node_modules` between builds, so pnpm installs nothing and skips the `postinstall` script that generates the Prisma client. | The build command starts with `pnpm db:generate` (in `netlify.toml`); keep it there.                                  |

If the deploy passes but orders fail and the function logs show `self-signed certificate in certificate chain`, the string has `sslmode=require` without `uselibpqcompat=true`: use the full ending from section 1.

## Alternative: your own Node.js server

The same project runs on any machine with Node.js 22 or later, behind a web server that provides HTTPS (such as nginx or Caddy):

```bash
pnpm install --frozen-lockfile
pnpm db:deploy
pnpm build
pnpm start
```

Set the three variables in the server's environment before these commands. `pnpm start` listens on port 3000 (or the `PORT` variable). Restart it after every new build.

## After deploying: checklist

1. **Features on the real URL:** the home page, a product page, search, filters and the cart, also from a real phone. The browser's console must stay free of errors; a React error #418 there means the page was drawn twice (see `src/lib/render-later.ts`).
2. **An order:** place a demo order, make sure its page opens at `/orders/<id>/`, reload it, and find the order in the database (`pnpm db:studio` with the production `DATABASE_URL`, or the provider's table viewer).
3. **The products API:** open `https://your-domain/api/products/` and `https://your-domain/api/products` (without the slash), which must redirect to the first.
4. **404 page:** open a wrong link such as `https://your-domain/abc/` and make sure the Arabic page appears with the status 404.
5. **Headers:** check the domain on [securityheaders.com](https://securityheaders.com), or from the terminal with `curl -I https://your-domain/`. Both `content-security-policy` and `strict-transport-security` must appear.
6. **Share links:** paste a product link into WhatsApp and make sure its image, name and price appear. If `localhost` appears, `NEXT_PUBLIC_SITE_URL` was not set before the build.
7. **Search engines:** in [Google Search Console](https://search.google.com/search-console), add the domain (verifying through DNS is the easiest), then go to **Sitemaps** and submit `https://your-domain/sitemap.xml`.
8. **Performance:** test the real URL in [PageSpeed Insights](https://pagespeed.web.dev) on mobile.

## Day-to-day workflow after launch

1. Edit the products in `src/data/products.ts`, and put the images in `assets/images/products/` (see the README).
2. To change the database's tables: edit `prisma/schema.prisma`, run `pnpm db:migrate` locally (it writes a migration in `prisma/migrations`), then `pnpm db:generate`, and commit the migration with the code.
3. Run `pnpm verify` locally (all the checks plus the unit tests).
4. Run `git commit`, then `git push`. GitHub Actions checks the change, and Netlify applies the migrations and deploys it within minutes.
5. To undo a broken deployment: in Netlify's dashboard, choose the previous deployment and press **Publish deploy**. This brings back the old code but not the old tables, so a migration should only add things (new tables or optional columns) that the previous code can live with.
