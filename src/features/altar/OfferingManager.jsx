import React, { useState } from 'react';

export default function OfferingManager({ offerings, setOfferings, onAdd, onDelete, category }) {
  const [newOffering, setNewOffering] = useState({ name: '', image: null, category: '' });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const maxNameLength = 24;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewOffering({ ...newOffering, image: reader.result });
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddOffering = async (e) => {
    e.preventDefault();
    setError('');
    const name = newOffering.name.trim();
    // Use the prop category if provided, otherwise use the input
    const categoryToUse = category || newOffering.category.trim();
    if (!name || !newOffering.image || !categoryToUse) {
      setError('Name, image, and category are required.');
      return;
    }
    if (name.length > maxNameLength) {
      setError(`Name must be at most ${maxNameLength} characters.`);
      return;
    }
    if (offerings.some(o => o.name.toLowerCase() === name.toLowerCase())) {
      setError('Offering name already exists.');
      return;
    }
    try {
      if (onAdd) {
        await onAdd({ name, category: categoryToUse, src: newOffering.image });
      } else {
        setOfferings(prev => {
          const updated = [...prev];
          updated.push({ name, category: categoryToUse, src: newOffering.image });
          return updated;
        });
      }
      setNewOffering({ name: '', image: null, category: '' });
      setImagePreview(null);
    } catch (err) {
      setError(err.message || 'Failed to add offering.');
    }
  };

  const handleDeleteOffering = async (idx, item) => {
    setError('');
    try {
      if (onDelete) {
        await onDelete(item, category);
      } else {
        setOfferings(prev => {
          const updated = prev.filter((_, i) => i !== idx);
          return updated;
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to delete offering.');
    }
  };

  return (
    <div
      className="flex flex-col gap-4 rounded-2xl p-4 w-full max-w-[240px] min-w-[180px] mx-auto"
      style={{
        backgroundColor: 'var(--theme-card-bg, #fff8f0)',
        border: '2px solid var(--theme-border, #e5e7eb)'
      }}
    >
      {/* + Button to show form */}
      <div className="flex items-center mb-2">
        <span
          className="font-bold flex-1 truncate"
          style={{ color: 'var(--theme-accent, #ff5e62)' }}
        >
          Offerings
        </span>
        <button
          className="w-7 h-7 flex items-center justify-center rounded-full shadow transition ml-2"
          style={{
            backgroundColor: 'var(--theme-accent, #ff5e62)10',
            color: 'var(--theme-accent, #ff5e62)'
          }}
          title="Add Offering"
          onClick={() => setShowForm(v => !v)}
        >
          {showForm ? '×' : '+'}
        </button>
      </div>
      {/* Preview all offerings as a grid */}
      <div className="grid grid-cols-3 gap-3 pb-2 min-h-[96px] items-center w-full">
        {(Array.isArray(offerings) ? offerings : []).length === 0 ? (
          <span className="text-xs col-span-3" style={{ color: 'var(--theme-border, #888)' }}>No offerings yet. Add one below!</span>
        ) : (
          (Array.isArray(offerings) ? offerings : []).map((offering, idx) => (
            <div key={idx} className="flex flex-col items-center w-[64px] h-[90px] p-2 justify-center">
              {(offering.src || offering.image) && (
                <img
                  src={offering.src || offering.image}
                  alt={offering.name}
                  className="w-12 h-12 object-cover rounded mb-1"
                  style={{ maxWidth: '48px', maxHeight: '48px' }}
                  draggable={true}
                  onDragStart={e => {
                    e.dataTransfer.setData('imageSrc', offering.src || offering.image);
                  }}
                  title="Drag to altar"
                />
              )}
              <span className="text-xs text-center truncate w-12" style={{ color: 'var(--theme-accent, #4A90E2)' }} title={offering.name}>{offering.name}</span>
              <button
                className="mt-1 text-[10px] px-1 py-0.5 focus:outline-none"
                style={{ color: 'var(--theme-danger, #ef4444)', fontSize: '10px', minWidth: '16px', height: '16px', lineHeight: '12px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Delete offering"
                onClick={e => { e.stopPropagation(); handleDeleteOffering(idx, offering); }}
              >
                -
              </button>
            </div>
          ))
        )}
      </div>
      {/* Show manage form only if toggled */}
      {showForm && <>
        <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--theme-accent, #ff5e62)' }}>Manage Offerings</h3>
        <form onSubmit={handleAddOffering} className="flex flex-col gap-2 mb-4">
          <input
            type="text"
            placeholder="Offering Name"
            value={newOffering.name}
            maxLength={maxNameLength}
            onChange={e => setNewOffering({ ...newOffering, name: e.target.value })}
            className="px-3 py-2 rounded border-2 outline-none"
            style={{
              backgroundColor: 'var(--theme-input, #fff)',
              color: 'var(--theme-text, #111827)',
              borderColor: 'var(--theme-border, #e5e7eb)'
            }}
            required
          />
          {/* Only show category input if category prop is not provided */}
          {(!category || category === "") && (
            <input
              type="text"
              placeholder="Category"
              value={newOffering.category}
              onChange={e => setNewOffering({ ...newOffering, category: e.target.value })}
              className="px-3 py-2 rounded border-2 outline-none"
              style={{
                backgroundColor: 'var(--theme-input, #fff)',
                color: 'var(--theme-text, #111827)',
                borderColor: 'var(--theme-border, #e5e7eb)'
              }}
              required
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="px-3 py-2"
            style={{ backgroundColor: 'var(--theme-input, #fff)', color: 'var(--theme-text, #111827)' }}
            required
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-12 h-12 object-cover rounded border mx-auto"
              style={{
                maxWidth: '48px',
                maxHeight: '48px',
                backgroundColor: 'var(--theme-input, #fff)',
                borderColor: 'var(--theme-border, #e5e7eb)'
              }}
            />
          )}
          {error && <div className="text-xs text-center" style={{ color: 'var(--theme-danger, #ef4444)' }}>{error}</div>}
          <button type="submit" className="modern-btn" style={{ backgroundColor: 'var(--theme-accent, #ff5e62)', color: 'var(--theme-card-bg, #fff)' }}>Add Offering</button>
        </form>
      </>}
    </div>
  );
} 