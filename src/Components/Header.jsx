import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, Menu, X, User, LogOut, Settings } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import QuizArenaLogo from '../assets/namelogo.png';
import { useDispatch, useSelector } from 'react-redux';
import { logoutThunk } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileDropdown, setProfileDropdown] = useState(false);
    const { darkMode, setDarkMode } = useTheme();
    const { user } = useSelector((s) => s.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const avatarNode = () => {
        const picture = user?.profilePicture;
        const username = user?.username || 'U';
        if (picture) {
            return (
                <img
                    src={picture}
                    alt='avatar'
                    className='w-10 h-10 rounded-full object-cover border-2 border-white/20 shadow-lg'
                />
            );
        }
        return (
            <div className='w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center text-sm font-bold shadow-lg border-2 border-white/20'>
                {username.charAt(0).toUpperCase()}
            </div>
        );
    };

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/create-quiz', label: 'Create Quiz' },
        { to: '/ai-quiz', label: 'AI Quiz' },
        { to: '/leaderboard', label: 'Leaderboard' },
    ];

    return (
        <header className='sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50 transition-all duration-300'>
            <div className='max-w-7xl mx-auto flex items-center justify-between px-6 py-4'>
                {/* Logo */}
                <Link to='/' className='flex items-center group'>
                    <div className='h-12 w-20 transition-transform duration-300 group-hover:scale-105'>
                        <img
                            src={QuizArenaLogo}
                            alt='Quiz Arena'
                            className='h-full w-full object-contain'
                        />
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className='hidden lg:flex items-center space-x-1'>
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className='px-4 py-2 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-all duration-200 relative group'
                        >
                            {link.label}
                            <span className='absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300'></span>
                        </Link>
                    ))}
                </nav>

                {/* Right Side Controls */}
                <div className='flex items-center space-x-3'>
                    {/* Theme Toggle */}
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className='p-2.5 rounded-full bg-gray-100/70 dark:bg-gray-800/70 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-all duration-200 group'
                        aria-label='Toggle theme'
                    >
                        {darkMode ? (
                            <Sun
                                size={18}
                                className='text-amber-500 group-hover:rotate-180 transition-transform duration-300'
                            />
                        ) : (
                            <Moon
                                size={18}
                                className='text-slate-600 group-hover:-rotate-12 transition-transform duration-300'
                            />
                        )}
                    </button>

                    {/* User Section */}
                    {!user ? (
                        <div className='hidden md:flex items-center space-x-3'>
                            <Link
                                to='/login'
                                className='px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200'
                            >
                                Login
                            </Link>
                            <Link
                                to='/signup'
                                className='px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200'
                            >
                                Sign Up
                            </Link>
                        </div>
                    ) : (
                        <div className='hidden md:block relative'>
                            <button
                                onClick={() =>
                                    setProfileDropdown(!profileDropdown)
                                }
                                className='flex items-center space-x-3 p-2 rounded-full hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-all duration-200 group'
                            >
                                {avatarNode()}
                                <span className='text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'>
                                    {user.username}
                                </span>
                            </button>

                            {/* Profile Dropdown */}
                            {profileDropdown && (
                                <div className='absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl overflow-hidden'>
                                    <div className='p-4 border-b border-gray-100 dark:border-gray-700'>
                                        <p className='text-sm font-medium text-gray-900 dark:text-white'>
                                            {user.username}
                                        </p>
                                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                                            {user.email}
                                        </p>
                                    </div>
                                    <div className='py-2'>
                                        <Link
                                            to='/profile'
                                            className='flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200'
                                            onClick={() =>
                                                setProfileDropdown(false)
                                            }
                                        >
                                            <User size={16} className='mr-3' />
                                            Profile
                                        </Link>
                                        {/* <Link
                                            to='/settings'
                                            className='flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200'
                                            onClick={() =>
                                                setProfileDropdown(false)
                                            }
                                        >
                                            <Settings
                                                size={16}
                                                className='mr-3'
                                            />
                                            Settings
                                        </Link> */}
                                        <button
                                            className='w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200'
                                            onClick={async () => {
                                                setProfileDropdown(false);
                                                const action = await dispatch(
                                                    logoutThunk()
                                                );
                                                if (
                                                    logoutThunk.fulfilled.match(
                                                        action
                                                    )
                                                ) {
                                                    toast.success('Logged out');
                                                    navigate('/');
                                                } else {
                                                    toast.error(
                                                        action.payload ||
                                                            'Logout failed'
                                                    );
                                                }
                                            }}
                                        >
                                            <LogOut
                                                size={16}
                                                className='mr-3'
                                            />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className='lg:hidden p-2.5 rounded-full bg-gray-100/70 dark:bg-gray-800/70 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-all duration-200'
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label='Toggle menu'
                    >
                        {menuOpen ? (
                            <X
                                size={20}
                                className='text-gray-600 dark:text-gray-300'
                            />
                        ) : (
                            <Menu
                                size={20}
                                className='text-gray-600 dark:text-gray-300'
                            />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {menuOpen && (
                <div className='lg:hidden border-t border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl bg-white/90 dark:bg-gray-900/90'>
                    <nav className='px-6 py-4 space-y-2'>
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className='block px-4 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-all duration-200'
                                onClick={() => setMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}

                        <div className='pt-4 border-t border-gray-200/50 dark:border-gray-700/50'>
                            {!user ? (
                                <div className='space-y-2'>
                                    <Link
                                        to='/login'
                                        className='block px-4 py-3 text-center rounded-xl border-2 border-indigo-600 text-indigo-600 font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200'
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to='/signup'
                                        className='block px-4 py-3 text-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg transition-all duration-200'
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            ) : (
                                <div className='space-y-2'>
                                    <div className='flex items-center px-4 py-3'>
                                        {avatarNode()}
                                        <span className='ml-3 text-base font-medium text-gray-900 dark:text-white'>
                                            {user.username}
                                        </span>
                                    </div>
                                    <Link
                                        to='/profile'
                                        className='flex items-center px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-all duration-200'
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <User size={18} className='mr-3' />
                                        Profile
                                    </Link>
                                    {/* <Link
                                        to='/settings'
                                        className='flex items-center px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-all duration-200'
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <Settings size={18} className='mr-3' />
                                        Settings
                                    </Link> */}
                                    <button
                                        className='w-full flex items-center px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200'
                                        onClick={async () => {
                                            setMenuOpen(false);
                                            const action = await dispatch(
                                                logoutThunk()
                                            );
                                            if (
                                                logoutThunk.fulfilled.match(
                                                    action
                                                )
                                            ) {
                                                toast.success('Logged out');
                                                navigate('/');
                                            } else {
                                                toast.error(
                                                    action.payload ||
                                                        'Logout failed'
                                                );
                                            }
                                        }}
                                    >
                                        <LogOut size={18} className='mr-3' />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}

export default Header;
