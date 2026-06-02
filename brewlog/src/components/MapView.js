/* ============================================================
   MapView.js — interactive map tab

   Uses Leaflet (via react-leaflet) to show all shops as pins.
   Dark pins = visited, amber pins = wishlist.
   Tapping a pin opens the detail modal.

   The map defaults to Miami. When you add a shop and provide
   lat/lng, the pin appears in the right place. Without lat/lng
   the shop still appears in the card list below the map.

   Props:
     shops        — array of shop objects
     onOpenDetail — callback(shop)
   ============================================================ */

import React, { useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import ShopCard from './ShopCard';
import styles from './MapView.module.css';

// Fix Leaflet's default icon path (it breaks in webpack/CRA builds)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

/** Create a custom round pin icon.
 *  color: CSS color string for the circle background
 *  emoji: character shown inside the pin
 */
function makeIcon(color, emoji) {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        width:32px; height:32px; border-radius:50% 50% 50% 0;
        transform:rotate(-45deg); background:${color};
        border:2px solid white; box-shadow:0 2px 6px rgba(0,0,0,0.3);
        display:flex; align-items:center; justify-content:center;
      ">
        <span style="transform:rotate(45deg); font-size:14px">${emoji}</span>
      </div>`,
    iconSize:   [32, 32],
    iconAnchor: [16, 32],
    popupAnchor:[0, -34],
  });
}

const ICON_VISITED  = makeIcon('#2C1A0E', '☕');
const ICON_WISHLIST = makeIcon('#C17A3A', '🔖');

// Default map center — change this if you mostly use the app in a different city
const DEFAULT_CENTER = [25.7617, -80.1918]; // Miami
const DEFAULT_ZOOM   = 13;

export default function MapView({ shops, onOpenDetail }) {
  // Shops that have lat/lng coordinates (can be shown on the map)
  const mappableShops = shops.filter(s => s.lat && s.lng);
  // Recent visited shops shown as cards below the map
  const recentVisited = shops.filter(s => s.status === 'visited').slice(0, 5);

  const visitedCount  = shops.filter(s => s.status === 'visited').length;
  const wishlistCount = shops.filter(s => s.status === 'wishlist').length;
  const cityCount     = new Set(shops.map(s => s.city || s.location)).size;

  return (
    <div className={styles.container}>
      {/* ── Stats strip ── */}
      <div className={styles.stats}>
        <div className={styles.stat}><span className={styles.statNum}>{visitedCount}</span><span className={styles.statLabel}>Visited</span></div>
        <div className={styles.stat}><span className={styles.statNum}>{wishlistCount}</span><span className={styles.statLabel}>Wishlist</span></div>
        <div className={styles.stat}><span className={styles.statNum}>{cityCount}</span><span className={styles.statLabel}>Cities</span></div>
      </div>

      {/* ── Leaflet map ── */}
      <div className={styles.mapWrap}>
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          className={styles.map}
          // Disable zoom on scroll so the page can still scroll on desktop
          scrollWheelZoom={false}
        >
          {/* OpenStreetMap tiles — free, no API key needed */}
          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {mappableShops.map(shop => (
            <Marker
              key={shop.id}
              position={[shop.lat, shop.lng]}
              icon={shop.status === 'visited' ? ICON_VISITED : ICON_WISHLIST}
              eventHandlers={{ click: () => onOpenDetail(shop) }}
            >
              {/* Small popup on tap — tapping "View" opens the full detail modal */}
              <Popup>
                <strong>{shop.name}</strong><br />
                <small>{shop.location}</small><br />
                <button
                  style={{ marginTop: 6, fontSize: 12, cursor: 'pointer' }}
                  onClick={() => onOpenDetail(shop)}
                >
                  View details →
                </button>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Legend overlay */}
        <div className={styles.legend}>
          <span><span className={styles.dotVisited}></span>Visited</span>
          <span><span className={styles.dotWish}></span>Wishlist</span>
        </div>
      </div>

      {/* ── Recent visits ── */}
      <div className={styles.list}>
        <h2 className={styles.listTitle}>Recent visits</h2>
        {recentVisited.length === 0
          ? <p className={styles.empty}>No visits yet — tap + to add your first café!</p>
          : recentVisited.map(shop => (
              <ShopCard key={shop.id} shop={shop} onOpenDetail={onOpenDetail} />
            ))
        }
      </div>
    </div>
  );
}
