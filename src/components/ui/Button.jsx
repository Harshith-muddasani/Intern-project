import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg active:scale-95';
  
  const variants = {
    primary: 'text-white',
    secondary: 'border-2',
    outline: 'border-2 bg-transparent',
    ghost: 'bg-transparent hover:bg-opacity-10',
    danger: 'text-white',
  };
  
  const sizes = {
    sm: 'px-4 py-1.5 text-sm',
    md: 'px-6 py-2 text-sm',
    lg: 'px-8 py-3 text-base',
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--theme-accent)',
          color: 'white',
        };
      case 'secondary':
        return {
          backgroundColor: 'var(--theme-card-bg)',
          color: 'var(--theme-text)',
          borderColor: 'var(--theme-border)',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: 'var(--theme-accent)',
          borderColor: 'var(--theme-accent)',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'var(--theme-text)',
        };
      case 'danger':
        return {
          backgroundColor: '#ef4444',
          color: 'white',
        };
      default:
        return {
          backgroundColor: 'var(--theme-accent)',
          color: 'white',
        };
    }
  };

  const handleMouseEnter = (e) => {
    if (!disabled) {
      e.target.style.color = '#ff5e62';
      if (variant === 'primary') {
        e.target.style.backgroundColor = 'var(--theme-accent-hover)';
      }
    }
  };

  const handleMouseLeave = (e) => {
    if (!disabled) {
      e.target.style.color = getVariantStyles().color;
      if (variant === 'primary') {
        e.target.style.backgroundColor = 'var(--theme-accent)';
      }
    }
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      style={getVariantStyles()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 