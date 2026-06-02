/* ============================================================
   DetailModal.js — slide-up view for a single café

   Shows all photos, the review, rating, tags, and action
   buttons to edit or delete the entry.

   Props:
     shop      — the shop object to display
     onClose   — dismiss callback
     onEdit    — callback(shop) to open the edit form
     onDelete  — callback(id) to delete and close
   ============================================================ */

import React, { useState } from 'react';
import styles from './DetailModal.module.css';

function Stars({ count }) {
  return (
    <div className={styles.stars}>
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= count ? styles.starFilled : styles.starEmpty}>★</span>
      ))}
    </div>
  );
}

export default function DetailModal({ shop, onClose, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const isVisited = shop.status === 'visited';

  function handleDelete() {
    if (!confirmDelete) {
      // First tap: show a confirmation prompt
      setConfirmDelete(true);
      return;
    }
    onDelete(shop.id);
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheet} onClick={e => e.stopPropagation()}>
        <div className={styles.handle} onClick={onClose} />

        {/* ── Photo strip ── */}
        <div className={styles.photos}>
          {shop.photos && shop.photos.length > 0
            ? shop.photos.map((src, i) => (
                <img key={i} src={src} alt={`Photo ${i+1} of ${shop.name}`} className={styles.photo} />
              ))
            : <div className={styles.photoPlaceholder}><span>☕</span></div>
          }
        </div>

        <div className={styles.body}>
          {/* Name & location */}
          <div className={styles.nameRow}>
            <h2 className={styles.name}>{shop.name}</h2>
            <span className={isVisited ? styles.badgeVisited : styles.badgeWish}>
              {isVisited ? '✓ Visited' : '♡ Wishlist'}
            </span>
          </div>
          <p className={styles.location}>📍 {shop.location}</p>

          {/* Stars */}
          {isVisited && shop.stars > 0 && <Stars count={shop.stars} />}

          {/* Review */}
          {isVisited && shop.review && (
            <blockquote className={styles.review}>"{shop.review}"</blockquote>
          )}

          {/* Tags */}
          {shop.tags?.length > 0 && (
            <div className={styles.tags}>
              {shop.tags.map(tag => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className={styles.actions}>
            <button className={styles.editBtn} onClick={() => onEdit(shop)}>
              ✏️ Edit
            </button>
            <button
              className={`${styles.deleteBtn} ${confirmDelete ? styles.deleteBtnConfirm : ''}`}
              onClick={handleDelete}
            >
              {confirmDelete ? 'Tap again to confirm delete' : '🗑 Remove'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
