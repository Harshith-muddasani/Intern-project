import React, { useState } from 'react';
import '../../styles/DarkUI.css';

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
    <div className="flex flex-col gap-4 rounded-2xl p-4 w-full max-w-[240px] min-w-[180px] mx-auto dark-panel">
      {/* + Button to show form */}
      <div className="flex items-center mb-2">
        <span className="font-bold flex-1 truncate dark-text">
          Altar Styles
        </span>
                 <button
           className="w-7 h-7 flex items-center justify-center rounded-full shadow transition ml-2 dark-button"
           title="Add Altar Style"
           onClick={() => setShowForm(v => !v)}
         >
           {showForm ? '×' : '+'}
         </button>
      </div>
      {/* Preview all styles as a compact row */}
      <div className="flex gap-2 overflow-x-auto pb-2 min-h-[56px] items-center max-w-full">
        {altarStyles.length === 0 ? (
          <span className="text-xs dark-text-muted">No styles yet. Add one below!</span>
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
              <span className="text-[10px] mt-1 text-center truncate w-10 dark-text" title={style.name}>{style.name}</span>
                             <button
                 className="mt-1 text-[10px] px-1 py-0.5 focus:outline-none dark-button danger"
                 style={{ fontSize: '10px', minWidth: '16px', height: '16px', lineHeight: '12px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
        <h3 className="text-lg font-bold mb-2 dark-text">Manage Altar Styles</h3>
        <form onSubmit={handleAddStyle} className="flex flex-col gap-2 mb-4">
          <input
            type="text"
            placeholder="Style Name"
            value={newStyle.name}
            maxLength={maxNameLength}
            onChange={e => setNewStyle({ ...newStyle, name: e.target.value })}
            className="px-3 py-2 rounded border-2 outline-none dark-input"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="px-3 py-2 dark-input"
            required
          />
          {imagePreview && (
                         <img
               src={imagePreview}
               alt="Preview"
               className="w-12 h-12 object-cover rounded border mx-auto"
               style={{
                 maxWidth: '48px',
                 maxHeight: '48px'
               }}
             />
          )}
          {error && <div className="text-xs text-center dark-text-muted">{error}</div>}
          <button type="submit" className="dark-button primary">Add Style</button>
        </form>
      </>}
    </div>
  );
} 