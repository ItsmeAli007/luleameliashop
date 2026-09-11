/* Amelia Flowers — bilingual EN / SQ (Shqip) dictionary + switcher */
const I18N = {
  en: {
    "nav.shop": "Shop",
    "nav.story": "Our Story",
    "nav.reviews": "Reviews",
    "nav.contact": "Contact",

    "hero.eyebrow": "Tirana · Bulevardi Bajram Curri",
    "hero.title1": "Fresh flowers,",
    "hero.title2": "every morning.",
    "hero.sub": "Cut and arranged by hand in the heart of Tirana. Same-day delivery across the city, cash on delivery.",
    "hero.cta.shop": "Shop bouquets",
    "hero.cta.story": "Our story",
    "hero.scroll": "Scroll",

    "marquee.1": "Same-day delivery in Tirana",
    "marquee.2": "Hand-tied, never from cold storage",
    "marquee.3": "Cash on delivery available",
    "marquee.4": "Fresh from the morning market",

    "section.signature.kicker": "Our bouquets",
    "section.signature.title": "Signature bouquets",
    "section.signature.viewall": "View all",

    "section.story.kicker": "From our garden",
    "section.story.title": "Arranged by hand, in the heart of Tirana",
    "section.story.body": "Every stem is chosen at the morning market and arranged the same day — never from cold storage, never off the shelf. Our florists work one bouquet at a time, by hand.",
    "section.story.cta": "Meet the florists",
    "stat2.n": "1K+", "stat2.l": "Bouquets delivered",

    "quote.text": "“The most beautiful bouquet I've ever received in Tirana.”",
    "quote.cite": "— Eriona K., Blloku",

    "section.visit.kicker": "Find us",
    "section.visit.title": "Come and see them",
    "section.visit.body": "Our door is open every day. Step in and choose your stems in person — or send us a message and we will bring them to you.",
    "visit.label.address": "Address",
    "visit.label.hours": "Hours",
    "visit.label.phone": "WhatsApp",
    "visit.label.instagram": "Instagram",
    "contact.whatsapp": "Message us on WhatsApp",

    "nf.kicker": "404",
    "nf.title": "This page has wilted.",
    "nf.body": "The link you followed does not lead anywhere on our site. The bouquets, however, are all still here.",
    "nf.cta.shop": "Shop bouquets",
    "nf.cta.home": "Back to home",
    "visit.cta": "Google Maps",
    "visit.cta.apple": "Apple Maps",

    "section.reviews.kicker": "Testimonials",
    "section.reviews.title": "Loved across Tirana",
    "section.reviews.note": "Sample reviews, shown as examples of the service while we collect feedback from our first customers.",
    "quote.note": "Sample review",
    "review1.text": "Ordered in the morning, arrived by noon — and it was even more beautiful than the photo. This is our go-to florist now.",
    "review1.name": "Klaudia M.",
    "review2.text": "The roses lasted almost two weeks. You can tell they're cut fresh, not sitting in a cooler somewhere.",
    "review2.name": "Ardit S.",
    "review3.text": "Cash on delivery made it so easy to send flowers to my mother without asking for her card details. Beautiful arrangement too.",
    "review3.name": "Gentiana H.",

    "newsletter.kicker": "Stay in bloom",
    "newsletter.title": "See what came in this morning",
    "newsletter.sub": "We post each morning's arrangements as we finish them. Message us and we'll tell you what is fresh today.",
    "newsletter.cta.ig": "Follow on Instagram",

    "footer.about.title": "Amelia Flowers",
    "footer.about.text": "A neighbourhood florist in the heart of Tirana, arranging fresh flowers by hand.",
    "footer.shop.title": "Shop",
    "footer.shop.roses": "Roses",
    "footer.shop.seasonal": "Seasonal",
    "footer.shop.weddings": "Weddings",
    "footer.shop.gifts": "Gifts",
    "footer.shop.plants": "Plants",
    "footer.help.title": "Help",
    "footer.help.delivery": "Delivery & Payment",
    "footer.help.contact": "Contact us",
    "footer.help.faq": "FAQ",
    "footer.visit.title": "Visit",
    "footer.visit.hours": "Open daily · 08:00–21:00",
    "footer.rights": "© 2026 Amelia Flowers. All rights reserved.",
    "footer.credit": "Made by Alti Media",
    /* ── SEO: one title and description per page, per language. The
       generator in tools/build-i18n.py writes these into the <head> of the
       rendered pages; nothing reads them at runtime. ── */
    "seo.home.title": "Send Flowers to Albania — Same-Day Delivery in Tirana",
    "seo.home.desc": "Send flowers to someone in Tirana today. A real florist on Bulevardi Bajram Curri arranges every bouquet by hand and delivers it the same day — not a relay network passing your order on.",
    "seo.shop.title": "Bouquets to Send to Tirana — Shop | Amelia Flowers",
    "seo.shop.desc": "Red roses, seasonal bouquets, wedding flowers and orchids, arranged by hand in Tirana and delivered the same day — whether you are in the city or sending from abroad.",
    "seo.product.title": "Bouquet delivered in Tirana — Amelia Flowers",
    "seo.product.desc": "A hand-arranged bouquet from Amelia Flowers on Bulevardi Bajram Curri, Tirana. Same-day delivery across the city.",
    "seo.pd.suffix": "flower delivery in Tirana",
    "seo.pd.tail": "Arranged by hand in Tirana and delivered the same day.",
    "seo.checkout.title": "Checkout — Amelia Flowers, Tirana",
    "seo.checkout.desc": "Complete your Amelia Flowers order. Same-day delivery across Tirana, cash on delivery.",

    "shop.hero.kicker": "Catalogue",
    "shop.hero.title": "Shop bouquets",
    "shop.hero.sub": "Hand-arranged, cut fresh every morning. Free same-day delivery in Tirana, pay cash on delivery.",
    "shop.empty": "No bouquets in this category yet — check back soon.",

    "pd.back": "Back to shop",
    "pd.add": "Add to cart",
    "pd.added": "Added to cart",
    "pd.qty": "Quantity",
    "pd.meta.delivery.t": "Delivery",
    "pd.meta.delivery.v": "Same-day in Tirana",
    "pd.meta.care.t": "Care",
    "pd.meta.care.v": "Trim stems, change water daily",
    "pd.meta.payment.t": "Payment",
    "pd.meta.payment.v": "Cash on delivery",
    "pd.related": "You may also like",

    "cart.title": "Your cart",
    "cart.empty": "Your cart is empty.",
    "cart.empty.cta": "Browse bouquets",
    "cart.subtotal": "Subtotal",
    "cart.checkout": "Checkout",
    "cart.continue": "Continue shopping",

    "checkout.hero.kicker": "Almost there",
    "checkout.hero.title": "Checkout",
    "checkout.section.details": "Delivery details",
    "field.fullname": "Full name",
    "field.phone": "Phone number",
    "field.address": "Street address",
    "field.city": "City",
    "field.notes": "Delivery notes (optional)",
    "field.notes.placeholder": "Floor, doorbell, best time to deliver…",
    "checkout.section.payment": "Payment method",
    "pay.cod.title": "Cash on delivery",
    "pay.cod.desc": "Pay in cash to our courier when your flowers arrive. It's currently the only payment method we offer.",
    "checkout.summary.title": "Order summary",
    "checkout.summary.subtotal": "Subtotal",
    "checkout.summary.delivery": "Delivery",
    "checkout.summary.delivery.free": "Free",
    "checkout.summary.total": "Total",
    "checkout.place": "Place order · Cash on delivery",
    "checkout.empty.title": "Your cart is empty",
    "checkout.empty.sub": "Add a few bouquets before checking out.",
    "checkout.empty.cta": "Shop bouquets",

    "error.required": "This field is required.",
    "error.phone": "Enter a valid phone number.",
    "error.ratelimit": "You've just placed several orders. Please wait {n} min, or call us to order by phone.",
    "error.maxqty": "That's the most we can take online — call us for larger orders.",

    "confirm.kicker": "Order received",
    "confirm.title": "Thank you! Your flowers are on their way.",
    "confirm.body": "We've received your order and our florists are already preparing it. Pay in cash to the courier when it arrives at your door.",
    "confirm.orderlabel": "Order number",
    "confirm.backhome": "Back to home",
    "confirm.deliverto": "Delivering to",
    "confirm.wa.button": "Send order via WhatsApp",
    "confirm.wa.sent": "WhatsApp should have opened with your order — press send to confirm it with our florists.",
    "confirm.wa.blocked": "One last step: tap below to send your order to our florists on WhatsApp.",
    "confirm.wa.optional": "Your order is already with our florists. You can also send it on WhatsApp if you would like to add anything.",

    "confirm.pending.kicker": "One step left",
    "confirm.pending.title": "Almost there — send your order to confirm it.",
    "confirm.pending.body": "Your order is not placed until it reaches our florists. Press send in WhatsApp and we will start preparing it straight away. Nothing has been charged — you pay the courier in cash on delivery.",

    "cart.item.remove": "Remove"
  },

  sq: {
    "nav.shop": "Dyqani",
    "nav.story": "Historia Jonë",
    "nav.reviews": "Vlerësime",
    "nav.contact": "Kontakt",

    "hero.eyebrow": "Tiranë · Bulevardi Bajram Curri",
    "hero.title1": "Lule të freskëta,",
    "hero.title2": "çdo mëngjes.",
    "hero.sub": "Prera dhe rregulluara me dorë në zemër të Tiranës. Dërgesë brenda ditës në gjithë qytetin, pagesë në dorëzim.",
    "hero.cta.shop": "Shiko buqetat",
    "hero.cta.story": "Historia jonë",
    "hero.scroll": "Zbrit",

    "marquee.1": "Dërgesë brenda ditës në Tiranë",
    "marquee.2": "Lidhur me dorë, kurrë nga frigoriferi",
    "marquee.3": "Pagesë në dorëzim e mundshme",
    "marquee.4": "E freskët nga tregu i mëngjesit",

    "section.signature.kicker": "Buqetat tona",
    "section.signature.title": "Buqeta Karakteristike",
    "section.signature.viewall": "Të gjitha",

    "section.story.kicker": "Nga kopshti ynë",
    "section.story.title": "Rregulluar me dorë, në zemër të Tiranës",
    "section.story.body": "Çdo lule zgjidhet në tregun e mëngjesit dhe rregullohet po atë ditë — kurrë nga frigoriferi, kurrë nga rafti. Floristët tanë punojnë me dorë, një buqetë në herë.",
    "section.story.cta": "Njihuni me floristët",
    "stat2.n": "1K+", "stat2.l": "Buqeta të dërguara",

    "quote.text": "“Buqeta më e bukur që kam marrë ndonjëherë në Tiranë.”",
    "quote.cite": "— Eriona K., Blloku",

    "section.visit.kicker": "Na gjeni",
    "section.visit.title": "Ejani t'i shihni",
    "section.visit.body": "Dera jonë është e hapur çdo ditë. Hyni dhe zgjidhni lulet vetë — ose na shkruani dhe ua sjellim ne.",
    "visit.label.address": "Adresa",
    "visit.label.hours": "Orari",
    "visit.label.phone": "WhatsApp",
    "visit.label.instagram": "Instagram",
    "contact.whatsapp": "Na shkruani në WhatsApp",

    "nf.kicker": "404",
    "nf.title": "Kjo faqe është vyshkur.",
    "nf.body": "Lidhja që ndoqët nuk të çon askund në faqen tonë. Buqetat, megjithatë, janë të gjitha këtu.",
    "nf.cta.shop": "Shiko buqetat",
    "nf.cta.home": "Kthehu në faqen kryesore",
    "visit.cta": "Google Maps",
    "visit.cta.apple": "Apple Maps",

    "section.reviews.kicker": "Dëshmi",
    "section.reviews.title": "E dashur në gjithë Tiranën",
    "section.reviews.note": "Vlerësime shembull, të shfaqura si ilustrim i shërbimit derisa të mbledhim përshtypjet e klientëve tanë të parë.",
    "quote.note": "Vlerësim shembull",
    "review1.text": "Porosita në mëngjes, arriti para dreke — dhe ishte edhe më e bukur se në foto. Ky është floristi ynë tani.",
    "review1.name": "Klaudia M.",
    "review2.text": "Trëndafilat zgjatën pothuajse dy javë. Shihet që janë prerë të freskët, jo duke pritur diku në frigorifer.",
    "review2.name": "Ardit S.",
    "review3.text": "Pagesa në dorëzim e bëri shumë të lehtë të dërgoja lule nënës sime pa kërkuar detajet e kartës. Buqetë e bukur gjithashtu.",
    "review3.name": "Gentiana H.",

    "newsletter.kicker": "Qëndroni në lulëzim",
    "newsletter.title": "Shihni çfarë erdhi këtë mëngjes",
    "newsletter.sub": "Publikojmë buqetat e çdo mëngjesi sapo i mbarojmë. Na shkruani dhe ju themi çfarë është e freskët sot.",
    "newsletter.cta.ig": "Na ndiqni në Instagram",

    "footer.about.title": "Amelia Flowers",
    "footer.about.text": "Floristi i lagjes në zemër të Tiranës, që rregullon lule të freskëta me dorë.",
    "footer.shop.title": "Dyqani",
    "footer.shop.roses": "Trëndafila",
    "footer.shop.seasonal": "Sezonale",
    "footer.shop.weddings": "Dasma",
    "footer.shop.gifts": "Dhurata",
    "footer.shop.plants": "Bimë",
    "footer.help.title": "Ndihmë",
    "footer.help.delivery": "Dërgesa & Pagesa",
    "footer.help.contact": "Na kontaktoni",
    "footer.help.faq": "Pyetje të Shpeshta",
    "footer.visit.title": "Na vizitoni",
    "footer.visit.hours": "Hapur çdo ditë · 08:00–21:00",
    "footer.rights": "© 2026 Amelia Flowers. Të gjitha të drejtat e rezervuara.",
    "footer.credit": "Bërë nga Alti Media",
    "seo.home.title": "Lule Amelia — Dyqan lulesh në Tiranë · Dërgesa brenda ditës",
    "seo.home.desc": "Buqeta të punuara me dorë çdo mëngjes në Bulevardin Bajram Curri, Tiranë. Dërgesa brenda ditës në gjithë qytetin, pagesë në dorëzim.",
    "seo.shop.title": "Buqeta dhe trëndafila në Tiranë — Dyqani | Lule Amelia",
    "seo.shop.desc": "Trëndafila të kuq, buqeta sezonale, lule dasme dhe orkide, të rregulluara me dorë në Tiranë. Dërgesa brenda ditës, pagesë në dorëzim.",
    "seo.product.title": "Buqetë lulesh — Lule Amelia, Tiranë",
    "seo.product.desc": "Buqetë e punuar me dorë nga Lule Amelia, Bulevardi Bajram Curri, Tiranë. Dërgesa brenda ditës në gjithë qytetin.",
    "seo.pd.suffix": "dërgesë lulesh në Tiranë",
    "seo.pd.tail": "E punuar me dorë në Tiranë, dërguar brenda ditës.",
    "seo.checkout.title": "Përfundo porosinë — Lule Amelia, Tiranë",
    "seo.checkout.desc": "Përfundo porosinë tënde te Lule Amelia. Dërgesa brenda ditës në Tiranë, pagesë në dorëzim.",

    "shop.hero.kicker": "Katalogu",
    "shop.hero.title": "Shiko buqetat",
    "shop.hero.sub": "Rregulluar me dorë, prera të freskëta çdo mëngjes. Dërgesë falas brenda ditës në Tiranë, pagesë në dorëzim.",
    "shop.empty": "Ende nuk ka buqeta në këtë kategori — kthehuni së shpejti.",

    "pd.back": "Kthehu te dyqani",
    "pd.add": "Shto në shportë",
    "pd.added": "U shtua në shportë",
    "pd.qty": "Sasia",
    "pd.meta.delivery.t": "Dërgesa",
    "pd.meta.delivery.v": "Brenda ditës në Tiranë",
    "pd.meta.care.t": "Kujdesi",
    "pd.meta.care.v": "Preni kërcellin, ndërroni ujin çdo ditë",
    "pd.meta.payment.t": "Pagesa",
    "pd.meta.payment.v": "Pagesë në dorëzim",
    "pd.related": "Mund t'ju pëlqejnë gjithashtu",

    "cart.title": "Shporta juaj",
    "cart.empty": "Shporta juaj është bosh.",
    "cart.empty.cta": "Shfleto buqetat",
    "cart.subtotal": "Nëntotali",
    "cart.checkout": "Vazhdo porosinë",
    "cart.continue": "Vazhdo blerjen",

    "checkout.hero.kicker": "Pothuajse gati",
    "checkout.hero.title": "Përfundo Porosinë",
    "checkout.section.details": "Detajet e dërgesës",
    "field.fullname": "Emri i plotë",
    "field.phone": "Numri i telefonit",
    "field.address": "Adresa",
    "field.city": "Qyteti",
    "field.notes": "Shënime dërgese (opsionale)",
    "field.notes.placeholder": "Kati, zilja, ora më e mirë për dërgesë…",
    "checkout.section.payment": "Mënyra e pagesës",
    "pay.cod.title": "Pagesë në dorëzim",
    "pay.cod.desc": "Paguani cash te korrieri ynë kur mbërrijnë lulet. Aktualisht është mënyra e vetme e pagesës që ofrojmë.",
    "checkout.summary.title": "Përmbledhja e porosisë",
    "checkout.summary.subtotal": "Nëntotali",
    "checkout.summary.delivery": "Dërgesa",
    "checkout.summary.delivery.free": "Falas",
    "checkout.summary.total": "Totali",
    "checkout.place": "Bëj porosinë · Pagesë në dorëzim",
    "checkout.empty.title": "Shporta juaj është bosh",
    "checkout.empty.sub": "Shtoni disa buqeta përpara se të vazhdoni.",
    "checkout.empty.cta": "Shiko buqetat",

    "error.required": "Kjo fushë është e detyrueshme.",
    "error.phone": "Vendosni një numër telefoni të vlefshëm.",
    "error.ratelimit": "Sapo keni bërë disa porosi. Ju lutem prisni {n} min, ose na telefononi për të porositur.",
    "error.maxqty": "Kjo është sasia maksimale online — na telefononi për porosi më të mëdha.",

    "confirm.kicker": "Porosia u mor",
    "confirm.title": "Faleminderit! Lulet tuaja janë në rrugë.",
    "confirm.body": "E morëm porosinë tuaj dhe floristët tanë tashmë po e përgatisin. Paguani cash te korrieri kur të mbërrijë te dera juaj.",
    "confirm.orderlabel": "Numri i porosisë",
    "confirm.backhome": "Kthehu në faqen kryesore",
    "confirm.deliverto": "Dërgohet te",
    "confirm.wa.button": "Dërgo porosinë me WhatsApp",
    "confirm.wa.sent": "WhatsApp duhet të jetë hapur me porosinë tuaj — shtypni dërgo për ta konfirmuar te floristët tanë.",
    "confirm.wa.blocked": "Një hap i fundit: shtypni më poshtë për t'ua dërguar porosinë floristëve tanë në WhatsApp.",
    "confirm.wa.optional": "Porosia juaj është tashmë te floristët tanë. Mund ta dërgoni edhe në WhatsApp nëse doni të shtoni diçka.",

    "confirm.pending.kicker": "Edhe një hap",
    "confirm.pending.title": "Gati — dërgoni porosinë për ta konfirmuar.",
    "confirm.pending.body": "Porosia nuk është e vendosur derisa t'u mbërrijë floristëve tanë. Shtypni dërgo në WhatsApp dhe fillojmë menjëherë përgatitjen. Nuk është bërë asnjë pagesë — paguani korrierin cash në dorëzim.",

    "cart.item.remove": "Hiq"
  },

  it: {
    "nav.shop": "Negozio",
    "nav.story": "Chi siamo",
    "nav.reviews": "Recensioni",
    "nav.contact": "Contatti",

    "hero.eyebrow": "Tirana · Bulevardi Bajram Curri",
    "hero.title1": "Fiori freschi,",
    "hero.title2": "ogni mattina.",
    "hero.sub": "Tagliati e composti a mano nel cuore di Tirana. Consegna in giornata in tutta la città, pagamento alla consegna.",
    "hero.cta.shop": "Scopri i bouquet",
    "hero.cta.story": "La nostra storia",
    "hero.scroll": "Scorri",

    "marquee.1": "Consegna in giornata a Tirana",
    "marquee.2": "Legati a mano, mai da cella frigorifera",
    "marquee.3": "Pagamento alla consegna disponibile",
    "marquee.4": "Freschi dal mercato del mattino",

    "section.signature.kicker": "I nostri bouquet",
    "section.signature.title": "Bouquet d’autore",
    "section.signature.viewall": "Vedi tutti",

    "section.story.kicker": "Dal nostro giardino",
    "section.story.title": "Composti a mano, nel cuore di Tirana",
    "section.story.body": "Ogni stelo è scelto al mercato del mattino e composto lo stesso giorno — mai dalla cella frigorifera, mai preso da uno scaffale. I nostri fioristi lavorano a mano, un bouquet alla volta.",
    "section.story.cta": "Conosci i fioristi",
    "stat2.n": "1K+", "stat2.l": "Bouquet consegnati",

    "quote.text": "«Il bouquet più bello che abbia mai ricevuto a Tirana.»",
    "quote.cite": "— Eriona K., Blloku",

    "section.visit.kicker": "Dove siamo",
    "section.visit.title": "Venite a vederli",
    "section.visit.body": "La nostra porta è aperta tutti i giorni. Entrate e scegliete i fiori di persona — oppure scriveteci e ve li portiamo noi.",
    "visit.label.address": "Indirizzo",
    "visit.label.hours": "Orari",
    "visit.label.phone": "WhatsApp",
    "visit.label.instagram": "Instagram",
    "contact.whatsapp": "Scrivici su WhatsApp",

    "nf.kicker": "404",
    "nf.title": "Questa pagina è appassita.",
    "nf.body": "Il link che hai seguito non porta da nessuna parte sul nostro sito. I bouquet, però, sono tutti qui.",
    "nf.cta.shop": "Scopri i bouquet",
    "nf.cta.home": "Torna alla home",
    "visit.cta": "Google Maps",
    "visit.cta.apple": "Apple Maps",

    "section.reviews.kicker": "Testimonianze",
    "section.reviews.title": "Amati in tutta Tirana",
    "section.reviews.note": "Recensioni di esempio, mostrate a titolo illustrativo del servizio in attesa dei riscontri dei nostri primi clienti.",
    "quote.note": "Recensione di esempio",
    "review1.text": "Ordinato la mattina, arrivato a mezzogiorno — ed era ancora più bello della foto. Ora è il nostro fioraio di fiducia.",
    "review1.name": "Klaudia M.",
    "review2.text": "Le rose sono durate quasi due settimane. Si capisce che sono tagliate fresche, non tenute in frigo chissà dove.",
    "review2.name": "Ardit S.",
    "review3.text": "Il pagamento alla consegna mi ha permesso di mandare fiori a mia madre senza chiederle i dati della carta. E la composizione era bellissima.",
    "review3.name": "Gentiana H.",

    "newsletter.kicker": "Resta in fiore",
    "newsletter.title": "Guarda cosa è arrivato stamattina",
    "newsletter.sub": "Pubblichiamo le composizioni di ogni mattina appena le finiamo. Scrivici e ti diciamo cosa c’è di fresco oggi.",
    "newsletter.cta.ig": "Seguici su Instagram",

    "footer.about.title": "Amelia Flowers",
    "footer.about.text": "Un fioraio di quartiere nel cuore di Tirana, che compone fiori freschi a mano.",
    "footer.shop.title": "Negozio",
    "footer.shop.roses": "Rose",
    "footer.shop.seasonal": "Di stagione",
    "footer.shop.weddings": "Matrimoni",
    "footer.shop.gifts": "Regali",
    "footer.shop.plants": "Piante",
    "footer.help.title": "Assistenza",
    "footer.help.delivery": "Consegna e pagamento",
    "footer.help.contact": "Contattaci",
    "footer.help.faq": "Domande frequenti",
    "footer.visit.title": "Vieni a trovarci",
    "footer.visit.hours": "Aperto tutti i giorni · 08:00–21:00",
    "footer.rights": "© 2026 Amelia Flowers. Tutti i diritti riservati.",
    "footer.credit": "Realizzato da Alti Media",
    "seo.home.title": "Invia Fiori in Albania — Consegna a Tirana in Giornata",
    "seo.home.desc": "Invia fiori a Tirana oggi stesso. Un fioraio vero sul Bulevardi Bajram Curri compone ogni bouquet a mano e lo consegna in giornata — non una rete che passa il tuo ordine ad altri.",
    "seo.shop.title": "Bouquet da inviare a Tirana — Negozio | Amelia Flowers",
    "seo.shop.desc": "Rose rosse, bouquet di stagione, fiori da matrimonio e orchidee, composti a mano a Tirana. Consegna fiori in Albania in giornata, anche ordinando dall'estero.",
    "seo.product.title": "Bouquet consegnato a Tirana — Amelia Flowers",
    "seo.product.desc": "Un bouquet composto a mano da Amelia Flowers, Bulevardi Bajram Curri, Tirana. Consegna in giornata in tutta la città.",
    "seo.pd.suffix": "consegna fiori a Tirana",
    "seo.pd.tail": "Composto a mano a Tirana e consegnato in giornata.",
    "seo.checkout.title": "Completa l'ordine — Amelia Flowers, Tirana",
    "seo.checkout.desc": "Completa il tuo ordine Amelia Flowers. Consegna in giornata a Tirana, pagamento alla consegna.",

    "shop.hero.kicker": "Catalogo",
    "shop.hero.title": "I nostri bouquet",
    "shop.hero.sub": "Composti a mano, tagliati freschi ogni mattina. Consegna gratuita in giornata a Tirana, pagamento alla consegna.",
    "shop.empty": "Ancora nessun bouquet in questa categoria — torna presto.",

    "pd.back": "Torna al negozio",
    "pd.add": "Aggiungi al carrello",
    "pd.added": "Aggiunto al carrello",
    "pd.qty": "Quantità",
    "pd.meta.delivery.t": "Consegna",
    "pd.meta.delivery.v": "In giornata a Tirana",
    "pd.meta.care.t": "Cura",
    "pd.meta.care.v": "Accorcia gli steli, cambia l’acqua ogni giorno",
    "pd.meta.payment.t": "Pagamento",
    "pd.meta.payment.v": "Alla consegna",
    "pd.related": "Potrebbe piacerti anche",

    "cart.title": "Il tuo carrello",
    "cart.empty": "Il tuo carrello è vuoto.",
    "cart.empty.cta": "Sfoglia i bouquet",
    "cart.subtotal": "Subtotale",
    "cart.checkout": "Vai alla cassa",
    "cart.continue": "Continua lo shopping",

    "checkout.hero.kicker": "Ci siamo quasi",
    "checkout.hero.title": "Cassa",
    "checkout.section.details": "Dettagli di consegna",
    "field.fullname": "Nome e cognome",
    "field.phone": "Numero di telefono",
    "field.address": "Indirizzo",
    "field.city": "Città",
    "field.notes": "Note per la consegna (facoltativo)",
    "field.notes.placeholder": "Piano, citofono, orario migliore per la consegna…",
    "checkout.section.payment": "Metodo di pagamento",
    "pay.cod.title": "Pagamento alla consegna",
    "pay.cod.desc": "Paga in contanti al corriere quando arrivano i fiori. Al momento è l’unico metodo di pagamento disponibile.",
    "checkout.summary.title": "Riepilogo ordine",
    "checkout.summary.subtotal": "Subtotale",
    "checkout.summary.delivery": "Consegna",
    "checkout.summary.delivery.free": "Gratuita",
    "checkout.summary.total": "Totale",
    "checkout.place": "Conferma ordine — Pagamento alla consegna",
    "checkout.empty.title": "Il tuo carrello è vuoto",
    "checkout.empty.sub": "Aggiungi qualche bouquet prima di procedere.",
    "checkout.empty.cta": "Scopri i bouquet",

    "error.required": "Questo campo è obbligatorio.",
    "error.phone": "Inserisci un numero di telefono valido.",
    "error.ratelimit": "Hai appena effettuato diversi ordini. Attendi {n} min, oppure chiamaci per ordinare al telefono.",
    "error.maxqty": "È il massimo che possiamo accettare online — chiamaci per ordini più grandi.",

    "confirm.kicker": "Ordine ricevuto",
    "confirm.title": "Grazie! I tuoi fiori stanno arrivando.",
    "confirm.body": "Abbiamo ricevuto il tuo ordine e i nostri fioristi lo stanno già preparando. Paga in contanti al corriere quando arriva alla tua porta.",
    "confirm.orderlabel": "Numero d’ordine",
    "confirm.backhome": "Torna alla home",
    "confirm.deliverto": "Consegna a",
    "confirm.wa.button": "Invia l’ordine su WhatsApp",
    "confirm.wa.sent": "WhatsApp dovrebbe essersi aperto con il tuo ordine — premi invia per confermarlo ai nostri fioristi.",
    "confirm.wa.blocked": "Un ultimo passo: tocca qui sotto per inviare il tuo ordine ai nostri fioristi su WhatsApp.",
    "confirm.wa.optional": "Il tuo ordine è già dai nostri fioristi. Puoi inviarlo anche su WhatsApp se vuoi aggiungere qualcosa.",

    "confirm.pending.kicker": "Manca un passo",
    "confirm.pending.title": "Ci siamo quasi — invia l\u2019ordine per confermarlo.",
    "confirm.pending.body": "L\u2019ordine non è effettuato finché non arriva ai nostri fioristi. Premi invia su WhatsApp e iniziamo subito a prepararlo. Non è stato addebitato nulla — paghi in contanti al corriere alla consegna.",

    "cart.item.remove": "Rimuovi"
  }
};

