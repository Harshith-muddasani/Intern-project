import React from 'react';

const Card = ({ children, ...props }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-6" {...props}>
      {children}
    </div>
  );
};

export default Card; 