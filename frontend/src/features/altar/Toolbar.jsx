import React from 'react';
import '../../styles/DarkUI.css';

export default function Toolbar({ onAdd, altarStyle, setAltarStyle }) {
  return (
    <aside className="w-64 p-4 shadow-md rounded-lg dark-panel">
      <h2 className="text-xl font-semibold mb-4 dark-text">
        Configuration
      </h2>
      <div className="mb-4">
        <label className="block mb-1 font-medium dark-text">
          🎨Alter Styles
        </label>
        <select
          value={altarStyle}
          onChange={(e) => setAltarStyle(e.target.value)}
          className="w-full px-3 py-2 rounded border-2 focus:ring-2 dark-input"
        >
          <option>CLassic</option>
          <option>Modern</option>
          <option>Traditional</option>
        </select>
      </div>
    </aside>
  );
}