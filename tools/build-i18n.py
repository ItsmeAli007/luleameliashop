#!/usr/bin/env python3
"""Render the site once per language, so each language has its own URL.

    /            Albanian   (the shop is in Tirana; most customers are too)
    /en/         English    (the diaspora, and anyone else)
    /it/         Italian

Run it from the repository root after changing any page, any string, or the
catalogue:

    python3 tools/build-i18n.py

What it does, per page and per language: swaps the text of every element
carrying data-i18n for that language's string, sets <html lang>, writes the
title, description and social tags from the seo.* keys, and emits the
canonical and hreflang block that tells Google these three pages are the same
page in different languages.

It also builds the catalogue. Every bouquet gets a real page per language —

    /lule/trendafila-te-kuq/
    /en/flowers/red-roses/
    /it/fiori/rose-rosse/

— with its name, price, description and Product markup already in the HTML,
rather than a query string on a template that only fills itself in once
JavaScript has run. The shop grid and the homepage's featured row are
prerendered from the same array for the same reason. js/products.js stays the
one place a bouquet is described; this script reads it rather than repeating
it, and js/main.js re-renders the same markup at runtime so the language
switch and the cart keep working exactly as before.

The root pages are both the source and the Albanian output. That works
because substitution is driven by the data-i18n keys, never by the text
already sitting between the tags — so running this twice changes nothing, and
the dictionaries in js/i18n.js stay the one place any wording lives.

Nested markup inside a data-i18n element is left alone rather than flattened;
anything skipped is reported at the end.
"""

import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://luleamelia.com"

LANGS = ["sq", "en", "it"]
PREFIX = {"sq": "", "en": "/en", "it": "/it"}      # sq is the site root
PAGES = {                                           # file -> seo key stem
    "index.html": "home",
    "shop.html": "shop",
    "product.html": "product",
    "checkout.html": "checkout",
}

# The folder each language keeps its bouquets in. Translated like everything
# else a visitor reads — an Albanian URL should be Albanian all the way.
# Mirrors PRODUCT_DIR in js/products.js.
PRODUCT_DIR = {"sq": "lule", "en": "flowers", "it": "fiori"}

skipped = []


# ---------------------------------------------------------------- dictionaries
def dictionaries():
    """Pull the three dictionaries straight out of js/i18n.js.

    They are plain "key": "value" pairs inside a per-language block, so the
    file stays the single source of copy and this script never holds a second
    version of any string.
    """
    src = open(os.path.join(ROOT, "js", "i18n.js"), encoding="utf-8").read()
    out = {}
    for lang in LANGS:
        m = re.search(r'\n  %s:\s*\{(.*?)\n  \},?\n' % lang, src, re.S)
        if not m:
            sys.exit("could not find the %s dictionary in js/i18n.js" % lang)
        pairs = re.findall(r'"((?:[^"\\]|\\.)*)":\s*"((?:[^"\\]|\\.)*)"', m.group(1))
        out[lang] = {k: v.replace('\\"', '"').replace("\\'", "'") for k, v in pairs}
    return out


def catalogue():
    """PRODUCTS and CATEGORIES, read out of js/products.js.

    Both are plain data with unquoted keys — valid JavaScript, not quite JSON
    — so quoting the keys is the whole conversion. Parsing the real file
    rather than keeping a copy here is the point: a bouquet is described once.
    """
    src = open(os.path.join(ROOT, "js", "products.js"), encoding="utf-8").read()

    def block(name):
        m = re.search(r'const %s = (\[.*?\n\]);' % name, src, re.S)
        if not m:
            sys.exit("could not find %s in js/products.js" % name)
        body = re.sub(r'([{,]\s*)([A-Za-z_]\w*)\s*:', r'\1"\2":', m.group(1))
        try:
            return json.loads(body)
        except ValueError as exc:
            sys.exit("could not read %s from js/products.js: %s" % (name, exc))

    return block("PRODUCTS"), block("CATEGORIES")


def esc(text):
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def attr(text):
    return esc(text).replace('"', "&quot;")


# ------------------------------------------------------------------ catalogue
def product_path(p, lang):
    return "%s/%s/%s/" % (PREFIX[lang], PRODUCT_DIR[lang], p["slug"][lang])


