# ☕ Brewlog — Coffee Shop Tracker

A mobile-first PWA to track every café you visit or want to visit.
Map view, photo uploads, ratings, reviews, and a wishlist — all saved locally in your browser.

---

## 🚀 Deploy to your phone (5 minutes, free)

### Step 1 — Get the code on GitHub
1. Go to [github.com](https://github.com) and sign up / log in
2. Click **New repository**, name it `brewlog`, make it **Public**, hit **Create**
3. Upload all these files (drag & drop the whole folder onto the GitHub page)

### Step 2 — Deploy with Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click **Add New → Project**, choose your `brewlog` repo
3. Vercel auto-detects it's a React app — just click **Deploy**
4. In ~60 seconds you get a live URL like `brewlog-abc123.vercel.app`

### Step 3 — Add to your phone home screen
**iPhone (Safari):**
1. Open your Vercel URL in Safari
2. Tap the Share icon (box with arrow) → **Add to Home Screen**
3. Done — it opens full-screen like a native app

**Android (Chrome):**
1. Open your Vercel URL in Chrome
2. Tap the three-dot menu → **Add to Home Screen**

---

## 🗂 Project structure

```
src/
  App.js              ← root component, owns all state
  storage.js          ← all localStorage read/write logic
  components/
    Header.js         ← top bar with tabs and counts
    BottomNav.js      ← bottom tab bar for thumb navigation
    MapView.js        ← map tab (Leaflet + OpenStreetMap)
    ListView.js       ← cafés tab with filter chips
    WishlistView.js   ← wishlist tab
    ShopCard.js       ← reusable card component
    AddEditModal.js   ← slide-up form to add / edit a café
    DetailModal.js    ← slide-up detail view for a café
```

Each component has a matching `.module.css` file next to it.
CSS custom properties (colors, fonts, spacing) live in `src/index.css` under `:root`.

---

## 🎨 Want to change something?

**Colors** → `src/index.css`, edit the CSS variables in `:root`

**Add a new field** (e.g. a "price range" picker):
1. Add state in `AddEditModal.js` and a form element
2. Include the field in the `onSave(shopData)` call
3. Display it in `DetailModal.js` and/or `ShopCard.js`

**Change the default map city** → `MapView.js`, edit `DEFAULT_CENTER` and `DEFAULT_ZOOM`

**Add more sample cafés** → `storage.js`, edit the `SAMPLE_SHOPS` array

---

## 📦 Run locally

```bash
npm install
npm start
```

Then open http://localhost:3000 in your browser.
