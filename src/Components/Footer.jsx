import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Youtube, MessageCircle } from 'lucide-react';

function Footer() {
    return (
        <footer className='relative bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white w-full overflow-hidden'>
            {/* Background Pattern */}
            <div className='absolute inset-0 opacity-10'>
                <div className='absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse'></div>
                <div
                    className='absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse'
                    style={{ animationDelay: '2s' }}
                ></div>
                <div
                    className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse'
                    style={{ animationDelay: '4s' }}
                ></div>
            </div>

            {/* Glassmorphism Container */}
            <div className='relative backdrop-blur-sm bg-white/5 border-t border-white/10'>
                <div className='max-w-7xl mx-auto px-6 py-12'>
                    {/* Main Content Grid */}
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
                        {/* Brand Section */}
                        <div className='space-y-4'>
                            <h3 className='text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                                Connect with us
                            </h3>
                            <p className='text-gray-300 text-sm leading-relaxed max-w-xs'>
                                Join our community of knowledge enthusiasts and
                                stay updated with the latest quizzes and
                                learning resources.
                            </p>
                            <div className='flex space-x-4'>
                                <a
                                    href='#'
                                    className='text-gray-400 hover:text-white transition-colors'
                                >
                                    <Instagram size={24} />
                                </a>
                                <a
                                    href='#'
                                    className='text-gray-400 hover:text-white transition-colors'
                                >
                                    <Linkedin size={24} />
                                </a>
                                <a
                                    href='#'
                                    className='text-gray-400 hover:text-white transition-colors'
                                >
                                    <Youtube size={24} />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className='text-lg font-semibold mb-4'>
                                Quick Links
                            </h3>
                            <ul className='space-y-2'>
                                <li>
                                    <Link
                                        to='/'
                                        className='text-gray-400 hover:text-white transition-colors'
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to='/quizzes'
                                        className='text-gray-400 hover:text-white transition-colors'
                                    >
                                        Quizzes
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to='/about-us'
                                        className='text-gray-400 hover:text-white transition-colors'
                                    >
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to='/contact-us'
                                        className='text-gray-400 hover:text-white transition-colors'
                                    >
                                        Contact Us
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h3 className='text-lg font-semibold mb-4'>
                                Legal
                            </h3>
                            <ul className='space-y-2'>
                                <li>
                                    <Link
                                        to='/privacy-policy'
                                        className='text-gray-400 hover:text-white transition-colors'
                                    >
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to='/terms-and-conditions'
                                        className='text-gray-400 hover:text-white transition-colors'
                                    >
                                        Terms & Conditions
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className='text-lg font-semibold mb-4'>
                                Contact
                            </h3>
                            <div className='space-y-2 text-gray-400'>
                                <p>Email: support@quizarena.in</p>
                                <Link
                                    to='/contact-us'
                                    className='inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors'
                                >
                                    <MessageCircle size={20} />
                                    <span>Send us a message</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className='pt-8 border-t border-white/10 text-center text-gray-400 text-sm'>
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