def product_url(p, lang):
    return SITE + product_path(p, lang)


def format_lek(n):
    """4500 -> "4 500 L". Same grouping as formatLek() in js/products.js."""
    digits = str(n)
    groups = []
    while len(digits) > 3:
        groups.insert(0, digits[-3:])
        digits = digits[:-3]
    groups.insert(0, digits)
    return " ".join(groups) + " L"


def asset(path):
    return "/" + path.lstrip("/")


def picture_html(src, extra):
    """Mirrors pictureHTML() in js/main.js, attribute for attribute.

    The two have to agree: this markup is what a crawler and a visitor with
    slow JavaScript see, and js/main.js replaces it with its own a moment
    later. A mismatch would show up as a flicker.
    """
    abs_src = asset(src)
    webp = re.sub(r'\.(jpe?g|png)$', '.webp', abs_src, flags=re.I)
    return ('<picture><source srcset="%s" type="image/webp">'
            '<img src="%s" width="1126" height="1397" decoding="async" %s></picture>'
            % (webp, abs_src, extra))


def product_card(p, lang, words):
    """Mirrors productCardHTML() in js/main.js."""
    tag = ('<span class="p-tag">%s</span>' % esc(p["tag"][lang])) if p.get("tag") else ""
    cat = words.get("footer.shop." + p["cat"], p["cat"])
    href = product_path(p, lang)
    return '''
  <article class="p-card" data-reveal>
    <a href="%s" class="p-media">
      %s
      %s
    </a>
    <div class="p-body">
      <span class="p-cat">%s</span>
      <h3 class="p-name"><a href="%s">%s</a></h3>
      <p class="p-desc">%s</p>
      <div class="p-foot">
        <span class="p-price">%s</span>
        <button class="add-btn" data-add="%s" aria-label="Add to cart">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
        </button>
      </div>
    </div>
  </article>''' % (href, tag,
                   picture_html(p["img"], 'alt="%s" loading="lazy"' % attr(p["name"][lang])),
                   esc(cat), href, esc(p["name"][lang]), esc(p["desc"][lang]),
                   format_lek(p["price"]), attr(p["id"]))


BUILD_OPEN = "<!--build:start-->"
BUILD_CLOSE = "<!--build:end-->"


def fill_container(html, element_id, inner):
    """Write markup into <div id="…"></div>, replacing whatever is there.

    The Albanian pages are their own source file — index.html is both the
    template every language is rendered from and the Albanian output — so
    this has to be able to overwrite its own previous run, not just fill an
    empty div. The markers are what make that safe: everything between them
    belongs to the builder and is thrown away on the next pass, so running
    the script twice gives the same result as running it once.
    """
    pattern = re.compile(
        r'(<div[^>]*\sid="%s"[^>]*>)'
        r'(?:\s*%s.*?%s\s*|\s*)'
        r'(</div>)' % (re.escape(element_id), re.escape(BUILD_OPEN), re.escape(BUILD_CLOSE)),
        re.S)
    if not pattern.search(html):
        skipped.append("no container #%s to prerender into" % element_id)
        return html
    return pattern.sub(
        lambda m: m.group(1) + BUILD_OPEN + inner + "\n  " + BUILD_CLOSE + m.group(2),
        html, count=1)


def chips_html(cats, lang):
    """Mirrors buildChips() in js/main.js, with "all" pre-selected."""
    return "".join(
        '<button class="chip%s" data-cat="%s">%s</button>'
        % (" active" if c["key"] == "all" else "", attr(c["key"]), esc(c[lang]))
        for c in cats)


# --------------------------------------------------------------- product page
PD_TEXT = re.compile(
    r'(<(?P<tag>[a-zA-Z0-9]+)(?P<attrs>[^>]*\sdata-pd-(?P<key>name|price|desc|cat)(?=[\s>])[^>]*)>)'
    r'(?P<body>[^<]*)'
    r'(?P<close></(?P=tag)>)'
)


