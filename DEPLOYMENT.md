# Deployment guide

The store runs on a Next.js server with a PostgreSQL database for the orders. `pnpm build` prepares the site in `.next/`, and `pnpm start` runs the server. The chosen host is Netlify, which runs the server through its own Next.js integration; a plain Node.js server works the same, with no code change.
This guide covers the steps you do from your own accounts (database, hosting, domain and search engines), and what is already prepared in the project.

## What is ready in the project

| File                       | Purpose                                                                                                                                             |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `netlify.toml`             | The build command (`pnpm db:deploy && pnpm build`), the Node version, and Netlify's Next.js plugin.                                                 |
| `next.config.ts`           | Security headers (CSP, HSTS and others) and caching rules, sent by the server on every host.                                                        |
| `prisma/migrations/`       | The database tables. `pnpm db:deploy` applies the ones that haven't run yet, before every build.                                                    |
| `src/app/api/health/`      | `GET /api/health/` answers `{ "status": "ok", "database": "up" }`, or 503 when the server can't reach the database.                                 |
| `.github/workflows/ci.yml` | On every push to the `main` branch and every pull request: the checks, the unit tests, the build and the browser tests, with a PostgreSQL database. |
| `.env.example`             | The variables below, with what each one is for.                                                                                                     |

### The variables

| Variable                             | Needed by                | Value                                                                                                                           |
| ------------------------------------ | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`               | The build                | The real site URL without a trailing `/`. Share links and the sitemap are built from it, so rebuild after changing it.          |
| `DATABASE_URL`                       | The build and the server | The PostgreSQL connection string. The build applies the migrations with it, and the server saves and reads orders with it.      |
| `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` | The build (recommended)  | A random key, made once with `openssl rand -base64 32` and kept. It keeps the checkout's Server Actions working across deploys. |

> **Never** put a secret in a variable that starts with `NEXT_PUBLIC_`: those values are written into the pages and reach every visitor.

## 1. Create the database

Any PostgreSQL host that gives a connection string works, such as Netlify's own database feature, Supabase or Neon.

1. Create a PostgreSQL database (version 16 or later) in the region closest to your visitors.
2. Copy its connection string. If the provider offers a "pooled" connection, use that one: the server runs as short-lived functions, and each one opens its own connection.
3. Before choosing, open the provider's website in your browser and make sure it works from your network; during the work, connections to some services were intermittent.

The tables are created by the first deploy (`pnpm db:deploy` in the build command), so nothing has to be done in the database by hand.

## 2. Deploy on Netlify (automatic deployment from GitHub)

1. Create a [Netlify](https://app.netlify.com/signup) account, then **Add new site** → **Import an existing project** → **GitHub** → choose `Kais-elm07/matjar`.
2. The build settings are read from `netlify.toml` automatically. Don't set a publish directory: the Next.js plugin takes care of it.
3. In **Site configuration** → **Environment variables**, add the three variables above. Make `DATABASE_URL` available to both **Builds** and **Functions**.
4. **Deploy site**. The first build takes a few minutes, and then a `*.netlify.app` URL appears.
5. Open `https://<the-site>.netlify.app/api/health/`: it must answer `{"status":"ok","database":"up"}`. If it answers 503, the server can't reach the database: check `DATABASE_URL` and that the database accepts connections from outside.
6. **Domain management** → **Add a domain**, and follow the DNS instructions. The HTTPS certificate is enabled automatically.
7. After connecting the domain, change `NEXT_PUBLIC_SITE_URL` to `https://your-domain` and deploy again (**Trigger deploy**).

From then on, every push to the `main` branch deploys automatically, after applying any new migration.

> If placing an order on a deploy preview fails with an "origin" error in the function logs, add the preview's host to `experimental.serverActions.allowedOrigins` in `next.config.ts` (for example `*.netlify.app`). The live domain doesn't need it.

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

1. **Features on the real URL:** the home page, a product page, search, filters and the cart, also from a real phone.
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
