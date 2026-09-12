/* Amelia Flowers — product catalog (static, client-side) */
const PRODUCTS = [
  {
    id: "red-roses",
    slug: { en: "red-roses", sq: "trendafila-te-kuq", it: "rose-rosse" },
    img: "assets/photo-red-roses.jpg",
    cat: "roses",
    price: 5000,
    name: { en: "Bouquet of 20 Red Roses", sq: "Buqetë me 20 Trëndafila të Kuq", it: "Bouquet di 20 Rose Rosse" },
    desc: {
      en: "Twenty long-stem roses, hand-tied with eucalyptus and kraft wrap.",
      sq: "Njëzet trëndafila kërcell të gjatë, lidhur me dorë me eukalipt.",
      it: "Venti rose a stelo lungo, legate a mano con eucalipto e carta kraft."
    },
    tag: { en: "Bestseller", sq: "Më i shituri", it: "Più venduto" }
  },
  {
    id: "eternal-dome",
    slug: { en: "eternal-roses-dome", sq: "trendafila-te-perjetshem-ne-kupole", it: "rose-eterne-in-cupola" },
    img: "assets/photo-dome-black.jpg",
    cat: "gifts",
    price: 5000,
    name: { en: "Eternal Roses in a Glass Dome", sq: "Trëndafila të Përjetshëm në Kupolë Qelqi", it: "Rose Eterne in Cupola di Vetro" },
    desc: {
      en: "Three preserved roses under glass on a crystal base, with a butterfly, fern and moss — they keep for years, with no water.",
      sq: "Tre trëndafila të ruajtur nën qelq, mbi bazë kristali, me flutur, fier dhe myshk — zgjasin me vite, pa ujë.",
      it: "Tre rose stabilizzate sotto vetro su base di cristallo, con farfalla, felce e muschio — durano anni, senza acqua."
    },
    variants: [
      { id: "black", img: "assets/photo-dome-black.jpg", name: { en: "Black", sq: "E zezë", it: "Nera" } },
      { id: "blue", img: "assets/photo-dome-blue.jpg", name: { en: "Blue", sq: "Blu", it: "Blu" } }
    ],
    tag: { en: "Lasts for years", sq: "Zgjat me vite", it: "Dura anni" }
  },
  {
    id: "rose-box",
    slug: { en: "roses-in-a-box", sq: "trendafila-ne-kuti", it: "rose-in-scatola" },
    img: "assets/photo-rose-box.jpg",
    cat: "gifts",
    price: 4500,
    name: { en: "Roses in a Keepsake Box", sq: "Trëndafila në Kuti Kujtimi", it: "Rose in Scatola Regalo" },
    desc: {
      en: "Fifteen roses set one by one into our signature keepsake box — a gift that arrives ready to display.",
      sq: "Pesëmbëdhjetë trëndafila të renditur një nga një me dorë në kutinë tonë të firmosur — një dhuratë gati për t'u ekspozuar.",
      it: "Quindici rose disposte a una a una nella nostra scatola esclusiva — un regalo pronto da esporre."
    },
    tag: { en: "Gift", sq: "Dhuratë", it: "Regalo" }
  },
  {
    id: "seasonal-garden",
    slug: { en: "seasonal-garden-bouquet", sq: "buqete-sezonale", it: "bouquet-di-stagione" },
    img: "assets/photo-seasonal-bouquet.jpg",
    cat: "seasonal",
    price: 3800,
    name: { en: "Seasonal Garden Bouquet", sq: "Buqetë Sezonale Kopshti", it: "Bouquet di Stagione" },
    desc: {
      en: "Whatever is freshest at the morning market — a different mix every week.",
      sq: "Çfarë është më e freskët në treg — një kombinim i ndryshëm çdo javë.",
      it: "Ciò che è più fresco al mercato del mattino — una composizione diversa ogni settimana."
    },
    tag: { en: "New", sq: "E re", it: "Novità" }
  },
  {
    id: "wedding-bouquet",
    slug: { en: "bridal-bouquet", sq: "buqete-nuserie", it: "bouquet-da-sposa" },
    img: "assets/photo-wedding-bouquet.jpg",
    cat: "weddings",
    price: 9500,
    name: { en: "Bridal Wedding Bouquet", sq: "Buqetë Nusërie", it: "Bouquet da Sposa" },
    desc: {
      en: "A romantic, full bridal bouquet built to order — consultation included.",
      sq: "Buqetë romantike nusërie e përgatitur sipas porosisë — konsultë e përfshirë.",
      it: "Un bouquet da sposa romantico e ricco, realizzato su misura — consulenza inclusa."
    },
    tag: { en: "Made to order", sq: "Me porosi", it: "Su ordinazione" }
  },
  {
    id: "orchid-elegance",
    slug: { en: "potted-orchid", sq: "orkide-ne-vazo", it: "orchidea-in-vaso" },
    img: "assets/photo-orchid.jpg",
    cat: "plants",
    price: 3500,
    name: { en: "Elegant Potted Orchid", sq: "Orkide Elegante në Vazo", it: "Orchidea Elegante in Vaso" },
    desc: {
      en: "A long-blooming phalaenopsis orchid in a ceramic pot — low maintenance luxury.",
      sq: "Orkide phalaenopsis me lulëzim të gjatë, në vazo qeramike.",
      it: "Un’orchidea phalaenopsis dalla lunga fioritura, in vaso di ceramica — lusso senza pensieri."
    },
    note: {
      en: "The vase may not be the one in the photograph, but it will be a similar one in the same ceramic.",
      sq: "Vazoja mund të mos jetë e njëjta me atë në fotografi, por do të jetë e ngjashme dhe prej së njëjtës qeramikë.",
      it: "Il vaso potrebbe non essere quello della fotografia, ma sarà simile e nella stessa ceramica."
    },
    tag: null
  },
  {
    id: "birthday-burst",
    slug: { en: "birthday-bouquet", sq: "buqete-ditelindjeje", it: "bouquet-di-compleanno" },
    img: "assets/photo-birthday.jpg",
    cat: "seasonal",
    price: 3400,
    name: { en: "Birthday Colour Burst", sq: "Buqetë Ditëlindjeje", it: "Bouquet di Compleanno" },
    desc: {
      en: "A bright, playful mix built to make someone's day — with a card, on us.",
      sq: "Një kombinim i gjallë lulesh për ditëlindjen e dikujt — me kartolinë falas.",
      it: "Un mix vivace e allegro per rendere speciale la giornata di qualcuno — biglietto incluso."
    },
    tag: null
  }
];

