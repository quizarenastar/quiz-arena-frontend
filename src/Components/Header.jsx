import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Moon,
    Sun,
    Menu,
    X,
    User,
    LogOut,
    CreditCard,
    BookOpenCheck,
    BookOpen,
    Sword,
    ChevronDown,
    Sparkles,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
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
    const location = useLocation();
    const dropdownRef = useRef(null);

    const hideHeaderPaths = ['/war-rooms/', '/quiz/'];
    const shouldHide = hideHeaderPaths.some((path) =>
        location.pathname.startsWith(path),
    );

    // Close dropdown on outside click
    useEffect(() => {
        function handleClick(e) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setProfileDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    if (shouldHide) return null;

    const avatar = () => {
        const picture = user?.profilePicture;
        const initial = (user?.username || 'U').charAt(0).toUpperCase();
        if (picture) {
            return (
                <img
                    src={picture}
                    alt='avatar'
                    className='w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/40'
                />
            );
        }
        return (
            <div className='w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center text-sm font-bold ring-2 ring-indigo-500/30'>
                {initial}
            </div>
        );
    };

    const handleLogout = async (closeMenu) => {
        closeMenu();
        const action = await dispatch(logoutThunk());
        if (logoutThunk.fulfilled.match(action)) {
            toast.success('Logged out');
            navigate('/');
        } else {
            toast.error(action.payload || 'Logout failed');
        }
    };

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/quizzes', label: 'Quizzes' },
        { to: '/war-rooms', label: 'War Room', icon: Sword, protected: true },
        { to: '/create-quiz', label: 'Create Quiz', highlight: true },
    ];

    const isActive = (to) =>
        to === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(to);

    return (
        <header className='sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-[#0a0a14]/80 border-b border-gray-200/60 dark:border-white/8 shadow-sm dark:shadow-none transition-colors duration-200'>
            <div className='max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16'>
                {/* ── Logo ── */}
                <Link to='/' className='flex items-center gap-2 group shrink-0'>
                    <div className='w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200'>
                        <Sparkles size={15} className='text-white' />
                    </div>
                    <span className='font-extrabold text-lg tracking-tight text-gray-900 dark:text-white'>
                        Quiz
                        <span className='text-indigo-600 dark:text-indigo-400'>
                            Arena
                        </span>
                    </span>
                </Link>

                {/* ── Desktop Nav ── */}
                <nav className='hidden lg:flex items-center gap-1'>
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const active = isActive(link.to);
                        if (link.highlight) {
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className='ml-1 inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5'
                                >
                                    <Sparkles size={13} />
                                    {link.label}
                                </Link>
                            );
                        }
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                    active
                                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                                }`}
                            >
                                {Icon && <Icon size={14} />}
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* ── Right controls ── */}
                <div className='flex items-center gap-2.5'>
                    {/* Theme toggle */}
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className='p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200/60 dark:border-white/8 transition-all duration-200 group'
                        aria-label='Toggle theme'
                    >
                        {darkMode ? (
                            <Sun
                                size={16}
                                className='text-amber-500 group-hover:rotate-90 transition-transform duration-300'
                            />
                        ) : (
                            <Moon
                                size={16}
                                className='text-slate-600 group-hover:-rotate-12 transition-transform duration-300'
                            />
                        )}
                    </button>

                    {/* Auth */}
                    {!user ? (
                        <div className='hidden md:flex items-center gap-2'>
                            <Link
                                to='/login'
                                className='px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200'
                            >
                                Login
                            </Link>
                            <Link
                                to='/signup'
                                className='px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 rounded-xl shadow-md shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5'
                            >
                                Sign Up
                            </Link>
                        </div>
                    ) : (
                        <div
                            className='hidden md:block relative'
                            ref={dropdownRef}
                        >
                            <button
                                onClick={() =>
                                    setProfileDropdown(!profileDropdown)
                                }
                                className='flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-200 group'
                            >
                                {avatar()}
                                <span className='text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[100px] truncate'>
                                    {user.username}
                                </span>
                                <ChevronDown
                                    size={14}
                                    className={`text-gray-400 transition-transform duration-200 ${profileDropdown ? 'rotate-180' : ''}`}
                                />
                            </button>

                            {/* Dropdown */}
                            {profileDropdown && (
                                <div className='absolute z-50 right-0 top-full mt-2 w-52 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200/60 dark:border-white/8 overflow-hidden'>
                                    {/* User info */}
                                    <div className='px-4 py-3 border-b border-gray-100 dark:border-white/5'>
                                        <p className='text-sm font-semibold text-gray-900 dark:text-white truncate'>
                                            {user.username}
                                        </p>
                                        <p className='text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5'>
                                            {user.email}
                                        </p>
                                    </div>
                                    {/* Menu items */}
                                    <div className='py-1.5'>
                                        {[
                                            {
                                                to: '/profile',
                                                icon: User,
                                                label: 'Profile',
                                            },
                                            {
                                                to: '/wallet',
                                                icon: CreditCard,
                                                label: 'Wallet',
                                            },
                                            {
                                                to: '/my-quizzes',
                                                icon: BookOpen,
                                                label: 'My Quizzes',
                                            },
                                            {
                                                to: '/my-attempts',
                                                icon: BookOpenCheck,
                                                label: 'My Attempts',
                                            },
                                        ].map(({ to, icon, label }) => {
                                            const MenuIcon = icon;
                                            return (
                                                <Link
                                                    key={to}
                                                    to={to}
                                                    onClick={() =>
                                                        setProfileDropdown(
                                                            false,
                                                        )
                                                    }
                                                    className='flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-150'
                                                >
                                                    <MenuIcon
                                                        size={15}
                                                        className='text-gray-400 dark:text-gray-500'
                                                    />
                                                    {label}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                    <div className='py-1.5 border-t border-gray-100 dark:border-white/5'>
                                        <button
                                            onClick={() =>
                                                handleLogout(() =>
                                                    setProfileDropdown(false),
                                                )
                                            }
                                            className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors duration-150'
                                        >
                                            <LogOut size={15} />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Mobile hamburger */}
                    <button
                        className='lg:hidden p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200/60 dark:border-white/8 transition-all duration-200'
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label='Toggle menu'
                    >
                        {menuOpen ? (
                            <X
                                size={18}
                                className='text-gray-700 dark:text-gray-300'
                            />
                        ) : (
                            <Menu
                                size={18}
                                className='text-gray-700 dark:text-gray-300'
                            />
                        )}
                    </button>
                </div>
            </div>

            {/* ── Mobile Menu ── */}
            {menuOpen && (
                <div className='lg:hidden border-t border-gray-200/60 dark:border-white/8 bg-white/95 dark:bg-[#0a0a14]/95 backdrop-blur-xl'>
                    <div className='px-4 py-4 space-y-1'>
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const active = isActive(link.to);
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                        link.highlight
                                            ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white'
                                            : active
                                              ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300'
                                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                                >
                                    {Icon && <Icon size={16} />}
                                    {link.label}
                                </Link>
                            );
                        })}

                        {/* Auth section */}
                        <div className='pt-3 border-t border-gray-200/60 dark:border-white/8 space-y-1'>
                            {!user ? (
                                <>
                                    <Link
                                        to='/login'
                                        onClick={() => setMenuOpen(false)}
                                        className='block px-4 py-3 text-center rounded-xl border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-300 font-medium hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all duration-200 text-sm'
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to='/signup'
                                        onClick={() => setMenuOpen(false)}
                                        className='block px-4 py-3 text-center rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold shadow-lg shadow-indigo-500/20 transition-all duration-200 text-sm'
                                    >
                                        Sign Up Free
                                    </Link>
                                </>
                            ) : (
                                <>
                                    {/* User row */}
                                    <div className='flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5'>
                                        {avatar()}
                                        <div className='min-w-0'>
                                            <p className='text-sm font-semibold text-gray-900 dark:text-white truncate'>
                                                {user.username}
                                            </p>
                                            <p className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                    {[
                                        {
                                            to: '/profile',
                                            icon: User,
                                            label: 'Profile',
                                        },
                                        {
                                            to: '/wallet',
                                            icon: CreditCard,
                                            label: 'Wallet',
                                        },
                                        {
                                            to: '/my-quizzes',
                                            icon: BookOpen,
                                            label: 'My Quizzes',
                                        },
                                        {
                                            to: '/my-attempts',
                                            icon: BookOpenCheck,
                                            label: 'My Attempts',
                                        },
                                    ].map(({ to, icon, label }) => {
                                        const MenuIcon = icon;
                                        return (
                                            <Link
                                                key={to}
                                                to={to}
                                                onClick={() =>
                                                    setMenuOpen(false)
                                                }
                                                className='flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200'
                                            >
                                                <MenuIcon
                                                    size={16}
                                                    className='text-gray-400 dark:text-gray-500'
                                                />
                                                {label}
                                            </Link>
                                        );
                                    })}
                                    <button
                                        onClick={() =>
                                            handleLogout(() =>
                                                setMenuOpen(false),
                                            )
                                        }
                                        className='w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200'
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Header;