const LANGS = ["en", "sq", "it"];

const LangStore = {
  /* Albanian is the default: the shop is in Tirana and most of its customers
     are. It lives at the root; English and Italian live under /en/ and /it/.

     The URL is the whole answer, deliberately. Each of the three has its own
     title, description and hreflang block written into the HTML at build
     time, and a stored preference that could override that would mean
     /en/shop.html serving Albanian text under an English title — with
     hreflang tags pointing at an English page nobody ever sees. The language
     a visitor picks is remembered by being in the address bar. */
  DEFAULT: "sq",
  get() {
    const m = location.pathname.match(/^\/(en|it)(\/|$)/);
    return m && LANGS.indexOf(m[1]) > -1 ? m[1] : this.DEFAULT;
  },
  set() { /* nothing to store — see above */ }
};

/* This page, in another language. The path after the language prefix is the
   same in all three, so the query string and hash come along: switching
   language on a bouquet keeps you on that bouquet. */
function langHref(lang) {
  const path = location.pathname.replace(/^\/(en|it)(?=\/|$)/, "") || "/";
  const prefix = lang === "sq" ? "" : "/" + lang;
  return prefix + path + location.search + location.hash;
}

function t(key, lang) {
  lang = lang || LangStore.get();
  return (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
}

function applyLanguage(lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.getAttribute("data-i18n"), lang);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder"), lang));
  });
  document.querySelectorAll(".lang-pill [data-lang]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
  document.querySelectorAll("[data-i18n-dyn]").forEach(el => {
    if (typeof window.renderDynamicI18n === "function") window.renderDynamicI18n(el, lang);
  });
  LangStore.set(lang);
  document.dispatchEvent(new CustomEvent("pf:langchange", { detail: { lang } }));
}

function initLangSwitcher() {
  const current = LangStore.get();
  /* The static HTML is already in this language — applyLanguage is here for
     the parts JavaScript renders (the catalogue, the cart, the toasts), not
     to translate the page out from under itself. */
  applyLanguage(current);

  /* The pill ships as three plain links so a crawler can follow them; this
     only sharpens each href with the query string and hash of wherever the
     visitor actually is. */
  document.querySelectorAll(".lang-pill [data-lang]").forEach(el => {
    const lang = el.dataset.lang;
    /* A page that exists in one language only carries data-lang-fixed and
       already points somewhere sensible — leave those hrefs alone. */
    if (el.tagName === "A" && !el.closest(".lang-pill").hasAttribute("data-lang-fixed")) {
      el.setAttribute("href", langHref(lang));
    }
    el.classList.toggle("active", lang === current);
  });
}

document.addEventListener("DOMContentLoaded", initLangSwitcher);
