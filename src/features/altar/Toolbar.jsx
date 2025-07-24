import React from 'react';

export default function Toolbar({ onAdd, altarStyle, setAltarStyle }) {
  return (
    <aside
      className="w-64 p-4 shadow-md rounded-lg"
      style={{
        backgroundColor: 'var(--theme-card-bg, #fff8f0)',
        color: 'var(--theme-text, #111827)',
        border: '1px solid var(--theme-border, #e5e7eb)'
      }}
    >
      <h2
        className="text-xl font-semibold mb-4"
        style={{ color: 'var(--theme-accent, #ff5e62)' }}
      >
        Configuration
      </h2>
      <div className="mb-4">
        <label
          className="block mb-1 font-medium"
          style={{ color: 'var(--theme-accent, #ff5e62)' }}
        >
          🎨Alter Styles
        </label>
        <select
          value={altarStyle}
          onChange={(e) => setAltarStyle(e.target.value)}
          className="w-full px-3 py-2 rounded border-2 focus:ring-2"
          style={{
            backgroundColor: 'var(--theme-input, #fff)',
            color: 'var(--theme-text, #111827)',
            borderColor: 'var(--theme-accent, #ff5e62)'
          }}
        >
          <option>CLassic</option>
          <option>Modern</option>
          <option>Traditional</option>
        </select>
      </div>
    </aside>
  );
}