const CATEGORIES = [
  { key: "all", en: "All", sq: "Të gjitha", it: "Tutti" },
  { key: "roses", en: "Roses", sq: "Trëndafila", it: "Rose" },
  { key: "seasonal", en: "Seasonal", sq: "Sezonale", it: "Di stagione" },
  { key: "gifts", en: "Gifts", sq: "Dhurata", it: "Regali" },
  { key: "weddings", en: "Weddings", sq: "Dasma", it: "Matrimoni" },
  { key: "plants", en: "Plants", sq: "Bimë", it: "Piante" }
];

function formatLek(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " L";
}

const PRODUCT_DIR = { sq: "lule", en: "flowers", it: "fiori" };

function getProduct(id) {
  return PRODUCTS.find(p => p.id === id);
}

/* Some products are sold in more than one colour and keep them in
   `variants` — one card in the grid, one page, a choice on the page. A cart
   line is then a product plus which colour, so everything a customer reads
   — the cart row, the checkout summary, the WhatsApp order — is asked for by
   line rather than by product. An unknown or missing colour falls back to
   the first, which is the one the photograph on the card shows. */
function getVariant(p, variantId) {
  if (!p || !p.variants || !p.variants.length) return null;
  return p.variants.find(v => v.id === variantId) || p.variants[0];
}

function lineName(p, item, lang) {
  const v = getVariant(p, item && item.variant);
  return v ? p.name[lang] + " (" + v.name[lang] + ")" : p.name[lang];
}

function lineImg(p, item) {
  const v = getVariant(p, item && item.variant);
  return v ? v.img : p.img;
}

/* Two lines are the same line only if they are the same colour of the same
   product — otherwise the blue dome would increment the black one. */
function sameLine(item, id, variant) {
  return item.id === id && (item.variant || null) === (variant || null);
}

/* The path this bouquet lives at in a given language, ready to use as an
   href. Albanian sits at the root; the others under their language folder. */
function productPath(p, lang) {
  const prefix = lang === "sq" ? "" : "/" + lang;
  return prefix + "/" + PRODUCT_DIR[lang] + "/" + p.slug[lang] + "/";
}

/* Which bouquet a URL is asking for. Reads the slug out of the path, and
   still answers to the old ?id= links that are already out there in
   WhatsApp threads and on Instagram. */
function productFromLocation() {
  const m = location.pathname.match(/\/(?:lule|flowers|fiori)\/([^/]+)\/?$/);
  if (m) {
    const slug = decodeURIComponent(m[1]);
    const hit = PRODUCTS.find(p => Object.keys(p.slug).some(l => p.slug[l] === slug));
    if (hit) return hit;
  }
  return getProduct(new URLSearchParams(location.search).get("id"));
}
