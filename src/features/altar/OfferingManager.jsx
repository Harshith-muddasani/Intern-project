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
    <div className="flex flex-col gap-4 bg-[#fff8f0] border-2 border-orange-200 rounded-2xl p-4 w-full max-w-[240px] min-w-[180px] mx-auto">
      {/* + Button to show form */}
      <div className="flex items-center mb-2">
        <span className="font-bold text-orange-500 flex-1 truncate">Offerings</span>
        <button
          className="w-7 h-7 flex items-center justify-center bg-orange-100 text-[#ff5e62] rounded-full shadow hover:bg-orange-200 hover:text-orange-600 transition ml-2"
          title="Add Offering"
          onClick={() => setShowForm(v => !v)}
        >
          {showForm ? '×' : '+'}
        </button>
      </div>
      {/* Preview all offerings as a grid */}
      <div className="grid grid-cols-3 gap-3 pb-2 min-h-[96px] items-center w-full">
        {(Array.isArray(offerings) ? offerings : []).length === 0 ? (
          <span className="text-gray-400 text-xs col-span-3">No offerings yet. Add one below!</span>
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
              <span className="text-xs text-blue-700 text-center truncate w-12" title={offering.name}>{offering.name}</span>
              <button
                className="mt-1 text-xs text-red-400 hover:text-red-600 focus:outline-none"
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
        <h3 className="text-lg font-bold text-orange-500 mb-2">Manage Offerings</h3>
        <form onSubmit={handleAddOffering} className="flex flex-col gap-2 mb-4">
          <input
            type="text"
            placeholder="Offering Name"
            value={newOffering.name}
            maxLength={maxNameLength}
            onChange={e => setNewOffering({ ...newOffering, name: e.target.value })}
            className="px-3 py-2 rounded border-2 border-orange-200 focus:border-orange-400 outline-none bg-white"
            required
          />
          {/* Only show category input if category prop is not provided */}
          {(!category || category === "") && (
            <input
              type="text"
              placeholder="Category"
              value={newOffering.category}
              onChange={e => setNewOffering({ ...newOffering, category: e.target.value })}
              className="px-3 py-2 rounded border-2 border-orange-200 focus:border-orange-400 outline-none bg-white"
              required
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="px-3 py-2 bg-white"
            required
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-12 h-12 object-cover rounded border border-orange-200 bg-white mx-auto"
              style={{ maxWidth: '48px', maxHeight: '48px' }}
            />
          )}
          {error && <div className="text-red-500 text-xs text-center">{error}</div>}
          <button type="submit" className="modern-btn">Add Offering</button>
        </form>
      </>}
    </div>
  );
} 