/* ============================================================
   AddEditModal.js — slide-up form to add or edit a café

   When adding:   existingShop is null, form starts blank
   When editing:  existingShop is the shop object, form pre-fills

   Props:
     existingShop — shop object to edit, or null for a new one
     onSave       — callback(shopData) called on submit
     onClose      — callback() to dismiss the modal
   ============================================================ */

import React, { useState, useRef } from 'react';
import styles from './AddEditModal.module.css';

/** StarPicker — tappable star row for rating (1–5) */
function StarPicker({ value, onChange }) {
  return (
    <div className={styles.starPicker} role="group" aria-label="Star rating">
      {[1,2,3,4,5].map(n => (
        <button
          key={n}
          type="button"
          className={`${styles.starBtn} ${n <= value ? styles.starLit : ''}`}
          onClick={() => onChange(n)}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function AddEditModal({ existingShop, onSave, onClose }) {
  const isEditing = Boolean(existingShop?.id);

  // ── Form state — initialised from existingShop if editing ──
  const [name,    setName]    = useState(existingShop?.name     ?? '');
  const [location,setLocation]= useState(existingShop?.location ?? '');
  const [city,    setCity]    = useState(existingShop?.city     ?? '');
  const [status,  setStatus]  = useState(existingShop?.status   ?? 'visited');
  const [stars,   setStars]   = useState(existingShop?.stars    ?? 3);
  const [review,  setReview]  = useState(existingShop?.review   ?? '');
  const [tags,    setTags]    = useState(existingShop?.tags?.join(', ') ?? '');
  const [photos,  setPhotos]  = useState(existingShop?.photos   ?? []);
  // Lat/lng are optional — used to place the pin on the map
  const [lat,     setLat]     = useState(existingShop?.lat ?? '');
  const [lng,     setLng]     = useState(existingShop?.lng ?? '');

  const fileInputRef = useRef(null);

  // ── Photo handling ─────────────────────────────────────────
  // We store photos as base64 strings inside localStorage.
  // Each image is converted with FileReader and pushed into the array.
  // NOTE: Large photos can fill up localStorage quickly (~5 MB limit).
  // If that becomes a problem, consider resizing before storing.
  function handlePhotoChange(e) {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        setPhotos(prev => [...prev, ev.target.result]);
      };
      reader.readAsDataURL(file);
    });
  }

  function removePhoto(index) {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  }

  // ── Submit ─────────────────────────────────────────────────
  function handleSubmit() {
    if (!name.trim()) {
      alert('Please enter a café name.');
      return;
    }

    // Convert the comma-separated tags string into a clean array
    const parsedTags = tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    onSave({
      // Preserve id when editing so the update function can find the right shop
      ...(existingShop?.id ? { id: existingShop.id } : {}),
      name:     name.trim(),
      location: location.trim() || 'Unknown',
      city:     city.trim() || location.split(',').pop()?.trim() || '',
      status,
      stars:    status === 'visited' ? stars : 0,
      review:   status === 'visited' ? review.trim() : '',
      tags:     parsedTags,
      photos,
      // Only include lat/lng if both are valid numbers
      ...(lat && lng && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng))
        ? { lat: parseFloat(lat), lng: parseFloat(lng) }
        : {}),
    });
  }

  // ── Render ──────────────────────────────────────────────────
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheet} onClick={e => e.stopPropagation()}>
        <div className={styles.handle} />

        <div className={styles.header}>
          <h2 className={styles.title}>{isEditing ? 'Edit café' : 'Add a café'}</h2>
          <p className={styles.subtitle}>
            {isEditing ? 'Update the details below.' : 'Save it now — forget nothing later.'}
          </p>
        </div>

        <div className={styles.form}>
          {/* Café name */}
          <label className={styles.label}>Café name *</label>
          <input
            className={styles.input}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Panther Coffee"
          />

          {/* Location — human readable address/neighbourhood */}
          <label className={styles.label}>Neighbourhood / address</label>
          <input
            className={styles.input}
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="e.g. Wynwood, Miami"
          />

          {/* City — used for the "Cities" counter on the map */}
          <label className={styles.label}>City</label>
          <input
            className={styles.input}
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder="e.g. Miami"
          />

          {/* Status toggle */}
          <label className={styles.label}>Status</label>
          <div className={styles.toggle}>
            <button
              type="button"
              className={`${styles.toggleBtn} ${status === 'visited' ? styles.toggleVisited : ''}`}
              onClick={() => setStatus('visited')}
            >
              ✓ Been here
            </button>
            <button
              type="button"
              className={`${styles.toggleBtn} ${status === 'wishlist' ? styles.toggleWish : ''}`}
              onClick={() => setStatus('wishlist')}
            >
              ♡ Want to go
            </button>
          </div>

          {/* Review section — only shown for visited shops */}
          {status === 'visited' && (
            <>
              <label className={styles.label}>Rating</label>
              <StarPicker value={stars} onChange={setStars} />

              <label className={styles.label}>Review / vibes</label>
              <textarea
                className={`${styles.input} ${styles.textarea}`}
                value={review}
                onChange={e => setReview(e.target.value)}
                placeholder="The cortado was silky, loved the light and the plants..."
              />
            </>
          )}

          {/* Photos */}
          <label className={styles.label}>Photos</label>
          <button
            type="button"
            className={styles.photoUpload}
            onClick={() => fileInputRef.current?.click()}
          >
            📷 Take or choose photos
          </button>
          {/* accept="image/*" + capture on mobile opens camera directly */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={handlePhotoChange}
          />

          {/* Photo preview thumbnails */}
          {photos.length > 0 && (
            <div className={styles.previews}>
              {photos.map((src, i) => (
                <div key={i} className={styles.thumbWrap}>
                  <img src={src} alt={`Photo ${i+1}`} className={styles.thumb} />
                  <button
                    type="button"
                    className={styles.thumbRemove}
                    onClick={() => removePhoto(i)}
                    aria-label="Remove photo"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Tags */}
          <label className={styles.label}>Tags (comma separated)</label>
          <input
            className={styles.input}
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="e.g. specialty, cozy, great wifi"
          />

          {/* Optional: map coordinates for the pin */}
          <details className={styles.advanced}>
            <summary className={styles.advancedToggle}>📍 Set map pin (optional)</summary>
            <div className={styles.latLngRow}>
              <div style={{ flex: 1 }}>
                <label className={styles.label}>Latitude</label>
                <input className={styles.input} value={lat} onChange={e => setLat(e.target.value)} placeholder="25.8006" />
              </div>
              <div style={{ flex: 1 }}>
                <label className={styles.label}>Longitude</label>
                <input className={styles.input} value={lng} onChange={e => setLng(e.target.value)} placeholder="-80.1994" />
              </div>
            </div>
            <p className={styles.hint}>
              Tip: search for the café in Google Maps, tap & hold to drop a pin, then copy the coordinates shown at the bottom.
            </p>
          </details>
        </div>

        <button className={styles.saveBtn} onClick={handleSubmit}>
          {isEditing ? 'Save changes' : 'Save café'}
        </button>
        <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
