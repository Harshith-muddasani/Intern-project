import React from 'react';
import '../../styles/DarkUI.css';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`dark-card ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card; 