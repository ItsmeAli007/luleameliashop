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

## Notes

- `.nojekyll` stops GitHub running the site through Jekyll, which would
  otherwise ignore any file or folder whose name starts with an underscore.
- The paths in `404.html` are root-absolute (`/css/…`). That is correct for a
  custom domain at the apex. If Pages is ever served from
  `username.github.io/luleameliashop/` instead, those paths break — the custom
  domain is what makes them right.
- Every push to `main` redeploys automatically, usually within a minute.
