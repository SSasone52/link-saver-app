import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = 'font-semibold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary:
      'bg-[#007BFF] hover:bg-[#0056b3] text-white focus:ring-[#007BFF] dark:bg-[#66B2FF] dark:hover:bg-[#3399FF]',
    secondary:
      'bg-[#F8F8F8] hover:bg-[#E0E0E0] text-[#212121] focus:ring-[#757575] dark:bg-[#1E1E1E] dark:hover:bg-[#2C2C2C] dark:text-[#E0E0E0]',
    danger:
      'bg-[#DC3545] hover:bg-[#B02A37] text-white focus:ring-[#DC3545] dark:bg-[#FF6B6B] dark:hover:bg-[#FF3333]',
  };
  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;