import React from 'react';

const Button = ({ children, variant = 'primary', ...props }) => {
  const baseStyles = "font-semibold rounded-lg px-4 py-2 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: "bg-accent text-white hover:bg-accent-hover focus:ring-accent",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
    ghost: "bg-transparent text-gray-800 hover:bg-gray-100 focus:ring-gray-400",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
};

export default Button; 