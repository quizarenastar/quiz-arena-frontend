import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Youtube, MessageCircle } from 'lucide-react';

function Footer() {
    return (
        <footer className='relative bg-blue-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 w-full overflow-hidden'>
            {/* Glassmorphism Container */}
            <div className='relative backdrop-blur-sm bg-white/5 dark:bg-black/5 border-t border-gray-200 dark:border-gray-800'>
                <div className='max-w-7xl mx-auto px-6 py-12'>
                    {/* Main Content Grid */}
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
                        {/* Brand Section */}
                        <div className='space-y-4'>
                            <h3 className='text-2xl font-bold bg-gradient-to-r from-blue-800 to-gray-600 dark:from-blue-400 dark:to-gray-300 bg-clip-text text-transparent'>
                                Connect with us
                            </h3>
                            <p className='text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-xs'>
                                Join our community of knowledge enthusiasts and
                                stay updated with the latest quizzes and
                                learning resources.
                            </p>
                            <div className='flex space-x-4'>
                                <a
                                    href='#'
                                    className='text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors'
                                >
                                    <Instagram size={24} />
                                </a>
                                <a
                                    href='#'
                                    className='text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                                >
                                    <Linkedin size={24} />
                                </a>
                                <a
                                    href='#'
                                    className='text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors'
                                >
                                    <Youtube size={24} />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className='text-xl font-bold bg-gradient-to-r from-blue-800 to-gray-600 dark:from-blue-400 dark:to-gray-300 bg-clip-text text-transparent'>
                                Quick Links
                            </h3>
                            <ul className='space-y-2'>
                                <li>
                                    <Link
                                        to='/'
                                        className='text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors'
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to='/quizzes'
                                        className='text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors'
                                    >
                                        Quizzes
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to='/about-us'
                                        className='text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors'
                                    >
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to='/contact-us'
                                        className='text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors'
                                    >
                                        Contact Us
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h3 className='text-xl font-bold bg-gradient-to-r from-blue-800 to-gray-600 dark:from-blue-400 dark:to-gray-300 bg-clip-text text-transparent'>
                                Legal
                            </h3>
                            <ul className='space-y-2'>
                                <li>
                                    <Link
                                        to='/privacy-policy'
                                        className='text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors'
                                    >
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to='/terms-and-conditions'
                                        className='text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors'
                                    >
                                        Terms & Conditions
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className='text-xl font-bold bg-gradient-to-r from-blue-800 to-gray-600 dark:from-blue-400 dark:to-gray-300 bg-clip-text text-transparent'>
                                Contact
                            </h3>
                            <div className='space-y-2 text-gray-600 dark:text-gray-400'>
                                <p>Email: quizarenastar@gmail.com</p>
                                <Link
                                    to='/contact-us'
                                    className='inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors'
                                >
                                    <MessageCircle size={20} />
                                    <span>Send us a message</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className='pt-8 border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400 text-sm'>
                        <p>
                            &copy; {new Date().getFullYear()} Quiz Arena. All
                            rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
