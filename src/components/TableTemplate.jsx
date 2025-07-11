import React from 'react';

export default function TableTemplate({ headers = [], data = [] }) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="grid" style={{ gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))` }}>
        {headers.map((header, i) => (
          <div key={i} className="font-bold py-2 px-3 bg-transparent text-left text-[#ff5e62]">{header}</div>
        ))}
        {data.map((row, rowIdx) =>
          headers.map((header, colIdx) => (
            <div key={rowIdx + '-' + colIdx} className="py-2 px-3 bg-transparent text-left">
              {row[header]}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 