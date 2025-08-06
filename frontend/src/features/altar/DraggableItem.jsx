import React, { useState, useEffect } from 'react';
import { Image as KonvaImage, Group, Rect } from 'react-konva';
import useImage from 'use-image';
import dustbin from '../../assets/dustbin.png';

export default function DraggableItem({ 
  item, 
  stageWidth = 400, 
  stageHeight = 300, 
  isSelected, 
  onSelect, 
  pulse, 
  onDelete, 
  onPositionChange,
  rotation = 0 
}) {
  const [image] = useImage(item.src);
  const [dustbinImg] = useImage(dustbin);
  const width = item.size || 60;
  const height = item.size || 60;

  // Clamp function to keep items within canvas bounds
  const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

  // Add Konva filter for pulse-glow if selected
  const extraProps = {};
  if (pulse) {
    extraProps.shadowColor = '#ff5e62';
    extraProps.shadowBlur = 24;
    extraProps.shadowEnabled = true;
    extraProps.shadowOpacity = 0.5;
  }

  return (
    <Group
      x={item.x}
      y={item.y}
      draggable
      onDragEnd={e => {
        // Clamp position so image stays inside canvas
        const newX = clamp(e.target.x(), 0, stageWidth - width);
        const newY = clamp(e.target.y(), 0, stageHeight - height);
        
        // Update parent component with new position
        if (onPositionChange) {
          onPositionChange(newX, newY);
        }
      }}
      onClick={onSelect}
    >
      <KonvaImage
        image={image}
        width={width}
        height={height}
        offsetX={width / 2}
        offsetY={height / 2}
        x={width / 2}
        y={height / 2}
        rotation={rotation}
        {...extraProps}
      />
      {/* Delete button (show only if selected) */}
      {isSelected && dustbinImg && (
        <Group
          x={width - 16}
          y={-12}
          onClick={onDelete}
          onTap={onDelete}
          style={{ cursor: 'pointer' }}
          className="konva-delete-btn"
        >
          <Rect
            width={20}
            height={20}
            fill="#fff"
            stroke="#ff5e62"
            strokeWidth={2}
            cornerRadius={10}
            shadowBlur={3}
            shadowColor="#ffb88c"
            shadowOpacity={0.3}
          />
          <KonvaImage
            image={dustbinImg}
            width={12}
            height={12}
            x={4}
            y={4}
    />
        </Group>
      )}
    </Group>
  );
}