/* ============================================================
   WishlistView.js — "Wishlist" tab: places you want to visit
   ============================================================ */

import React from 'react';
import ShopCard from './ShopCard';
import styles from './ListView.module.css'; // reuses same styles

export default function WishlistView({ shops, onOpenDetail }) {
  const wishlist = shops.filter(s => s.status === 'wishlist');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Want to visit</h2>
        <span style={{ fontSize: 13, color: 'var(--muted)' }}>{wishlist.length} saved</span>
      </div>

      {wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--muted)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔖</div>
          <p style={{ fontSize: 14 }}>No wishlist spots yet.</p>
          <p style={{ fontSize: 13, marginTop: 6 }}>Tap + and choose "Want to go" to save a café.</p>
        </div>
      ) : (
        wishlist.map(shop => (
          <ShopCard key={shop.id} shop={shop} onOpenDetail={onOpenDetail} />
        ))
      )}
    </div>
  );
}
