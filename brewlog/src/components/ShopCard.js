/* ============================================================
   ShopCard.js — reusable card for a single café

   Used by ListView, WishlistView, and MapView's recent list.

   Props:
     shop         — the shop object
     onOpenDetail — callback(shop) when the card is tapped
   ============================================================ */

import React from 'react';
import styles from './ShopCard.module.css';

/** Renders 1–5 star characters, filled or empty. */
function Stars({ count, max = 5 }) {
  return (
    <div className={styles.stars} aria-label={`${count} out of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < count ? styles.starFilled : styles.starEmpty}>★</span>
      ))}
    </div>
  );
}

export default function ShopCard({ shop, onOpenDetail }) {
  const isVisited = shop.status === 'visited';

  return (
    <button className={styles.card} onClick={() => onOpenDetail(shop)}>
      {/* Photo thumbnail — shows first photo or a placeholder icon */}
      <div className={styles.photo}>
        {shop.photos && shop.photos.length > 0
          ? <img src={shop.photos[0]} alt={`${shop.name} photo`} className={styles.photoImg} />
          : <span className={styles.photoPlaceholder}>☕</span>
        }
      </div>

      <div className={styles.body}>
        <p className={styles.name}>{shop.name}</p>
        <p className={styles.location}>📍 {shop.location}</p>

        {/* Status + custom tags */}
        <div className={styles.tags}>
          <span className={isVisited ? styles.tagVisited : styles.tagWishlist}>
            {isVisited ? '✓ Visited' : '♡ Wishlist'}
          </span>
          {shop.tags?.map(tag => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>

        {/* Stars and review snippet — only shown for visited shops */}
        {isVisited && shop.stars > 0 && <Stars count={shop.stars} />}
        {isVisited && shop.review && (
          <p className={styles.review}>{shop.review}</p>
        )}
      </div>
    </button>
  );
}
