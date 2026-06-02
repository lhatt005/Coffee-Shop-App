/* ============================================================
   ListView.js — "Cafés" tab: all shops with a filter toggle

   Props:
     shops        — array of shop objects
     onOpenDetail — callback(shop)
   ============================================================ */

import React, { useState } from 'react';
import ShopCard from './ShopCard';
import styles from './ListView.module.css';

const FILTERS = ['all', 'visited', 'wishlist'];

export default function ListView({ shops, onOpenDetail }) {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? shops
    : shops.filter(s => s.status === filter);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>All cafés</h2>
        <div className={styles.chips}>
          {FILTERS.map(f => (
            <button
              key={f}
              className={`${styles.chip} ${filter === f ? styles.chipActive : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0
        ? <p className={styles.empty}>Nothing here yet — tap + to add a café!</p>
        : filtered.map(shop => (
            <ShopCard key={shop.id} shop={shop} onOpenDetail={onOpenDetail} />
          ))
      }
    </div>
  );
}
