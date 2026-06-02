/* ============================================================
   Header.js — sticky top bar with logo and tab buttons

   Props:
     activeTab    — 'map' | 'list' | 'wishlist'
     onTabChange  — callback(tab: string)
     visitedCount — number shown in the visited badge
     wishlistCount — number shown in the wishlist badge
   ============================================================ */

import React from 'react';
import styles from './Header.module.css';

const TABS = [
  { key: 'map',      label: 'Map',      icon: '🗺️' },
  { key: 'list',     label: 'Cafés',    icon: '☕' },
  { key: 'wishlist', label: 'Wishlist', icon: '🔖' },
];

export default function Header({ activeTab, onTabChange, visitedCount, wishlistCount }) {
  return (
    <header className={styles.header}>
      <div className={styles.top}>
        <span className={styles.logo}>brew<span className={styles.logoAccent}>log</span></span>
        <div className={styles.counts}>
          <span className={styles.countPill}>☕ {visitedCount} visited</span>
          <span className={styles.countPillWish}>🔖 {wishlistCount} saved</span>
        </div>
      </div>

      {/* Tab switcher */}
      <nav className={styles.tabs} role="tablist">
        {TABS.map(tab => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={activeTab === tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
            onClick={() => onTabChange(tab.key)}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
