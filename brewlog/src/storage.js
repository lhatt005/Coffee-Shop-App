/* ============================================================
   storage.js — All data persistence lives here.

   We use the browser's localStorage so data survives page
   refreshes and closing the app. Everything is stored as JSON
   under the key 'brewlog_shops'.

   If you ever want to swap to a real database or cloud storage
   (e.g. Supabase, Firebase), this is the only file you'd need
   to change. The rest of the app just calls these functions.
   ============================================================ */

const STORAGE_KEY = 'brewlog_shops';

// A handful of sample cafés so the app isn't empty on first load.
// Feel free to delete these — they'll be gone once you clear data
// or replace them with your own entries.
const SAMPLE_SHOPS = [
  {
    id: 'sample-1',
    name: 'Panther Coffee',
    location: 'Wynwood, Miami',
    city: 'Miami',
    lat: 25.8006,
    lng: -80.1994,
    status: 'visited',       // 'visited' or 'wishlist'
    stars: 5,
    review: 'Absolute must. Single-origin pour-overs, incredible natural light. The space feels like a gallery.',
    tags: ['specialty', 'bright', 'pour-over'],
    photos: [],              // array of base64 image strings
    createdAt: Date.now(),
  },
  {
    id: 'sample-2',
    name: 'Corvina Coffee',
    location: 'Brickell, Miami',
    city: 'Miami',
    lat: 25.7641,
    lng: -80.1936,
    status: 'visited',
    stars: 4,
    review: 'Solid cortado, great for working. Clean and modern vibes.',
    tags: ['work-friendly', 'espresso'],
    photos: [],
    createdAt: Date.now() - 86400000,
  },
  {
    id: 'sample-3',
    name: 'Lot 15',
    location: 'South Beach, Miami',
    city: 'Miami',
    lat: 25.7825,
    lng: -80.1330,
    status: 'wishlist',
    stars: 0,
    review: '',
    tags: ['outdoor', 'brunch'],
    photos: [],
    createdAt: Date.now() - 172800000,
  },
];

/** Load all shops from localStorage. Returns the sample data on first run. */
export function loadShops() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load shops:', e);
  }
  return SAMPLE_SHOPS;
}

/** Save the full shops array to localStorage. */
export function saveShops(shops) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shops));
  } catch (e) {
    // localStorage can fail if the browser storage quota is exceeded
    // (most likely from storing large base64 photos)
    console.error('Failed to save shops — storage may be full:', e);
    alert('Could not save — your storage may be full. Try removing some photos.');
  }
}

/** Add a new shop. Returns the updated array. */
export function addShop(shops, newShop) {
  const updated = [newShop, ...shops];
  saveShops(updated);
  return updated;
}

/** Update an existing shop by id. Returns the updated array. */
export function updateShop(shops, updatedShop) {
  const updated = shops.map(s => s.id === updatedShop.id ? updatedShop : s);
  saveShops(updated);
  return updated;
}

/** Delete a shop by id. Returns the updated array. */
export function deleteShop(shops, id) {
  const updated = shops.filter(s => s.id !== id);
  saveShops(updated);
  return updated;
}