def fill_product(html, p, lang, words):
    """Write one bouquet into the product template.

    js/main.js writes exactly these values into exactly these hooks on load,
    so the page a crawler is handed and the page a visitor ends up with are
    the same page — this just means the crawler no longer has to run
    JavaScript to see it.
    """
    values = {
        "name": p["name"][lang],
        "price": format_lek(p["price"]),
        "desc": p["desc"][lang],
        "cat": words.get("footer.shop." + p["cat"], p["cat"]),
    }
    html = PD_TEXT.sub(lambda m: m.group(1) + esc(values[m.group("key")]) + m.group("close"), html)

    img = asset(p["img"])
    webp = re.sub(r'\.(jpe?g|png)$', '.webp', img, flags=re.I)
    html = re.sub(r'(<source[^>]*\sdata-pd-source[^>]*\ssrcset=")[^"]*(")',
                  lambda m: m.group(1) + webp + m.group(2), html, count=1)
    html = re.sub(r'<img([^>]*\sdata-pd-img[^>]*)>',
                  lambda m: '<img%s>' % (
                      re.sub(r'\salt="[^"]*"', ' alt="%s"' % attr(p["name"][lang]),
                             re.sub(r'\ssrc="[^"]*"', ' src="%s"' % img, m.group(1)))),
                  html, count=1)
    return html


def product_schema(p, lang, words):
    return {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": product_url(p, lang) + "#product",
        "name": p["name"][lang],
        "description": p["desc"][lang],
        "sku": p["id"],
        "image": SITE + asset(p["img"]),
        "url": product_url(p, lang),
        "category": words.get("footer.shop." + p["cat"], p["cat"]),
        "brand": {"@type": "Brand", "name": "Amelia Flowers"},
        "offers": {
            "@type": "Offer",
            "url": product_url(p, lang),
            "priceCurrency": "ALL",
            "price": p["price"],
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition",
            "seller": {"@id": "https://luleamelia.com/#shop"},
            "areaServed": {"@type": "City", "name": "Tirana"},
            "shippingDetails": {
                "@type": "OfferShippingDetails",
                "shippingRate": {"@type": "MonetaryAmount", "value": 0, "currency": "ALL"},
                "shippingDestination": {
                    "@type": "DefinedRegion",
                    "addressCountry": "AL",
                    "addressRegion": "Tirana",
                },
                "deliveryTime": {
                    "@type": "ShippingDeliveryTime",
                    "handlingTime": {"@type": "QuantitativeValue", "minValue": 0, "maxValue": 0, "unitCode": "DAY"},
                    "transitTime": {"@type": "QuantitativeValue", "minValue": 0, "maxValue": 1, "unitCode": "DAY"},
                },
            },
        },
    }


def breadcrumb_schema(trail):
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": i + 1, "name": name, "item": url}
            for i, (name, url) in enumerate(trail)
        ],
    }


def ld_block(element_id, data):
    return ('<script type="application/ld+json" id="%s">\n%s\n</script>'
            % (element_id, json.dumps(data, ensure_ascii=False, indent=2)))


def inject_ld(html, blocks):
    return html.replace("</head>", "\n".join(blocks) + "\n</head>", 1)


# ---------------------------------------------------------------------- bodies
def localize_text(html, words, page):
    """Replace the contents of every data-i18n element with this language's string."""
    pattern = re.compile(
        r'(<(?P<tag>[a-zA-Z0-9]+)(?P<attrs>[^>]*\sdata-i18n="(?P<key>[^"]+)"[^>]*)>)'
        r'(?P<body>[^<]*)'
        r'(?P<close></(?P=tag)>)'
    )

    def sub(m):
        key = m.group("key")
        if key not in words:
            skipped.append("%s: no string for %s" % (page, key))
            return m.group(0)
        return m.group(1) + esc(words[key]) + m.group("close")

    html = pattern.sub(sub, html)

    def sub_ph(m):
        key = m.group("key")
        if key not in words:
            return m.group(0)
        return re.sub(r'placeholder="[^"]*"', 'placeholder="%s"' % attr(words[key]), m.group(0))

    return re.sub(r'<[^>]*data-i18n-placeholder="(?P<key>[^"]+)"[^>]*>', sub_ph, html)


