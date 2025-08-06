import React from 'react';
import '../../styles/DarkUI.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  ...props 
}) => {
  const getButtonClass = () => {
    let classes = 'dark-button';
    
    if (variant === 'primary') classes += ' primary';
    if (variant === 'danger') classes += ' danger';
    if (size === 'lg') classes += ' px-6 py-3 text-lg';
    if (size === 'sm') classes += ' px-3 py-1 text-sm';
    
    return `${classes} ${className}`;
  };

  return (
    <button
      className={getButtonClass()}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;