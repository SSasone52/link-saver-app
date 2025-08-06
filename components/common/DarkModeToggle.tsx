import React from 'react';

interface DarkModeToggleProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({
  darkMode,
  toggleDarkMode,
}) => {
  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full bg-[#F8F8F8] dark:bg-[#1E1E1E] text-[#757575] dark:text-[#A0A0A0] focus:outline-none focus:ring-2 focus:ring-[#007BFF] dark:focus:ring-[#66B2FF] transition-colors duration-300"
      aria-label="Toggle dark mode"
    >
      {darkMode ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.405 4.605a.75.75 0 011.06 0l1.59 1.59a.75.75 0 01-1.06 1.06L7.405 5.665a.75.75 0 010-1.06zM2.25 12a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zM7.405 19.395a.75.75 0 010-1.06l1.59-1.59a.75.75 0 011.06 1.06l-1.59 1.59a.75.75 0 01-1.06 0zM12 17.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V18a.75.75 0 01.75-.75zM16.595 19.395a.75.75 0 01-1.06 0l-1.59-1.59a.75.75 0 011.06-1.06l1.59 1.59a.75.75 0 010 1.06zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5h2.25a.75.75 0 01.75.75zM16.595 4.605a.75.75 0 010 1.06l-1.59 1.59a.75.75 0 01-1.06-1.06l1.59-1.59a.75.75 0 011.06 0zM12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM12 10.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
};

export default DarkModeToggle;