# ------------------------------------------------------------------- link paths
def absolutize(html, lang):
    """Make every path root-absolute, and point page links at this language.

    A page living at /en/shop.html cannot keep the relative paths the root
    pages use — "css/style.css" would resolve to /en/css/style.css. Assets
    are shared across languages, so they go to the root; pages get this
    language's prefix.
    """
    prefix = PREFIX[lang]

    def fix(m):
        attr_name, quote, url = m.group(1), m.group(2), m.group(3)
        if re.match(r'^(https?:|mailto:|tel:|#|/|data:)', url):
            return m.group(0)
        if re.match(r'^(css|js|assets)/', url):
            return '%s=%s/%s%s' % (attr_name, quote, url, quote)
        page = url.split("#")[0].split("?")[0]
        if page in PAGES or page in ("404.html",):
            rest = url[len(page):]
            target = "/" if page == "index.html" else "/" + page
            return '%s=%s%s%s%s%s' % (attr_name, quote, prefix, target, rest, quote)
        return m.group(0)

    html = re.sub(r'\b(href|src)=(["\'])([^"\']+)\2', fix, html)

    # srcset needs the same treatment and does not go through fix(): a
    # <source srcset="assets/hero.webp"> inside /en/index.html resolves to
    # /en/assets/hero.webp, which does not exist. The browser does not fall
    # back from a 404 <source> on its own — js/main.js has to notice and strip
    # it — so every English and Italian visitor was paying a wasted round trip
    # and then getting the JPEG instead of the WebP, on the hero image that
    # decides the page's Largest Contentful Paint.
    def fix_srcset(m):
        parts = []
        for candidate in m.group(2).split(","):
            candidate = candidate.strip()
            if re.match(r'^(css|js|assets)/', candidate):
                candidate = "/" + candidate
            parts.append(candidate)
        return 'srcset=%s%s%s' % (m.group(1), ", ".join(parts), m.group(1))

    return re.sub(r'\bsrcset=(["\'])([^"\']+)\1', fix_srcset, html)


# ------------------------------------------------------------------------ head
HEAD_BLOCK = re.compile(r'\n?<!-- i18n:head -->.*?<!-- /i18n:head -->\n?', re.S)
DROP = [
    re.compile(r'\n?\s*<link rel="canonical"[^>]*>'),
    re.compile(r'\n?\s*<link rel="alternate"[^>]*>'),
    re.compile(r'\n?\s*<meta property="og:url"[^>]*>'),
    re.compile(r'\n?\s*<meta property="og:locale[^"]*"[^>]*>'),
    re.compile(r'\n?\s*<meta name="robots"[^>]*>'),
    # Structured data this script wrote on a previous run. It is identified
    # by its id — the hand-written Florist and WebSite blocks in index.html
    # carry none, and are left exactly where they are.
    re.compile(r'\n?\s*<script type="application/ld\+json" id="ld-[^"]*">.*?</script>', re.S),
]
OG_LOCALE = {"sq": "sq_AL", "en": "en_GB", "it": "it_IT"}


def page_url(page, lang):
    tail = "" if page == "index.html" else page
    return "%s%s/%s" % (SITE, PREFIX[lang], tail)


def head(html, lang, title, desc, urls, image=None, robots=None):
    """Write the head. `urls` maps every language to this page's URL in it.

    A page that exists in one language only passes a one-entry `urls`. It
    gets a self-referencing canonical and no alternates at all, which is the
    honest signal: claiming an English version of an Albanian occasion page
    that was never written would be worse than claiming nothing.
    """
    html = re.sub(r'<html lang="[^"]*"', '<html lang="%s"' % lang, html, count=1)
    html = re.sub(r'<title>.*?</title>', '<title>%s</title>' % esc(title), html, count=1, flags=re.S)
    for prop, value in [('name="description"', desc),
                        ('property="og:title"', title),
                        ('property="og:description"', desc),
                        ('name="twitter:title"', title),
                        ('name="twitter:description"', desc)]:
        html = re.sub(r'<meta %s content="[^"]*"' % re.escape(prop),
                      '<meta %s content="%s"' % (prop, attr(value)), html, count=1)
    if image:
        for prop in ('property="og:image"', 'name="twitter:image"'):
            html = re.sub(r'<meta %s content="[^"]*"' % re.escape(prop),
                          '<meta %s content="%s"' % (prop, attr(image)), html, count=1)

    html = HEAD_BLOCK.sub("\n", html)
    for rx in DROP:
        html = rx.sub("", html)

    lines = ['<!-- i18n:head -->',
             '<!-- Written by tools/build-i18n.py. The alternates below are what',
             '     tell Google these three URLs are one page in three languages;',
             '     x-default points at Albanian, the language of the city the',
             '     shop is actually in. -->']
    if robots:
        lines.append('<meta name="robots" content="%s">' % robots)
    lines.append('<link rel="canonical" href="%s">' % urls[lang])
    if len(urls) > 1:
        for other in LANGS:
            lines.append('<link rel="alternate" hreflang="%s" href="%s">'
                         % ("sq-AL" if other == "sq" else other, urls[other]))
        lines.append('<link rel="alternate" hreflang="x-default" href="%s">' % urls["sq"])
    lines.append('<meta property="og:url" content="%s">' % urls[lang])
    lines.append('<meta property="og:locale" content="%s">' % OG_LOCALE[lang])
    if len(urls) > 1:
        for other in LANGS:
            if other != lang:
                lines.append('<meta property="og:locale:alternate" content="%s">' % OG_LOCALE[other])
    lines.append('<!-- /i18n:head -->')

    return html.replace("</head>", "\n".join(lines) + "\n</head>", 1)


