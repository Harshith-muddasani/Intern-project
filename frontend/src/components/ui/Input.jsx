import React from 'react';

const Input = ({ label, helperText, ...props }) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
        {...props}
      />
      {helperText && <p className="mt-2 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
};

export default Input; 