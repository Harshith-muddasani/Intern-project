import React, { useState } from 'react';

export default function AltarStyleManager({ altarStyles, setAltarStyles, onAdd, onDelete, selectedStyle, onSelectStyle }) {
  const [newStyle, setNewStyle] = useState({ name: '', image: null });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const maxNameLength = 24;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewStyle({ ...newStyle, image: reader.result });
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddStyle = async (e) => {
    e.preventDefault();
    setError('');
    const name = newStyle.name.trim();
    if (!name || !newStyle.image) {
      setError('Name and image are required.');
      return;
    }
    if (name.length > maxNameLength) {
      setError(`Name must be at most ${maxNameLength} characters.`);
      return;
    }
    if (altarStyles.some(s => s.name.toLowerCase() === name.toLowerCase())) {
      setError('Style name already exists.');
      return;
    }
    try {
      if (onAdd) {
        await onAdd({ name, value: name, image: newStyle.image });
      } else {
        setAltarStyles(prev => [...prev, { name, value: name, image: newStyle.image }]);
      }
      setNewStyle({ name: '', image: null });
      setImagePreview(null);
    } catch (err) {
      setError(err.message || 'Failed to add style.');
    }
  };

  const handleDeleteStyle = async (idx, style) => {
    setError('');
    try {
      if (onDelete) {
        await onDelete(style);
      } else {
        setAltarStyles(prev => prev.filter((_, i) => i !== idx));
      }
    } catch (err) {
      setError(err.message || 'Failed to delete style.');
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-[#fff8f0] border-2 border-orange-200 rounded-2xl p-4 w-full max-w-[240px] min-w-[180px] mx-auto">
      {/* + Button to show form */}
      <div className="flex items-center mb-2">
        <span className="font-bold text-orange-500 flex-1 truncate">Altar Styles</span>
        <button
          className="w-7 h-7 flex items-center justify-center bg-orange-100 text-[#ff5e62] rounded-full shadow hover:bg-orange-200 hover:text-orange-600 transition ml-2"
          title="Add Altar Style"
          onClick={() => setShowForm(v => !v)}
        >
          {showForm ? '×' : '+'}
        </button>
      </div>
      {/* Preview all styles as a compact row */}
      <div className="flex gap-2 overflow-x-auto pb-2 min-h-[56px] items-center max-w-full">
        {altarStyles.length === 0 ? (
          <span className="text-gray-400 text-xs">No styles yet. Add one below!</span>
        ) : (
          altarStyles.map((style, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center min-w-[48px] max-w-[56px] cursor-pointer transition-all duration-150 ${selectedStyle && selectedStyle.name === style.name ? 'scale-105' : ''}`}
              onClick={() => onSelectStyle && onSelectStyle(style)}
              title={style.name}
            >
              {style.image && (
                <img
                  src={style.image}
                  alt={style.name}
                  className="w-8 h-8 object-cover rounded"
                  style={{ maxWidth: '32px', maxHeight: '32px' }}
                />
              )}
              <span className="text-[10px] text-blue-700 mt-1 text-center truncate w-10" title={style.name}>{style.name}</span>
              <button
                className="mt-1 text-xs text-red-400 hover:text-red-600 focus:outline-none"
                title="Delete style"
                onClick={e => { e.stopPropagation(); handleDeleteStyle(idx, style); }}
              >
                -
              </button>
            </div>
          ))
        )}
      </div>
      {/* Show manage form only if toggled */}
      {showForm && <>
        <h3 className="text-lg font-bold text-orange-500 mb-2">Manage Altar Styles</h3>
        <form onSubmit={handleAddStyle} className="flex flex-col gap-2 mb-4">
          <input
            type="text"
            placeholder="Style Name"
            value={newStyle.name}
            maxLength={maxNameLength}
            onChange={e => setNewStyle({ ...newStyle, name: e.target.value })}
            className="px-3 py-2 rounded border-2 border-orange-200 focus:border-orange-400 outline-none bg-white"
            required
          />
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
          <button type="submit" className="modern-btn">Add Style</button>
        </form>
      </>}
    </div>
  );
} 