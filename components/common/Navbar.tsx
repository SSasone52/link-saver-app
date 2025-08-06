import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import DarkModeToggle from './DarkModeToggle';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode }) => {
  const { data: session } = useSession();

  return (
    <nav className="bg-white dark:bg-[#1E1E1E] p-4 shadow-md transition-colors duration-300">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-3xl font-extrabold tracking-tight text-[#007BFF] dark:text-[#66B2FF]">
          LinkSaver
        </Link>
        <div className="flex items-center space-x-4">
          <ul className="flex space-x-4 text-[#212121] dark:text-[#E0E0E0]">
            {session ? (
              <>
                <li>
                  <Link href="/dashboard" className="hover:text-[#007BFF] dark:hover:text-[#66B2FF] transition duration-300 ease-in-out">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button onClick={() => signOut()} className="hover:text-[#007BFF] dark:hover:text-[#66B2FF] transition duration-300 ease-in-out">
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/auth/login" className="hover:text-[#007BFF] dark:hover:text-[#66B2FF] transition duration-300 ease-in-out">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/auth/signup" className="hover:text-[#007BFF] dark:hover:text-[#66B2FF] transition duration-300 ease-in-out">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
          <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;