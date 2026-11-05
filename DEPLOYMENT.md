# Deployment guide (phase 8)

The site is fully static: `pnpm build` creates the `out/` folder, which is all the host needs. There is no server and no database.
This guide covers the steps you do from your own accounts (hosting, domain and search engines), and what is already prepared in the project.

## What is ready in the project

| File                       | Purpose                                                                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `public/_headers`          | Security headers (CSP, HSTS and others) and caching rules. Cloudflare Pages and Netlify read it automatically from the `out` folder. |
| `netlify.toml`             | The build command, the output folder and the Node version for Netlify.                                                               |
| `out/404.html`             | The Arabic "Page not found" page, which static hosts use automatically for wrong links.                                              |
| `out/sitemap.xml`          | The sitemap with every product, category and page; `out/robots.txt` points to it.                                                    |
| `.github/workflows/ci.yml` | On every push to the `main` branch and every pull request: the checks, the unit and browser tests, and the site build.               |
| `.env.example`             | The `NEXT_PUBLIC_SITE_URL` variable: the real site URL, used for share links and the sitemap.                                        |

> **Important:** the share image links and the sitemap are built from `NEXT_PUBLIC_SITE_URL`. Set it on the host to the real site URL (without a trailing `/`) before building, and rebuild after connecting the domain.

## Recommended: Cloudflare Pages (free, automatic deployment from GitHub)

1. Create a [Cloudflare](https://dash.cloudflare.com/sign-up) account if you don't have one.
2. From the menu: **Workers & Pages** → **Create** → **Pages** → **Connect to Git**, and choose the `Kais-elm07/matjar` repository (allow Cloudflare to access it when asked).
3. Build settings:
   - **Framework preset:** None (or Next.js (Static HTML Export) if it appears).
   - **Build command:** `pnpm build`
   - **Build output directory:** `out`
   - **Environment variables (Production):**
     - `NODE_VERSION` = `24`
     - `NEXT_PUBLIC_SITE_URL` = the project's temporary URL, such as `https://matjar.pages.dev` (you will change it after connecting the domain).
4. Press **Save and Deploy**. The first build takes about 3 to 5 minutes, and then a `*.pages.dev` URL appears.
5. Connect the domain: from the project page → **Custom domains** → **Set up a custom domain** → type your domain and follow the DNS instructions. The HTTPS certificate is enabled automatically within minutes.
6. After connecting the domain: change `NEXT_PUBLIC_SITE_URL` to `https://your-domain`, then **Deployments** → **Retry deployment** (or push any change to GitHub), so the links are built with the right domain.

From then on, every push to the `main` branch deploys automatically.

## Alternative: Netlify (free, automatic deployment from GitHub)

1. Create a [Netlify](https://app.netlify.com/signup) account, then **Add new site** → **Import an existing project** → **GitHub** → choose `Kais-elm07/matjar`.
2. The build settings are read from `netlify.toml` automatically (`pnpm build` and the `out` folder). Only add the `NEXT_PUBLIC_SITE_URL` variable, from **Site configuration** → **Environment variables**.
3. **Deploy site**, then **Domain management** → **Add a domain**. The HTTPS certificate is enabled automatically.
4. After connecting the domain, update `NEXT_PUBLIC_SITE_URL` and deploy again (**Trigger deploy**).

## Deploying without GitHub (manual upload)

This suits a quick test, or a host that does not connect to GitHub:

1. Set the URL locally in the `.env` file, `NEXT_PUBLIC_SITE_URL="https://your-domain"`, then run `pnpm build`.
2. Upload the contents of the `out/` folder:
   - **Cloudflare Pages:** from the project dashboard choose **Upload assets** and drag the `out` folder, or from the terminal run `pnpm dlx wrangler pages deploy out --project-name matjar` (it asks you to sign in in the browser the first time).
   - **Netlify:** drag the `out` folder onto [app.netlify.com/drop](https://app.netlify.com/drop).
   - **Regular hosting (cPanel):** upload the contents of `out/` to `public_html`, and add an `.htaccess` file with this content so the 404 page and the headers work:

     ```apache
     ErrorDocument 404 /404.html
     <IfModule mod_headers.c>
       Header set X-Content-Type-Options "nosniff"
       Header set X-Frame-Options "DENY"
       Header set Referrer-Policy "strict-origin-when-cross-origin"
       Header set Strict-Transport-Security "max-age=31536000; includeSubDomains"
     </IfModule>
     ```

> GitHub Pages is possible too, but it does not support custom headers, and if the site lives under a subpath (`username.github.io/matjar`) it needs `basePath` set in `next.config.ts`. That is why Cloudflare Pages or Netlify are preferred.

## After deploying: checklist

1. **Features on the real URL:** the home page, a product page, search, filters, the cart and a demo checkout, also from a real phone.
2. **404 page:** open a wrong link such as `https://your-domain/abc/` and make sure the Arabic page appears.
3. **Headers:** check the domain on [securityheaders.com](https://securityheaders.com), or from the terminal with `curl -I https://your-domain/`. Both `content-security-policy` and `strict-transport-security` must appear.
4. **Share links:** paste a product link into WhatsApp and make sure its image, name and price appear. If `localhost` appears, `NEXT_PUBLIC_SITE_URL` is not set on the host.
5. **Search engines:** in [Google Search Console](https://search.google.com/search-console), add the domain (verifying through DNS is the easiest), then go to **Sitemaps** and submit `https://your-domain/sitemap.xml`.
6. **Performance:** test the real URL in [PageSpeed Insights](https://pagespeed.web.dev) on mobile.

## Day-to-day workflow after launch

1. Edit the products in `src/data/products.ts`, and put the images in `assets/images/products/` (see the README).
2. Run `pnpm verify` locally (all the checks plus the unit tests).
3. Run `git commit`, then `git push`. GitHub Actions checks the change, and the host deploys it automatically within minutes.
4. To undo a broken deployment: in the host's dashboard, choose the previous deployment and press **Rollback** (Cloudflare) or **Publish deploy** (Netlify).
