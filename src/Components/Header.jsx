import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { darkMode, setDarkMode } = useTheme();

    return (
        <header className='bg-blue-100 dark:bg-gray-900 text-gray-900 dark:text-white shadow-md transition-colors duration-200'>
            <div className='max-w-7xl mx-auto flex items-center justify-between px-4 py-3'>
                <Link
                    to='/'
                    className='text-2xl font-bold tracking-wide hover:text-blue-400 transition-colors'
                >
                    Quiz Arena
                </Link>
                {/* Hamburger for mobile */}
                <button
                    className='md:hidden flex flex-col justify-center items-center w-8 h-8'
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label='Toggle menu'
                >
                    <span
                        className={`block h-1 w-6 bg-black mb-1 transition-all ${
                            menuOpen ? 'rotate-45 translate-y-2' : ''
                        }`}
                    ></span>
                    <span
                        className={`block h-1 w-6 bg-black mb-1 transition-all ${
                            menuOpen ? 'opacity-0' : ''
                        }`}
                    ></span>
                    <span
                        className={`block h-1 w-6 bg-black transition-all ${
                            menuOpen ? '-rotate-45 -translate-y-2' : ''
                        }`}
                    ></span>
                </button>
                {/* Desktop Nav */}
                <nav className='hidden md:flex gap-6 items-center'>
                    <Link
                        to='/'
                        className='hover:text-blue-400 transition-colors font-medium'
                    >
                        Home
                    </Link>
                    <Link
                        to='/create-quiz'
                        className='hover:text-blue-400 transition-colors font-medium'
                    >
                        Create Quiz
                    </Link>
                    <Link
                        to='/ai-quiz'
                        className='hover:text-blue-400 transition-colors font-medium'
                    >
                        AI Quiz
                    </Link>
                    <Link
                        to='/leaderboard'
                        className='hover:text-blue-400 transition-colors font-medium'
                    >
                        Leaderboard
                    </Link>
                    <Link
                        to='/login'
                        className='ml-4 px-4 py-1 rounded border border-blue-400 text-blue-600 font-semibold hover:bg-blue-400 hover:text-[#282c34] transition-colors'
                    >
                        Login
                    </Link>
                    <Link
                        to='/signup'
                        className='ml-4 px-4 py-1 rounded border border-blue-400 text-blue-600 font-semibold hover:bg-blue-400 hover:text-[#282c34] transition-colors'
                    >
                        Sign Up
                    </Link>
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className='p-2 rounded-full hover:bg-blue-200 dark:hover:bg-gray-800 transition-colors'
                        aria-label='Toggle theme'
                    >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </nav>
            </div>
            {/* Mobile Nav */}
            {menuOpen && (
                <nav className='md:hidden bg-[#282c34] px-4 pb-4 flex flex-col gap-3'>
                    <Link
                        to='/'
                        className='hover:text-blue-400 transition-colors font-medium'
                        onClick={() => setMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        to='/create-quiz'
                        className='hover:text-blue-800 transition-colors font-medium'
                        onClick={() => setMenuOpen(false)}
                    >
                        Create Quiz
                    </Link>
                    <Link
                        to='/ai-quiz'
                        className='hover:text-blue-800 transition-colors font-medium'
                        onClick={() => setMenuOpen(false)}
                    >
                        AI Quiz
                    </Link>
                    <Link
                        to='/leaderboard'
                        className='hover:text-blue-800 transition-colors font-medium'
                        onClick={() => setMenuOpen(false)}
                    >
                        Leaderboard
                    </Link>
                    <Link
                        to='/signup'
                        className='px-4 py-1 rounded bg-blue-400 text-[#282c34] font-semibold hover:bg-blue-400 transition-colors'
                        onClick={() => setMenuOpen(false)}
                    >
                        Sign Up
                    </Link>
                    <Link
                        to='/login'
                        className='px-4 py-1 rounded border border-blue-400 text-blue-400 font-semibold hover:bg-blue-400 hover:text-[#282c34] transition-colors'
                        onClick={() => setMenuOpen(false)}
                    >
                        Login
                    </Link>
                </nav>
            )}
        </header>
    );
}

export default Header;
