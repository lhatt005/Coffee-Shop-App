/* ============================================================
   App.js — Root component

   This is the top of the component tree. It owns the global
   state (the list of shops + which tab/modal is open) and
   passes data down to child components via props.

   STRUCTURE:
     App
     ├── Header
     ├── MapView      (tab 0)
     ├── ListView     (tab 1)
     ├── WishlistView (tab 2)
     ├── AddEditModal (slide-up form for adding / editing a shop)
     ├── DetailModal  (slide-up view for a single shop)
     └── BottomNav
   ============================================================ */

import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { loadShops, addShop, updateShop, deleteShop } from './storage';
import Header       from './components/Header';
import BottomNav    from './components/BottomNav';
import MapView      from './components/MapView';
import ListView     from './components/ListView';
import WishlistView from './components/WishlistView';
import AddEditModal from './components/AddEditModal';
import DetailModal  from './components/DetailModal';

import styles from './App.module.css';

export default function App() {
  // ── State ────────────────────────────────────────────────
  const [shops, setShops]           = useState(() => loadShops());
  const [activeTab, setActiveTab]   = useState('map');   // 'map' | 'list' | 'wishlist'
  const [addModalOpen, setAddModalOpen]     = useState(false);
  const [editingShop, setEditingShop]       = useState(null);   // shop object or null
  const [detailShop, setDetailShop]         = useState(null);   // shop object or null

  // ── Handlers ─────────────────────────────────────────────

  /** Called when the AddEditModal is submitted with a new or updated shop. */
  const handleSave = useCallback((shopData) => {
    if (shopData.id) {
      // Editing an existing shop
      setShops(prev => updateShop(prev, shopData));
    } else {
      // New shop — generate a unique id
      const newShop = { ...shopData, id: uuidv4(), createdAt: Date.now() };
      setShops(prev => addShop(prev, newShop));
    }
    setAddModalOpen(false);
    setEditingShop(null);
  }, []);

  /** Open the form pre-filled with an existing shop's data. */
  const handleEdit = useCallback((shop) => {
    setDetailShop(null);
    setEditingShop(shop);
    setAddModalOpen(true);
  }, []);

  /** Remove a shop and close any open modals. */
  const handleDelete = useCallback((id) => {
    setShops(prev => deleteShop(prev, id));
    setDetailShop(null);
  }, []);

  /** Open the detail view for a shop (tapping a card or map pin). */
  const handleOpenDetail = useCallback((shop) => {
    setDetailShop(shop);
  }, []);

  // Derived counts shown in the header / stats strip
  const visitedCount  = shops.filter(s => s.status === 'visited').length;
  const wishlistCount = shops.filter(s => s.status === 'wishlist').length;

  return (
    <div className={styles.app}>
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        visitedCount={visitedCount}
        wishlistCount={wishlistCount}
      />

      <main className={styles.main}>
        {activeTab === 'map'      && (
          <MapView shops={shops} onOpenDetail={handleOpenDetail} />
        )}
        {activeTab === 'list'     && (
          <ListView shops={shops} onOpenDetail={handleOpenDetail} />
        )}
        {activeTab === 'wishlist' && (
          <WishlistView shops={shops} onOpenDetail={handleOpenDetail} />
        )}
      </main>

      {/* Floating "+" button — always visible */}
      <button
        className={styles.fab}
        onClick={() => { setEditingShop(null); setAddModalOpen(true); }}
        aria-label="Add a new café"
      >
        +
      </button>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Modals — rendered at the root level so they overlay everything */}
      {addModalOpen && (
        <AddEditModal
          existingShop={editingShop}
          onSave={handleSave}
          onClose={() => { setAddModalOpen(false); setEditingShop(null); }}
        />
      )}
      {detailShop && (
        <DetailModal
          shop={detailShop}
          onClose={() => setDetailShop(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
