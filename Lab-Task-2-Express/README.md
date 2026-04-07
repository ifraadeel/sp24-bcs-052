# Oura Ring Clone — Express + EJS

Assignment 3: Responsive Nav + Express conversion.

## Project Structure

```
oura-express/
├── app.js                    ← Express entry point
├── package.json
├── routes/
│   └── index.js              ← All route handlers + page data
├── views/
│   ├── index.ejs             ← Landing page (EJS template)
│   ├── 404.ejs               ← 404 error page
│   └── partials/
│       ├── header.ejs        ← Nav bar partial (reusable)
│       └── footer.ejs        ← Footer partial (reusable)
└── public/                   ← Static assets (served by Express)
    ├── css/
    │   └── OuraRingStyling.css
    ├── js/
    │   └── nav.js
    ├── images/               ← ⚠️ Add your .avif/.jpg files here
    └── videos/               ← ⚠️ Add your .mp4 file here
```

## Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Add your asset files (see public/images and public/videos folders)

# 3. Start the server
npm start

# OR for auto-reload during development:
npm run dev

# 4. Open in browser
http://localhost:3000
```

## Adding Assets

Your original project referenced assets from `../Assests/` (relative paths).  
In Express, all static files go inside `public/` and are served from `/`:

| Original path                              | New path in Express             |
|--------------------------------------------|---------------------------------|
| `../Assests/images/men-ring.avif`          | `public/images/men-ring.avif`   |
| `../Assests/images/women-ring.jpg`         | `public/images/women-ring.jpg`  |
| `../Assests/videos/OuraRing Landing Page video.mp4` | `public/videos/OuraRing Landing Page video.mp4` |

## What Changed from Assignment 2 → 3

- `OuraMenuStyling.html` → `views/index.ejs` (EJS template with dynamic data)
- Nav items, ring cards, news cards, footer links now come from `routes/index.js`
- Header and footer extracted into reusable **partials**
- `OuraRingStyling.css` → moved to `public/css/` (served as static file)
- `nav.js` → moved to `public/js/` (fixed: DOMContentLoaded guard + smooth animation)
- Asset paths updated from `../Assests/` → `/images/` and `/videos/`
