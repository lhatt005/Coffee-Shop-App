/* ============================================================
   BottomNav.js — fixed bottom navigation bar

   Mirrors the tabs in the Header but lives at the bottom of
   the screen for easy thumb access on phones.
   ============================================================ */

import React from 'react';
import styles from './BottomNav.module.css';

const TABS = [
  { key: 'map',      label: 'Map',      emoji: '🗺️' },
  { key: 'list',     label: 'Cafés',    emoji: '☕' },
  { key: 'wishlist', label: 'Wishlist', emoji: '🔖' },
];

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className={styles.nav} aria-label="Main navigation">
      {TABS.map(tab => (
        <button
          key={tab.key}
          className={`${styles.btn} ${activeTab === tab.key ? styles.btnActive : ''}`}
          onClick={() => onTabChange(tab.key)}
          aria-current={activeTab === tab.key ? 'page' : undefined}
        >
          <span className={styles.emoji}>{tab.emoji}</span>
          <span className={styles.label}>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
