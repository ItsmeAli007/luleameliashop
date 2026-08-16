/* ══════════════════════════════════════════════════════════════════
   Amelia Flowers — shop settings. This is the only file you need to
   edit to change where orders go.
   ══════════════════════════════════════════════════════════════════ */

const SHOP = {
  /* ── The two numbers, and why they are different ─────────────────
     ORDERS go to one number; PUBLIC ENQUIRIES go to another. Keeping
     them apart means the order line stays clear of general questions,
     and you can change the public one without touching checkout.

     Both are international format, digits only — no +, no spaces, no
     dashes. Albania is country code 355, and you DROP the leading 0 of
     the local number:
         069 601 7072   ->   "355696017072"                          */

  /* Receives the pre-filled order message from checkout. Never shown
     to customers. Leave empty ("") to switch the hand-off off. */
  whatsapp: "355696017072",

  /* The number behind the public "Message us on WhatsApp" links in the
     footer, the Visit panel and the mobile menu. Deliberately NOT
     printed as digits anywhere — the site offers WhatsApp as a channel
     rather than publishing a phone number to be dialled or scraped.
     Leave empty ("") and every one of those links removes itself. */
  contactWhatsapp: "355698576569",

  /* Set this to a number string (e.g. "+355 69 857 6569") only if you
     later decide to publish a dialable number in plain text. While it
     is empty the site shows the WhatsApp link above instead. */
  phoneDisplay: "",

  /* Instagram handle, with or without the @ — the link is built from it.
     Leave empty ("") and the Instagram icon hides itself rather than
     sitting in the footer pointing nowhere. */
  instagram: "lule.amelia",

  /* Facebook page — the part after facebook.com/, or a full URL. Empty
     until the page exists, and while it is empty the Facebook icon takes
     itself out of the footer: an icon linking to nothing reads worse than
     no icon at all. */
  facebook: "",

  /* ── Where the shop is ───────────────────────────────────────────
     Written into the footer and the mobile menu on every page, and
     used for the "Get directions" links. The address is not translated:
     a street name is the same in both languages, and a courier or a
     taxi driver needs it exactly as it is written on the map.

     The map links open on lat/lng when they are filled in below, and
     otherwise search for the address text. Coordinates are the better of
     the two: a search for a boulevard opens fitted to the whole street,
     while a coordinate lands on the door.

     To pin the exact shop: right-click the doorway in Google Maps and
     click the latitude/longitude at the top of the menu, which copies
     them. Paste them here, latitude first, in place of the nulls. */
  location: {
    address: "Bulevardi Bajram Curri, Tirana",

    /* Google's plus code for the same point. Useful on its own — couriers
       in Tirana take it, and it is exact where a street name is not.
       Fill in once the exact doorway is known. */
    plusCode: "",

    lat: 41.32195131457588,
    lng: 19.80943619473869,

    /* "pin" opens the map showing the spot; "directions" opens navigation
       straight to it. Directions is the friendlier one on a phone.
       Applies to both the Google and the Apple Maps links. */
    mapsMode: "pin",

    /* The name Apple Maps prints beside the pin. Google shows the
       coordinates instead — it only labels places already on its map. */
    mapLabel: "Amelia Flowers"
  },

  /* Opens WhatsApp automatically as soon as the order is placed.
     The customer still has to press send — see README. */
  autoOpenWhatsApp: true,

  /* ── Where orders are actually recorded ──────────────────────────
     The WhatsApp hand-off is fast but not reliable: the message is
     composed in the customer's WhatsApp, and only they can press send.
     Close the tab at that moment and the order is gone, and no amount
     of code on this page can prevent it — once the hand-off happens the
     message is inside another app, out of the browser's reach.

     So the order is ALSO posted from this page the instant the form is
     submitted, which needs nothing from the customer at all. Fill these
     in and that becomes the record; WhatsApp stays as the fast ping.

     Leave orderEndpoint empty and nothing is posted anywhere — the site
     falls back to WhatsApp only, and the confirmation screen tells the
     customer honestly that their order is not confirmed until they send
     it. Do not leave it empty for long: that screen is the difference
     between a lost order and a customer who thinks flowers are coming.

     Any service that accepts a JSON POST works. Web3Forms and Formspree
     are both fine — see README for which fields each expects. */
  orderEndpoint: "",

  /* Submission key, if the service uses one. Web3Forms calls this an
     access key and it is designed to be public — it can only submit to
     your own form, it cannot read anything back. Do NOT put a secret
     API token here: everything in this file is visible to any visitor
     who opens developer tools. */
  orderEndpointKey: "",

  /* ── Abuse limits ────────────────────────────────────────────────
     These stop honest mistakes and casual repeat-clicking. They are
     enforced in the visitor's own browser, so anyone determined can
     bypass them — see the "Spam" section of the README for what
     actually protects you. */

  /* Most of any single bouquet in one order. Blocks the "9999 roses"
     order that would otherwise look real. */
  maxQtyPerItem: 25,

  /* Most separate orders one browser may place per window below. */
  maxOrdersPerWindow: 3,
  orderWindowMinutes: 15
};
