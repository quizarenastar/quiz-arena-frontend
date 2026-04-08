import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Instagram,
    Linkedin,
    Youtube,
    MessageCircle,
    Mail,
    Sparkles,
    ArrowUpRight,
} from 'lucide-react';

const quickLinks = [
    { to: '/', label: 'Home' },
    { to: '/quizzes', label: 'Quizzes' },
    { to: '/war-rooms', label: 'War Room' },
    { to: '/about-us', label: 'About Us' },
    { to: '/contact-us', label: 'Contact Us' },
];

const legalLinks = [
    { to: '/privacy-policy', label: 'Privacy Policy' },
    { to: '/terms-and-conditions', label: 'Terms & Conditions' },
];

const socials = [
    {
        href: '#',
        label: 'Instagram',
        icon: Instagram,
        hover: 'hover:text-pink-500 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-500/10',
    },
    {
        href: '#',
        label: 'LinkedIn',
        icon: Linkedin,
        hover: 'hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10',
    },
    {
        href: '#',
        label: 'YouTube',
        icon: Youtube,
        hover: 'hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10',
    },
];

function Footer() {
    const location = useLocation();

    if (location.pathname !== '/') {
        return null;
    }

    return (
        <footer className='bg-white dark:bg-[#0d0d1a] border-t border-gray-200/80 dark:border-white/8 text-gray-900 dark:text-gray-100'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12'>
                    {/* Brand */}
                    <div className='sm:col-span-2 lg:col-span-1 space-y-5'>
                        {/* Logo */}
                        <Link
                            to='/'
                            className='inline-flex items-center gap-2 group'
                        >
                            <div className='w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200'>
                                <Sparkles size={14} className='text-white' />
                            </div>
                            <span className='text-lg font-bold tracking-tight text-gray-900 dark:text-white'>
                                Quiz
                                <span className='text-indigo-600 dark:text-indigo-400'>
                                    Arena
                                </span>
                            </span>
                        </Link>

                        <p className='text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs'>
                            Compete, learn, and win. Join thousands of players
                            testing their knowledge every day on Quiz Arena.
                        </p>

                        {/* Socials */}
                        <div className='flex items-center gap-2'>
                            {socials.map(
                                ({ href, label, icon: SocialIcon, hover }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        aria-label={label}
                                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-white/5 transition-all duration-200 ${hover}`}
                                    >
                                        <SocialIcon size={17} />
                                    </a>
                                ),
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className='space-y-4'>
                        <h4 className='text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500'>
                            Navigate
                        </h4>
                        <ul className='space-y-2.5'>
                            {quickLinks.map(({ to, label }) => (
                                <li key={to}>
                                    <Link
                                        to={to}
                                        className='group inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-150'
                                    >
                                        {label}
                                        <ArrowUpRight
                                            size={13}
                                            className='opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150'
                                        />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className='space-y-4'>
                        <h4 className='text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500'>
                            Legal
                        </h4>
                        <ul className='space-y-2.5'>
                            {legalLinks.map(({ to, label }) => (
                                <li key={to}>
                                    <Link
                                        to={to}
                                        className='group inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-150'
                                    >
                                        {label}
                                        <ArrowUpRight
                                            size={13}
                                            className='opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150'
                                        />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className='space-y-4'>
                        <h4 className='text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500'>
                            Contact
                        </h4>
                        <div className='space-y-3'>
                            <a
                                href='mailto:quizarenastar@gmail.com'
                                className='flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-150 group'
                            >
                                <span className='w-7 h-7 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-colors duration-150'>
                                    <Mail size={13} />
                                </span>
                                quizarenastar@gmail.com
                            </a>
                            <Link
                                to='/contact-us'
                                className='flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-150 group'
                            >
                                <span className='w-7 h-7 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-colors duration-150'>
                                    <MessageCircle size={13} />
                                </span>
                                Send us a message
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className='pt-8 border-t border-gray-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3'>
                    <p className='text-xs text-gray-400 dark:text-gray-500'>
                        &copy; {new Date().getFullYear()} Quiz Arena. All rights
                        reserved.
                    </p>
                    <p className='text-xs text-gray-400 dark:text-gray-500'>
                        Built for curious minds &amp; competitive spirits.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