# --------------------------------------------------------------- content pages
CONTENT_DIR = os.path.join(ROOT, "tools", "pages")

META_BLOCK = re.compile(r'<!--meta\n(.*?)\n-->', re.S)
FAQ_ITEM = re.compile(r'<div data-faq><b>(.*?)</b><span>(.*?)</span></div>', re.S)
PRODUCT_SLOT = re.compile(r'<div class="grid-products" data-products="([^"]*)"></div>')

# Where the reusable chrome ends and a page's own content begins. Every page
# on this site opens with a .page-hero and closes with the marquee, so the
# header, mobile menu, footer, cart drawer and script tags can be sliced off
# the built shop page rather than duplicated into every content file.
PILL_HOME = (
    '<div class="lang-pill" data-lang-fixed>\n'
    '        <a data-lang="en" href="/en/" hreflang="en" lang="en">EN</a>\n'
    '        <a data-lang="sq" href="/" hreflang="sq" lang="sq">AL</a>\n'
    '        <a data-lang="it" href="/it/" hreflang="it" lang="it">IT</a>\n'
    '      </div>')

CHROME_TOP_ENDS = '<section class="page-hero">'
CHROME_BOTTOM_STARTS = '<div class="marquee">'


def content_sources():
    """Read tools/pages/*.html — an Albanian body plus a small meta block."""
    pages = []
    if not os.path.isdir(CONTENT_DIR):
        return pages
    for name in sorted(os.listdir(CONTENT_DIR)):
        if not name.endswith(".html"):
            continue
        raw = open(os.path.join(CONTENT_DIR, name), encoding="utf-8").read()
        m = META_BLOCK.search(raw)
        if not m:
            skipped.append("tools/pages/%s has no <!--meta--> block" % name)
            continue
        meta = {}
        for line in m.group(1).splitlines():
            if ":" in line:
                key, value = line.split(":", 1)
                meta[key.strip()] = value.strip()
        pages.append((meta, META_BLOCK.sub("", raw, count=1).strip()))
    return pages


def strip_tags(text):
    return re.sub(r'<[^>]+>', '', text).strip()


def faq_schema(body):
    """FAQPage markup built from the questions actually printed on the page.

    Generating it from the rendered copy rather than from a second list is
    the only way the two cannot drift apart — and answers marked up but not
    shown are exactly what Google penalises.
    """
    items = FAQ_ITEM.findall(body)
    if not items:
        return None
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {"@type": "Question", "name": strip_tags(q),
             "acceptedAnswer": {"@type": "Answer", "text": strip_tags(a)}}
            for q, a in items
        ],
    }


def fill_product_slots(body, products, lang, words):
    by_id = {p["id"]: p for p in products}

    def sub(m):
        wanted = [by_id[i.strip()] for i in m.group(1).split(",") if i.strip() in by_id]
        return ('<div class="grid-products">%s\n  </div>'
                % "".join(product_card(p, lang, words) for p in wanted))

    return PRODUCT_SLOT.sub(sub, body)


