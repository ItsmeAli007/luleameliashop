# Deploying luleamelia.com

Host: **GitHub Pages**, serving `main` from the repository root.
Registrar: **GoDaddy** (domain only — GoDaddy holds the name, GitHub serves the files).

## 1. Push

```bash
git push -u origin main
```

## 2. Turn Pages on

In the repo → **Settings → Pages**:

- **Source:** Deploy from a branch
- **Branch:** `main`, folder `/ (root)`
- Save.

The `CNAME` file in this repo already contains `luleamelia.com`, so GitHub picks
the custom domain up on its own.

## 3. Point GoDaddy at GitHub

GoDaddy → **My Products → Domains → luleamelia.com → DNS → Manage Zones**.

Delete any existing `A` record for `@` (GoDaddy parks new domains on its own
page), then add these four — all of them, they are GitHub's redundant
front-ends, not alternatives:

| Type | Name | Value | TTL |
|---|---|---|---|
| A | @ | 185.199.108.153 | 1 hour |
| A | @ | 185.199.109.153 | 1 hour |
| A | @ | 185.199.110.153 | 1 hour |
| A | @ | 185.199.111.153 | 1 hour |
| CNAME | www | ItsmeAli007.github.io | 1 hour |

The CNAME value ends in a dot in some panels (`ItsmeAli007.github.io.`) — GoDaddy
adds it itself, so type it without.

## 4. Wait, then force HTTPS

DNS takes anywhere from 10 minutes to a few hours. Once **Settings → Pages**
stops warning about the domain, tick **Enforce HTTPS**. The certificate is
issued by GitHub, free, and renews itself — but the tickbox only appears after
DNS resolves, so if it is greyed out, the wait is not over.

Check propagation:

```bash
dig +short luleamelia.com
```

You want the four 185.199.x.153 addresses back.

## 5. Then delete the Netlify project

Not before — keep it up until luleamelia.com is confirmed serving, so there is
always a working URL.

## Cloudflare — optional, and not what it sounds like

**It cannot be added to the page.** There is no script, tag or check you put in
`index.html` that makes Cloudflare protect the site. Cloudflare works by sitting
in front of the domain: traffic reaches its network first, and only then GitHub.
That is a DNS change, made in a Cloudflare account, not a change in this repo.

**What you already have.** Pages does not serve from a machine you rent. The
four A records above are anycast addresses, and the responses come back through
Fastly's CDN — `curl -I https://luleamelia.com/` shows `via: 1.1 varnish` and an
`x-served-by` edge node. A static site has no origin to exhaust, no database and
no server-side code: a flood is absorbed by GitHub's network and is their
capacity problem, not yours. This is already a hard target.

**What Cloudflare would add.** Unmetered DDoS mitigation at their edge, rate
limiting, Bot Fight Mode, and — the most useful part for this site — response
headers Pages simply cannot send: HSTS, a Content-Security-Policy,
`X-Frame-Options`, `Referrer-Policy`. Those harden the site against things far
likelier than a flood.

**The interstitial is a last resort, not a setting to leave on.** "Under Attack"
mode shows every visitor a checking-your-browser screen for a few seconds. On a
shop whose customers arrive from a phone, that is lost orders. Turn it on while
an attack is happening; turn it off after.

### If you do it

1. Create the Cloudflare account and add `luleamelia.com`. Cloudflare gives you
   two nameservers.
2. At GoDaddy, change the domain's **nameservers** to those two. This moves DNS
   hosting to Cloudflare — the records in section 3 must exist there instead.
3. Recreate them in Cloudflare: the four `A` records for `@` and the `www`
   CNAME, all with the **proxy on** (orange cloud). Proxy off means Cloudflare
   is doing nothing but DNS.
4. **SSL/TLS mode: Full (strict).** GitHub serves a valid certificate, so strict
   works. Do not choose Flexible — combined with Pages' *Enforce HTTPS* it
   produces an infinite redirect loop, and it is the single most common way this
   setup breaks.
5. Leave GitHub's **Enforce HTTPS** ticked, and turn on Cloudflare's **Always
   Use HTTPS**.
6. Leave **Under Attack** off.

Confirm it is live — the server header changes hands:

```bash
curl -sI https://luleamelia.com/ | grep -iE "server|cf-ray"
```

`server: cloudflare` and a `cf-ray` line mean traffic is going through them.

**Caching, once proxied.** Cloudflare caches CSS, JS and images at its edge. The
stylesheet links carry `?v=` so a deploy cannot serve new markup against an old
sheet, but if anything ever looks stale after a push, **Purge Everything** in
the Cloudflare dashboard is the fix.

### Turnstile is a different thing

Cloudflare Turnstile is a CAPTCHA for *forms*. It does nothing about DDoS, and
it is only worth adding once `orderEndpoint` is set, because a checkbox in the
browser proves nothing unless something verifies the token server-side. On
Web3Forms that verification is a **paid Pro feature**. Until orders are being
posted somewhere, the limits already in `js/config.js` are the protection —
see *Spam and abuse* in the readme.

## Notes

- `.nojekyll` stops GitHub running the site through Jekyll, which would
  otherwise ignore any file or folder whose name starts with an underscore.
- The paths in `404.html` are root-absolute (`/css/…`). That is correct for a
  custom domain at the apex. If Pages is ever served from
  `username.github.io/luleameliashop/` instead, those paths break — the custom
  domain is what makes them right.
- Every push to `main` redeploys automatically, usually within a minute.
