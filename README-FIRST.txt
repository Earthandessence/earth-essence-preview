EARTH & ESSENCE — SINGLE-PACKAGE PWA DEVELOPMENT PREVIEW
========================================================
WHAT IS ACTUALLY BUILT
- Your original uploaded logo, branded homepage, six original app sections.
- 250 searchable plant entries (common + scientific names) and clickable profiles.
- 20 profiles have starter educational notes; 230 explicitly say research pending.
- Photo cards ATTEMPT to load Wikipedia thumbnails online. No licensed plant-photo collection is bundled, and not every photo will load. Do not present photos as cleared for commercial use.
- Preparation Room (six introductory concepts), Recipe Garden (three simple culinary ideas + planned collection), Wisdom Journal (saved locally in this browser only), Seasonal Almanac, Community placeholder.
- Installable PWA manifest, icons and offline caching of the app shell and text.

WHAT IS NOT BUILT — DO NOT SELL AS A COMPLETED PAID MEMBERSHIP
- 250 fully researched/verified plant profiles or 250 bundled plant photos.
- Secure Supabase member registration/login, Stripe subscription verification, private database policies, webhook processing, member-only access.
- Community accounts/posts, synchronized private journal, paid checkout, or working subscription billing.
- Any guarantee that all plant information is medically reviewed.

COST / DEPLOYMENT
- This package can be reviewed locally without spending Netlify deployment credits.
- Uploading to GitHub connected to Netlify will trigger a deployment and may use credits. Do not deploy until ready.
- Stripe payment processing and optional subscription features may incur fees.

HOW TO REVIEW ON A COMPUTER
- Extract the ZIP into one folder, then in that folder run: python3 -m http.server 8000
- Open http://localhost:8000 in a browser.
- A local file:// open may display the app, but service workers require HTTP(S).
- On iPad you can review code/files without deploying; install behavior requires HTTPS hosting.

HOW TO DEPLOY LATER (ONLY WHEN READY)
- Back up existing GitHub repository first. Upload this package's CONTENTS to repository root, preserving the assets folder.
- Your Netlify site must serve index.html at root and use HTTPS.
- iPhone/iPad Safari: Share > Add to Home Screen. Android Chrome: Install app/Add to Home Screen. Desktop browsers: Install icon if supported.
- Keep the current live website unchanged until the replacement is checked.

MEMBERSHIP IMPLEMENTATION (SEPARATE REQUIRED ENGINEERING)
- Supabase auth with confirmed emails and locked-down row-level security.
- Stripe Checkout or Payment Links + a secure webhook verifying signatures server-side.
- Verified subscription status stored in private database, with access enforced server-side / via database RLS, not merely hidden HTML buttons.
- Stripe keys and Supabase service-role keys must never appear in public JS.
- Verify Stripe business approval and tax settings before selling.

SOURCE / EDITING
- plants.json is the editable catalog. plants-data.js is the browser-loaded equivalent; keep both in sync.
- index.html, app.js and sw.js are the app source.
- External photo API: Wikipedia MediaWiki pageimages; photos have individual licensing and attribution requirements. Replace with verified, licensed images before commercial use.
- Editorial notes are educational drafts requiring expert review and references.