def occasion_row(pages):
    """The one place every occasion page is listed together — above the
    catalogue's category chips, where someone shopping by occasion rather
    than by flower will look first."""
    if not pages:
        return ""
    return "".join('<a class="chip" href="/%s/">%s</a>' % (m["slug"], esc(m["crumb"]))
                   for m, _ in pages)


# --------------------------------------------------------------------- sitemap
SITEMAP_NOTE = """<!--
  Written by tools/build-i18n.py — do not edit by hand.

  Every page, in every language, each entry carrying its own alternates so
  Google can pair the language versions from the sitemap alone and not only
  from the <link rel="alternate"> tags in the page head. Two independent
  signals saying the same thing.

  checkout.html is absent for the same reason robots.txt disallows it, and
  the legacy /product.html template is absent because it is a redirect to a
  real bouquet URL rather than a page in its own right.
-->"""


def write_sitemap(products, content):
    entries = []                                    # [(prio, {lang: url})]
    entries.append(("1.0", {l: page_url("index.html", l) for l in LANGS}))
    entries.append(("0.9", {l: page_url("shop.html", l) for l in LANGS}))
    for meta, _ in content:
        entries.append(("0.9", {"sq": "%s/%s/" % (SITE, meta["slug"])}))
    for p in products:
        entries.append(("0.8", {l: product_url(p, l) for l in LANGS}))

    out = ['<?xml version="1.0" encoding="UTF-8"?>', SITEMAP_NOTE,
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
           '        xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    for prio, urls in entries:
        for lang in [l for l in LANGS if l in urls]:
            out.append("  <url>")
            out.append("    <loc>%s</loc>" % urls[lang])
            if len(urls) > 1:
                for other in LANGS:
                    out.append('    <xhtml:link rel="alternate" hreflang="%s" href="%s"/>'
                               % ("sq-AL" if other == "sq" else other, urls[other]))
                out.append('    <xhtml:link rel="alternate" hreflang="x-default" href="%s"/>' % urls["sq"])
            out.append("    <changefreq>weekly</changefreq>")
            out.append("    <priority>%s</priority>" % prio)
            out.append("  </url>")
    out.append("</urlset>")

    path = os.path.join(ROOT, "sitemap.xml")
    open(path, "w", encoding="utf-8").write("\n".join(out) + "\n")
    return len(entries) * len(LANGS)


# ------------------------------------------------------------------------ build
def out_path(lang, *parts):
    base = ROOT if lang == "sq" else os.path.join(ROOT, lang)
    path = os.path.join(base, *parts)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    return path


def main():
    words = dictionaries()
    products, cats = catalogue()
    content = content_sources()
    sources = {p: open(os.path.join(ROOT, p), encoding="utf-8").read() for p in PAGES}
    written = []

    def emit(path, html):
        open(path, "w", encoding="utf-8").write(html)
        written.append(os.path.relpath(path, ROOT))

    for lang in LANGS:
        w = words[lang]
        shop_url = SITE + PREFIX[lang] + "/shop.html"
        home_url = SITE + PREFIX[lang] + "/"

        # ── the four templates ────────────────────────────────────────────
        for page, stem in PAGES.items():
            html = sources[page]
            html = localize_text(html, w, "%s/%s" % (lang, page))
            html = absolutize(html, lang)

            # /product.html only still exists to catch the ?id= links already
            # shared in WhatsApp threads and on Instagram. js/main.js sends
            # them on to the bouquet's real URL; it must not compete with
            # that URL in the index in the meantime.
            robots = "noindex, follow" if page == "product.html" else None

            html = head(html, lang,
                        w.get("seo.%s.title" % stem, ""),
                        w.get("seo.%s.desc" % stem, ""),
                        {l: page_url(page, l) for l in LANGS},
                        robots=robots)

            if page == "shop.html" and lang == "sq":
                html = fill_container(html, "occasionRow", occasion_row(content))

            if page == "index.html":
                html = fill_container(html, "featuredGrid",
                                      "".join(product_card(p, lang, w) for p in products[:6]))
            elif page == "shop.html":
                html = fill_container(html, "chipRow", chips_html(cats, lang))
                html = fill_container(html, "shopGrid",
                                      "".join(product_card(p, lang, w) for p in products))
                html = inject_ld(html, [
                    ld_block("ld-itemlist", {
                        "@context": "https://schema.org",
                        "@type": "ItemList",
                        "name": w.get("seo.shop.title", ""),
                        "numberOfItems": len(products),
                        "itemListElement": [
                            {"@type": "ListItem", "position": i + 1,
                             "item": product_schema(p, lang, w)}
                            for i, p in enumerate(products)
                        ],
                    }),
                    ld_block("ld-breadcrumb", breadcrumb_schema([
                        ("Amelia Flowers", home_url),
                        (w.get("nav.shop", "Shop"), shop_url),
                    ])),
                ])

            emit(out_path(lang, page), html)

        # ── one page per bouquet ──────────────────────────────────────────
        for p in products:
            html = sources["product.html"]
            html = localize_text(html, w, "%s/%s" % (lang, product_path(p, lang)))
            html = absolutize(html, lang)
            html = fill_product(html, p, lang, w)
            html = head(html, lang,
                        "%s — %s" % (p["name"][lang], w.get("seo.pd.suffix", "")),
                        "%s %s" % (p["desc"][lang], w.get("seo.pd.tail", "")),
                        {l: product_url(p, l) for l in LANGS},
                        image=SITE + asset(p["img"]))
            html = inject_ld(html, [
                ld_block("ld-product", product_schema(p, lang, w)),
                ld_block("ld-breadcrumb", breadcrumb_schema([
                    ("Amelia Flowers", home_url),
                    (w.get("nav.shop", "Shop"), shop_url),
                    (p["name"][lang], product_url(p, lang)),
                ])),
            ])

            related = [x for x in products if x["cat"] == p["cat"] and x["id"] != p["id"]][:3]
            if not related:
                related = [x for x in products if x["id"] != p["id"]][:3]
            html = fill_container(html, "relatedGrid",
                                  "".join(product_card(x, lang, w) for x in related))

            emit(out_path(lang, PRODUCT_DIR[lang], p["slug"][lang], "index.html"), html)

    # ── the Albanian occasion and delivery pages ──────────────────────────
    # Albanian only, deliberately: these target how someone in Tirana shops
    # for flowers. The diaspora pages are a different argument to a different
    # reader, and pointing an English visitor into Albanian copy loses them.
    if content:
        chrome_src = absolutize(localize_text(sources["shop.html"], words["sq"], "sq/chrome"),
                                "sq")
        top = chrome_src[:chrome_src.index(CHROME_TOP_ENDS)]
        bottom = chrome_src[chrome_src.index(CHROME_BOTTOM_STARTS):]
        # Nothing in the header should look selected on a page that is not
        # the catalogue.
        top = top.replace(' class="active"', "")
        top = top.replace('<body class="on-light page-shop"', '<body class="on-light page-content"')
        # These pages exist in Albanian only. Left as they come off the shop
        # page the pill would offer /en/dergese-lulesh-tirane/, which is a
        # 404 — so it offers each language's homepage instead, and tells
        # js/main.js not to rewrite it back.
        top = re.sub(r'<div class="lang-pill">.*?</div>', PILL_HOME, top, count=1, flags=re.S)

        w = words["sq"]
        home_url = SITE + "/"
        for meta, body in content:
            url = "%s/%s/" % (SITE, meta["slug"])
            body = fill_product_slots(body, products, "sq", w)
            html = head(top + body + "\n\n" + bottom, "sq",
                        meta["title"], meta["desc"], {"sq": url})
            blocks = [ld_block("ld-breadcrumb", breadcrumb_schema([
                ("Amelia Flowers", home_url),
                (meta["crumb"], url),
            ]))]
            faq = faq_schema(body)
            if faq:
                blocks.append(ld_block("ld-faq", faq))
            html = inject_ld(html, blocks)
            emit(out_path("sq", *(meta["slug"].split("/") + ["index.html"])), html)

    urls = write_sitemap(products, content)

    print("wrote %d pages and a sitemap of %d urls:" % (len(written), urls))
    for path in written:
        print("  " + path)
    if skipped:
        print("\nskipped:")
        for s in sorted(set(skipped)):
            print("  " + s)


if __name__ == "__main__":
    main()
