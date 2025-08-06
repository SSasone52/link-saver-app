import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div>
      {label && (
        <label
          htmlFor={props.id}
          className="block text-sm font-medium text-[#212121] dark:text-[#E0E0E0] mb-2"
        >
          {label}
        </label>
      )}
      <input
        className={`block w-full px-4 py-2 border border-[#E0E0E0] rounded-lg shadow-sm placeholder-[#757575] focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent dark:bg-[#1E1E1E] dark:border-[#2C2C2C] dark:text-[#E0E0E0] dark:placeholder-[#A0A0A0] transition duration-200 ease-in-out ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;