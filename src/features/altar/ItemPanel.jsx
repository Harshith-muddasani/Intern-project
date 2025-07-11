import React, { useState } from 'react';
import AltarStyleManager from './AltarStyleManager';
import OfferingManager from './OfferingManager';

export default function ItemPanel({
  altarStyles,
  setAltarStyles,
  offerings,
  setOfferings,
  selectedCategory = 'Velas',
  selectedIdx,
  selectedItem,
  resizeValue,
  onResize,
  rotateValue,
  onRotate,
  altarStyle,
  setAltarStyle,
  onAddAltarStyle,
  onDeleteAltarStyle,
  onAddOffering,
  onDeleteOffering
}) {
  const [openSection, setOpenSection] = useState('offerings');

  // Find the selected style object by name
  const selectedStyleObj = altarStyles.find(s => s.name === altarStyle);

  return (
    <div className="sunrise-panel w-full md:w-64 p-4 h-full flex flex-col justify-between bg-[#fff8f0] border-2 border-orange-200 rounded-2xl">
      {/* Accordion */}
      <div className="mb-4">
        {/* Altar Styles first */}
        <div>
          <button
            className={`w-full text-left font-bold py-2 px-3 border-b border-orange-200 transition
            ${openSection === 'altarStyles'
              ? 'bg-gradient-to-r from-orange-100 via-orange-200 to-orange-50 text-[#ff5e62] shadow rounded-t-xl'
              : 'bg-[#fff8f0] text-orange-500 hover:bg-orange-50 hover:text-[#ff5e62]'}
          `}
            onClick={() => setOpenSection(openSection === 'altarStyles' ? '' : 'altarStyles')}
          >
            Altar Styles
          </button>
          {openSection === 'altarStyles' && (
            <div className="p-2 bg-white border-b border-orange-100 rounded-b-xl">
              <AltarStyleManager
                altarStyles={altarStyles}
                setAltarStyles={setAltarStyles}
                onAdd={onAddAltarStyle}
                onDelete={onDeleteAltarStyle}
                selectedStyle={selectedStyleObj}
                onSelectStyle={style => setAltarStyle(style.name)}
              />
            </div>
          )}
        </div>
        {/* Add space between sections */}
        <div className="my-2" />
        <div>
          <button
            className={`w-full text-left font-bold py-2 px-3 border-b border-orange-200 transition
            ${openSection === 'offerings'
              ? 'bg-gradient-to-r from-orange-100 via-orange-200 to-orange-50 text-[#ff5e62] shadow rounded-t-xl'
              : 'bg-[#fff8f0] text-orange-500 hover:bg-orange-50 hover:text-[#ff5e62]'}
          `}
            onClick={() => setOpenSection(openSection === 'offerings' ? '' : 'offerings')}
          >
            Offerings
          </button>
          {openSection === 'offerings' && (
            <div className="p-2 bg-white border-b border-orange-100 rounded-b-xl">
              <OfferingManager
                offerings={Object.values(offerings).flat()}
                setOfferings={setOfferings}
                onAdd={onAddOffering}
                onDelete={onDeleteOffering}
              />
            </div>
          )}
        </div>
      </div>
      {/* Existing controls for selected item (resize/rotate) */}
      {selectedIdx !== null && selectedItem && (
        <div className="flex flex-col items-center mt-8">
          <label className="mb-1 text-sm font-medium text-[#ff5e62]">Resize Selected Sticker</label>
          <input
            type="range"
            min="32"
            max="160"
            value={resizeValue}
            onChange={onResize}
            className="w-40 accent-[#ff5e62] resize-slider"
          />
          <span className="text-xs mt-1">{resizeValue}px</span>
          <label className="mb-1 mt-4 text-sm font-medium text-[#ff5e62]">Rotate Selected Sticker</label>
          <input
            type="range"
            min="-180"
            max="180"
            value={rotateValue}
            onChange={onRotate}
            className="w-40 accent-[#ff5e62] rotate-slider"
          />
          <span className="text-xs mt-1">{rotateValue}°</span>
        </div>
      )}
    </div>
  );
}