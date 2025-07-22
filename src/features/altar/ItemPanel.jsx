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

  const buttonStyles = {
    base: `w-full text-left font-semibold py-3 px-4 transition duration-200 rounded-lg mb-2
          flex items-center justify-between`,
    active: `bg-gray-100 text-gray-800`,
    inactive: `bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800`
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Accordion */}
      <div className="space-y-2">
        {/* Altar Styles first */}
        <div>
          <button
            className={`${buttonStyles.base} ${
              openSection === 'altarStyles' ? buttonStyles.active : buttonStyles.inactive
            }`}
            onClick={() => setOpenSection(openSection === 'altarStyles' ? '' : 'altarStyles')}
          >
            <span>Altar Styles</span>
            <span className="transform transition-transform duration-200" 
                  style={{ transform: openSection === 'altarStyles' ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </button>
          {openSection === 'altarStyles' && (
            <div className="p-4 bg-gray-50 rounded-lg">
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

        <div>
          <button
            className={`${buttonStyles.base} ${
              openSection === 'offerings' ? buttonStyles.active : buttonStyles.inactive
            }`}
            onClick={() => setOpenSection(openSection === 'offerings' ? '' : 'offerings')}
          >
            <span>Offerings</span>
            <span className="transform transition-transform duration-200"
                  style={{ transform: openSection === 'offerings' ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </button>
          {openSection === 'offerings' && (
            <div className="p-4 bg-gray-50 rounded-lg">
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

      {/* Controls for selected item */}
      {selectedIdx !== null && selectedItem && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Resize Selected Item</label>
            <input
              type="range"
              min="32"
              max="160"
              value={resizeValue}
              onChange={onResize}
              className="w-full accent-blue-500"
            />
            <div className="text-xs text-gray-500 text-right">{resizeValue}px</div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Rotate Selected Item</label>
            <input
              type="range"
              min="-180"
              max="180"
              value={rotateValue}
              onChange={onRotate}
              className="w-full accent-blue-500"
            />
            <div className="text-xs text-gray-500 text-right">{rotateValue}°</div>
          </div>
        </div>
      )}
    </div>
  );
}