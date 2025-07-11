import React from 'react';

export default function Toolbar({ onAdd, altarStyle, setAltarStyle }) {
  return (
    <aside className="w-64 bg-[#fff8f0] text-black p-4 shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-orange-500">Configuration</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium text-orange-500">🎨Alter Styles</label>
        <select
          value={altarStyle}
          onChange={(e) => setAltarStyle(e.target.value)}
          className="w-full px-3 py-2 rounded border-2 border-orange-400 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
        >
          <option>CLassic</option>
          <option>Modern</option>
          <option>Traditional</option>
        </select>
      </div>
    </aside>
  );
}